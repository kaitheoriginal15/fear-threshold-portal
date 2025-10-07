import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface BeastStats {
  resistencia?: number;
  forca?: number;
  velocidade?: number;
  ilusao?: number;
  inteligencia?: number;
  habilidadeGeral?: number;
}

interface Beast {
  id: string;
  name: string;
  sighting?: string;
  status?: string;
  rank?: string;
  description?: string;
  beast_stats?: {
    image_url: string;
    stats: BeastStats;
  };
}

interface EditBeastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  beast: Beast | null;
}

const EditBeastModal = ({ isOpen, onClose, onSuccess, beast }: EditBeastModalProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [sighting, setSighting] = useState('');
  const [status, setStatus] = useState('');
  const [rank, setRank] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stats, setStats] = useState<BeastStats>({
    resistencia: 0,
    forca: 0,
    velocidade: 0,
    ilusao: 0,
    inteligencia: 0,
    habilidadeGeral: 0,
  });

  useEffect(() => {
    if (beast) {
      setName(beast.name);
      setSighting(beast.sighting || '');
      setStatus(beast.status || '');
      setRank(beast.rank || '');
      setDescription(beast.description || '');
      setImageUrl(beast.beast_stats?.image_url || '');
      setStats({
        resistencia: beast.beast_stats?.stats?.resistencia || 0,
        forca: beast.beast_stats?.stats?.forca || 0,
        velocidade: beast.beast_stats?.stats?.velocidade || 0,
        ilusao: beast.beast_stats?.stats?.ilusao || 0,
        inteligencia: beast.beast_stats?.stats?.inteligencia || 0,
        habilidadeGeral: beast.beast_stats?.stats?.habilidadeGeral || 0,
      });
    }
  }, [beast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beast) return;
    
    setLoading(true);

    try {
      // Update beast basic info
      const { error: beastError } = await supabase
        .from('beasts')
        .update({
          name,
          sighting,
          status,
          rank,
          description,
        })
        .eq('id', beast.id);

      if (beastError) throw beastError;

      let finalImageUrl = imageUrl;

      // Upload new image if selected
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

        finalImageUrl = publicUrl;
      }

      // Update beast stats
      const { error: statsError } = await supabase
        .from('beast_stats')
        .update({
          image_url: finalImageUrl,
          stats: stats as any,
        })
        .eq('beast_id', beast.id);

      if (statsError) throw statsError;

      toast({
        title: 'Besta atualizada com sucesso!',
        description: `${name} foi atualizada.`,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar besta',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-primary/20 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl">Editar Besta</DialogTitle>
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
              <Label htmlFor="rank" className="text-white">Rank</Label>
              <Input
                id="rank"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
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
            <h3 className="text-white text-lg font-semibold">Imagem e Estatísticas</h3>
            
            <div className="space-y-2">
              <Label className="text-white">Imagem da Besta</Label>
              {imageUrl && !imageFile && (
                <div className="mb-2">
                  <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded border border-primary/30" />
                  <p className="text-sm text-primary mt-1">Imagem atual</p>
                </div>
              )}
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
                    value={stats[key as keyof BeastStats] || 0}
                    onChange={(e) => setStats({ ...stats, [key]: Number(e.target.value) })}
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
            {loading ? 'Atualizando...' : 'Atualizar Besta'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBeastModal;
