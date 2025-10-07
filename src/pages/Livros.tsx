import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import conceitosImage from "@/assets/conceitos.png";
import { ArrowLeft, Plus, Trash2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AddBookModal from "@/components/AddBookModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Book {
  id: string;
  name: string;
  pdf_url: string;
}

const Livros = () => {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("");
  const [selectedBookName, setSelectedBookName] = useState("");
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setBooks(data);
    }
  };

  const openPdfModal = (pdfUrl: string, bookName: string) => {
    setSelectedPdfUrl(pdfUrl);
    setSelectedBookName(bookName);
    setIsPdfModalOpen(true);
  };

  const deleteBook = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Tem certeza que deseja excluir este livro?")) {
      return;
    }

    const { error } = await supabase.from("books").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Livro excluído",
        description: "O livro foi removido com sucesso.",
      });
      loadBooks();
    }
  };

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden flex flex-col">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16 relative z-10 flex-grow">
        <div className="max-w-7xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-title">Voltar</span>
          </Link>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-primary text-glow animate-fade-in">
              Livros
            </h1>
            {isAdmin && (
              <button
                onClick={() => setIsAddBookModalOpen(true)}
                className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center hover:bg-primary/80 transition-colors shadow-lg"
                title="Adicionar Livro"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar livro por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-card border-2 border-primary/30 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books
              .filter(book => book.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((book) => (
              <div key={book.id} className="relative group">
                {isAdmin && (
                  <button
                    onClick={(e) => deleteBook(book.id, e)}
                    className="absolute top-4 right-4 z-10 p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="Excluir livro"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                )}
                <FeatureCard
                  title={book.name}
                  image={conceitosImage}
                  onClick={() => openPdfModal(book.pdf_url, book.name)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] bg-dark-card border-2 border-primary/50 p-4">
          <DialogTitle className="text-2xl font-title text-primary text-center mb-2">
            {selectedBookName}
          </DialogTitle>
          <div className="w-full h-[calc(95vh-80px)]">
            <iframe 
              src={selectedPdfUrl}
              className="w-full h-full rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>

      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        onSuccess={loadBooks}
      />
    </div>
  );
};

export default Livros;
