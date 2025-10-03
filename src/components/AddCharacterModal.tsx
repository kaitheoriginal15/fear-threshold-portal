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
  stats: {
    forca: number;
    velocidade: number;
    resistencia: number;
    inteligencia: number;
    habilidade: number;
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
  
  const [yearsData, setYearsData] = useState<YearData[]>([
    { year: 1990, imageUrl: '', stats: { forca: 0, velocidade: 0, resistencia: 0, inteligencia: 0, habilidade: 0 } },
    { year: 1991, imageUrl: '', stats: { forca: 0, velocidade: 0, resistencia: 0, inteligencia: 0, habilidade: 0 } },
    { year: 1992, imageUrl: '', stats: { forca: 0, velocidade: 0, resistencia: 0, inteligencia: 0, habilidade: 0 } },
    { year: 1993, imageUrl: '', stats: { forca: 0, velocidade: 0, resistencia: 0, inteligencia: 0, habilidade: 0 } },
    { year: 1994, imageUrl: '', stats: { forca: 0, velocidade: 0, resistencia: 0, inteligencia: 0, habilidade: 0 } },
    { year: 1995, imageUrl: '', stats: { forca: 0, velocidade: 0, resistencia: 0, inteligencia: 0, habilidade: 0 } },
  ]);

  const updateYearData = (yearIndex: number, field: string, value: string | number) => {
    setYearsData(prev => {
      const updated = [...prev];
      if (field === 'imageUrl') {
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

      const yearInserts = yearsData.map(yearData => ({
        character_id: character.id,
        year: yearData.year,
        image_url: yearData.imageUrl,
        stats: yearData.stats,
      }));

      const { error: yearsError } = await supabase
        .from('character_years')
        .insert(yearInserts);

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
      { year: 1990, imageUrl: '', stats: { forca: 0, velocidade: 0, resistencia: 0, inteligencia: 0, habilidade: 0 } },
      { year: 1991, imageUrl: '', stats: { forca: 0, velocidade: 0, resistencia: 0, inteligencia: 0, habilidade: 0 } },
      { year: 1992, imageUrl: '', stats: { forca: 0, velocidade: 0, resistencia: 0, inteligencia: 0, habilidade: 0 } },
      { year: 1993, imageUrl: '', stats: { forca: 0, velocidade: 0, resistencia: 0, inteligencia: 0, habilidade: 0 } },
      { year: 1994, imageUrl: '', stats: { forca: 0, velocidade: 0, resistencia: 0, inteligencia: 0, habilidade: 0 } },
      { year: 1995, imageUrl: '', stats: { forca: 0, velocidade: 0, resistencia: 0, inteligencia: 0, habilidade: 0 } },
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
                    <Label className="text-white">URL da Imagem</Label>
                    <Input
                      value={yearData.imageUrl}
                      onChange={(e) => updateYearData(index, 'imageUrl', e.target.value)}
                      className="bg-black/50 border-primary/30 text-white"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.keys(yearData.stats).map((stat) => (
                      <div key={stat} className="space-y-2">
                        <Label className="text-white capitalize">{stat}</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={yearData.stats[stat as keyof typeof yearData.stats]}
                          onChange={(e) => updateYearData(index, stat, e.target.value)}
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
