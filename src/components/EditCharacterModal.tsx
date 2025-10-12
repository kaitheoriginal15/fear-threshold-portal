import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  birth_date?: string;
  status?: string;
  gender?: string;
  rank?: string;
  description?: string;
  character_years?: {
    year: number;
    image_url: string;
    stats: {
      resistencia?: number;
      forca?: number;
      velocidade?: number;
      controleEnergia?: number;
      ilusao?: number;
      inteligencia?: number;
      habilidadeGeral?: number;
      conhecimento?: number;
      arsenal?: number;
      reservaEnergia?: number;
    };
  }[];
}

interface EditCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  character: Character | null;
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

const EditCharacterModal = ({ isOpen, onClose, onSuccess, character }: EditCharacterModalProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [status, setStatus] = useState('');
  const [gender, setGender] = useState('');
  const [rank, setRank] = useState('');
  const [description, setDescription] = useState('');
  
  const defaultStats = { resistencia: 0, forca: 0, velocidade: 0, controleEnergia: 0, ilusao: 0, inteligencia: 0, habilidadeGeral: 0, conhecimento: 0, arsenal: 0, reservaEnergia: 0 };
  
  const [yearsData, setYearsData] = useState<YearData[]>([]);
  const [newYear, setNewYear] = useState<string>('');

  useEffect(() => {
    if (character && character.character_years) {
      setName(character.name);
      setBirthDate(character.birth_date || '');
      setStatus(character.status || '');
      setGender(character.gender || '');
      setRank(character.rank || '');
      setDescription(character.description || '');

      // Load existing years data from character
      const loadedYearsData: YearData[] = character.character_years
        .map(cy => ({
          year: cy.year,
          imageUrl: cy.image_url || '',
          imageFile: null,
          stats: {
            resistencia: cy.stats.resistencia || 0,
            forca: cy.stats.forca || 0,
            velocidade: cy.stats.velocidade || 0,
            controleEnergia: cy.stats.controleEnergia || 0,
            ilusao: cy.stats.ilusao || 0,
            inteligencia: cy.stats.inteligencia || 0,
            habilidadeGeral: cy.stats.habilidadeGeral || 0,
            conhecimento: cy.stats.conhecimento || 0,
            arsenal: cy.stats.arsenal || 0,
            reservaEnergia: cy.stats.reservaEnergia || 0,
          }
        }))
        .sort((a, b) => a.year - b.year);
      
      setYearsData(loadedYearsData);
    }
  }, [character]);

  const addYear = () => {
    const year = parseInt(newYear);
    if (isNaN(year) || year < 1000 || year > 9999) {
      toast({
        title: 'Ano inválido',
        description: 'Por favor, insira um ano válido (entre 1000 e 9999).',
        variant: 'destructive',
      });
      return;
    }
    
    if (yearsData.some(y => y.year === year)) {
      toast({
        title: 'Ano já existe',
        description: 'Este ano já foi adicionado.',
        variant: 'destructive',
      });
      return;
    }
    
    const newYearData: YearData = {
      year,
      imageUrl: '',
      imageFile: null,
      stats: { ...defaultStats }
    };
    
    setYearsData(prev => [...prev, newYearData].sort((a, b) => a.year - b.year));
    setNewYear('');
  };

  const removeYear = (year: number) => {
    setYearsData(prev => prev.filter(y => y.year !== year));
  };

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
    if (!character) return;
    
    setLoading(true);

    try {
      // Update character basic info
      const { error: charError } = await supabase
        .from('characters')
        .update({
          name,
          birth_date: birthDate,
          status,
          gender,
          rank,
          description,
        })
        .eq('id', character.id);

      if (charError) throw charError;

      // Delete existing years data
      const { error: deleteError } = await supabase
        .from('character_years')
        .delete()
        .eq('character_id', character.id);

      if (deleteError) throw deleteError;

      // Upload images and insert new years data
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
        title: 'Personagem atualizado com sucesso!',
        description: `${name} foi atualizado.`,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar personagem',
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
          <DialogTitle className="text-primary text-2xl">Editar Personagem</DialogTitle>
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
            <div className="flex justify-between items-center">
              <h3 className="text-white text-lg font-semibold">Anos</h3>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Ex: 1975"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="bg-black/50 border-primary/30 text-white w-32"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addYear();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addYear}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Ano
                </Button>
              </div>
            </div>
            
            {yearsData.length === 0 ? (
              <p className="text-white/60 text-center py-8">
                Nenhum ano adicionado. Adicione anos para configurar as estatísticas do personagem.
              </p>
            ) : (
              <Tabs defaultValue={yearsData[0]?.year.toString()} className="w-full">
                <TabsList className={`grid w-full bg-black/50`} style={{ gridTemplateColumns: `repeat(${yearsData.length}, minmax(0, 1fr))` }}>
                  {yearsData.map((year) => (
                    <TabsTrigger key={year.year} value={year.year.toString()}>
                      {year.year}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {yearsData.map((yearData, index) => (
                  <TabsContent key={yearData.year} value={yearData.year.toString()} className="space-y-4">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeYear(yearData.year)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remover {yearData.year}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Imagem do Personagem</Label>
                      {yearData.imageUrl && !yearData.imageFile && (
                        <div className="mb-2">
                          <img src={yearData.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded border border-primary/30" />
                          <p className="text-sm text-primary mt-1">Imagem atual</p>
                        </div>
                      )}
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
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Atualizando...' : 'Atualizar Personagem'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCharacterModal;
