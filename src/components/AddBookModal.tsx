import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddBookModal = ({ isOpen, onClose, onSuccess }: AddBookModalProps) => {
  const [name, setName] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o nome do livro.",
        variant: "destructive",
      });
      return;
    }

    if (!pdfFile) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF.",
        variant: "destructive",
      });
      return;
    }

    if (pdfFile.type !== "application/pdf") {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos PDF.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload PDF to storage
      const fileExt = "pdf";
      const fileName = `${Date.now()}-${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("books")
        .upload(filePath, pdfFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("books")
        .getPublicUrl(filePath);

      // Insert book record
      const { error: insertError } = await supabase
        .from("books")
        .insert({
          name: name.trim(),
          pdf_url: publicUrl,
        });

      if (insertError) throw insertError;

      toast({
        title: "Sucesso",
        description: "Livro adicionado com sucesso!",
      });

      setName("");
      setPdfFile(null);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar livro.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-dark-card border-2 border-primary/50">
        <DialogTitle className="text-2xl font-title text-primary text-center mb-4">
          Adicionar Novo Livro
        </DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gold-light">
              Nome do Livro
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do livro"
              className="bg-dark border-primary/30 text-foreground"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="pdf" className="text-gold-light">
              Arquivo PDF
            </Label>
            <Input
              id="pdf"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="bg-dark border-primary/30 text-foreground"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                "Adicionar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookModal;
