import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface YearData {
  year: number;
  imageUrl: string;
  imageFile: File | null;
  stats: {
    resistencia: number;
    forca: number;
    velocidade: number;
    controleEnergia: number;
    ilusao: number;
    inteligencia: number;
    habilidadeGeral: number;
    conhecimento: number;
    arsenal: number;
    reservaEnergia: number;
  };
}

const AddCharacterModal = ({ isOpen, onClose, onSuccess }: AddCharacterModalProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [status, setStatus] = useState('');
  const [gender, setGender] = useState('');
  const [rank, setRank] = useState('');
  const [description, setDescription] = useState('');
  
  const defaultStats = { resistencia: 0, forca: 0, velocidade: 0, controleEnergia: 0, ilusao: 0, inteligencia: 0, habilidadeGeral: 0, conhecimento: 0, arsenal: 0, reservaEnergia: 0 };
  
  const [yearsData, setYearsData] = useState<YearData[]>([
    { year: 1990, imageUrl: '', imageFile: null, stats: { ...defaultStats } },
    { year: 1991, imageUrl: '', imageFile: null, stats: { ...defaultStats } },
    { year: 1992, imageUrl: '', imageFile: null, stats: { ...defaultStats } },
    { year: 1993, imageUrl: '', imageFile: null, stats: { ...defaultStats } },
    { year: 1994, imageUrl: '', imageFile: null, stats: { ...defaultStats } },
    { year: 1995, imageUrl: '', imageFile: null, stats: { ...defaultStats } },
  ]);

  const updateYearData = (yearIndex: number, field: string, value: string | number | File) => {
    setYearsData(prev => {
      const updated = [...prev];
      if (field === 'imageFile') {
        updated[yearIndex].imageFile = value as File;
      } else if (field === 'imageUrl') {
        updated[yearIndex].imageUrl = value as string;
      } else {
        updated[yearIndex].stats = {
          ...updated[yearIndex].stats,
          [field]: Number(value)
        };
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: character, error: charError } = await supabase
        .from('characters')
        .insert({
          name,
          birth_date: birthDate,
          status,
          gender,
          rank,
          description,
        })
        .select()
        .single();

      if (charError) throw charError;

      // Upload images and get URLs
      const yearInsertsWithUrls = await Promise.all(
        yearsData.map(async (yearData) => {
          let imageUrl = yearData.imageUrl;

          if (yearData.imageFile) {
            const fileExt = yearData.imageFile.name.split('.').pop();
            const fileName = `${character.id}_${yearData.year}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('character-images')
              .upload(filePath, yearData.imageFile, {
                upsert: true
              });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('character-images')
              .getPublicUrl(filePath);

            imageUrl = publicUrl;
          }

          return {
            character_id: character.id,
            year: yearData.year,
            image_url: imageUrl,
            stats: yearData.stats,
          };
        })
      );

      const { error: yearsError } = await supabase
        .from('character_years')
        .insert(yearInsertsWithUrls);

      if (yearsError) throw yearsError;

      toast({
        title: 'Personagem criado com sucesso!',
        description: `${name} foi adicionado ao sistema.`,
      });

      onSuccess();
      onClose();
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Erro ao criar personagem',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setBirthDate('');
    setStatus('');
    setGender('');
    setRank('');
    setDescription('');
    setYearsData([
      { year: 1990, imageUrl: '', imageFile: null, stats: { ...defaultStats } },
      { year: 1991, imageUrl: '', imageFile: null, stats: { ...defaultStats } },
      { year: 1992, imageUrl: '', imageFile: null, stats: { ...defaultStats } },
      { year: 1993, imageUrl: '', imageFile: null, stats: { ...defaultStats } },
      { year: 1994, imageUrl: '', imageFile: null, stats: { ...defaultStats } },
      { year: 1995, imageUrl: '', imageFile: null, stats: { ...defaultStats } },
    ]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-primary/20 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl">Adicionar Novo Personagem</DialogTitle>
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
              <Label htmlFor="birthDate" className="text-white">Nascimento</Label>
              <Input
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
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
            <h3 className="text-white text-lg font-semibold">Anos (1990-1995)</h3>
            <Tabs defaultValue="1990" className="w-full">
              <TabsList className="grid grid-cols-6 w-full bg-black/50">
                {yearsData.map((year) => (
                  <TabsTrigger key={year.year} value={year.year.toString()}>
                    {year.year}
                  </TabsTrigger>
                ))}
              </TabsList>
              {yearsData.map((yearData, index) => (
                <TabsContent key={yearData.year} value={yearData.year.toString()} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Imagem do Personagem</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) updateYearData(index, 'imageFile', file);
                      }}
                      className="bg-black/50 border-primary/30 text-white"
                    />
                    {yearData.imageFile && (
                      <p className="text-sm text-primary">{yearData.imageFile.name}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { key: 'resistencia', label: 'Resistência' },
                      { key: 'forca', label: 'Força' },
                      { key: 'velocidade', label: 'Velocidade' },
                      { key: 'controleEnergia', label: 'Controle de Energia' },
                      { key: 'ilusao', label: 'Ilusão' },
                      { key: 'inteligencia', label: 'Inteligência' },
                      { key: 'habilidadeGeral', label: 'Habilidade Geral' },
                      { key: 'conhecimento', label: 'Conhecimento' },
                      { key: 'arsenal', label: 'Arsenal' },
                      { key: 'reservaEnergia', label: 'Reserva de Energia' },
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-2">
                        <Label className="text-white">{label}</Label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={yearData.stats[key as keyof typeof yearData.stats]}
                          onChange={(e) => updateYearData(index, key, e.target.value)}
                          className="bg-black/50 border-primary/30 text-white"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Personagem'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCharacterModal;
