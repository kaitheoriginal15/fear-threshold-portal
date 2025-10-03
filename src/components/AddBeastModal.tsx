import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AddBeastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddBeastModal = ({ isOpen, onClose, onSuccess }: AddBeastModalProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [sighting, setSighting] = useState('');
  const [status, setStatus] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [stats, setStats] = useState({
    resistencia: 0,
    forca: 0,
    velocidade: 0,
    ilusao: 0,
    inteligencia: 0,
    habilidadeGeral: 0,
  });

  const updateStat = (key: string, value: string) => {
    setStats(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: beast, error: beastError } = await supabase
        .from('beasts')
        .insert({
          name,
          sighting,
          status,
          gender,
          description,
        })
        .select()
        .single();

      if (beastError) throw beastError;

      // Upload image if provided
      let imageUrl = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${beast.id}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('character-images')
          .upload(filePath, imageFile, {
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('character-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Insert stats
      const { error: statsError } = await supabase
        .from('beast_stats')
        .insert({
          beast_id: beast.id,
          image_url: imageUrl,
          stats: stats,
        });

      if (statsError) throw statsError;

      toast({
        title: 'Besta criada com sucesso!',
        description: `${name} foi adicionada ao bestiário.`,
      });

      onSuccess();
      onClose();
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Erro ao criar besta',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setSighting('');
    setStatus('');
    setGender('');
    setDescription('');
    setImageFile(null);
    setStats({
      resistencia: 0,
      forca: 0,
      velocidade: 0,
      ilusao: 0,
      inteligencia: 0,
      habilidadeGeral: 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-primary/20 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl">Adicionar Nova Besta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-black/50 border-primary/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sighting" className="text-white">Avistamento</Label>
              <Input
                id="sighting"
                value={sighting}
                onChange={(e) => setSighting(e.target.value)}
                className="bg-black/50 border-primary/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white">Estado</Label>
              <Input
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-black/50 border-primary/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-white">Gênero</Label>
              <Input
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="bg-black/50 border-primary/30 text-white"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description" className="text-white">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-black/50 border-primary/30 text-white"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Imagem da Besta</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImageFile(file);
                }}
                className="bg-black/50 border-primary/30 text-white"
              />
              {imageFile && (
                <p className="text-sm text-primary">{imageFile.name}</p>
              )}
            </div>
            
            <h3 className="text-white text-lg font-semibold">Estatísticas</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'resistencia', label: 'Resistência' },
                { key: 'forca', label: 'Força' },
                { key: 'velocidade', label: 'Velocidade' },
                { key: 'ilusao', label: 'Ilusão' },
                { key: 'inteligencia', label: 'Inteligência' },
                { key: 'habilidadeGeral', label: 'Habilidade Geral' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label className="text-white">{label}</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={stats[key as keyof typeof stats]}
                    onChange={(e) => updateStat(key, e.target.value)}
                    className="bg-black/50 border-primary/30 text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Besta'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBeastModal;
