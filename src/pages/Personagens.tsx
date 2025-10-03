import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Plus, Trash2, Pencil, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import alissonS1 from "@/assets/alisson_s1.jpg";
import alissonS2 from "@/assets/alisson_s2.png";
import alissonS3 from "@/assets/alisson_s3.png";
import { useAuth } from "@/hooks/useAuth";
import AddCharacterModal from "@/components/AddCharacterModal";
import EditCharacterModal from "@/components/EditCharacterModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CharacterYear {
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
  };
}

interface Character {
  id: string;
  name: string;
  birth_date?: string;
  status?: string;
  gender?: string;
  rank?: string;
  description?: string;
  character_years?: CharacterYear[];
}

const Personagens = () => {
  const [isAlissonModalOpen, setIsAlissonModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<"1990" | "1991-1992" | "1995">("1990");
  const [isAddCharacterModalOpen, setIsAddCharacterModalOpen] = useState(false);
  const [isEditCharacterModalOpen, setIsEditCharacterModalOpen] = useState(false);
  const [characterToEdit, setCharacterToEdit] = useState<Character | null>(null);
  const { isAdmin } = useAuth();
  const [dbCharacters, setDbCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [characterModalOpen, setCharacterModalOpen] = useState(false);
  const [selectedCharacterYear, setSelectedCharacterYear] = useState<number>(1990);
  const [searchTerm, setSearchTerm] = useState("");

  const getAlissonImage = () => {
    switch (selectedYear) {
      case "1990":
        return alissonS1;
      case "1991-1992":
        return alissonS2;
      case "1995":
        return alissonS3;
    }
  };

  const getAlissonStats = () => {
    switch (selectedYear) {
      case "1990":
        return [
          { name: "Resistência", value: 3 },
          { name: "Força", value: 5 },
          { name: "Velocidade", value: 3 },
          { name: "Controle de Energia", value: 1 },
          { name: "Ilusão", value: 0 },
          { name: "Inteligência", value: 3 },
          { name: "Habilidade Geral", value: 2 },
          { name: "Conhecimento", value: 0 },
          { name: "Arsenal", value: 0 },
        ];
      case "1991-1992":
        return [
          { name: "Resistência", value: 5 },
          { name: "Força", value: 7 },
          { name: "Velocidade", value: 5 },
          { name: "Controle de Energia", value: 5 },
          { name: "Ilusão", value: 4 },
          { name: "Inteligência", value: 3 },
          { name: "Habilidade Geral", value: 4 },
          { name: "Conhecimento", value: 2 },
          { name: "Arsenal", value: 3 },
        ];
      case "1995":
        return [
          { name: "Resistência", value: 6 },
          { name: "Força", value: 7 },
          { name: "Velocidade", value: 6 },
          { name: "Controle de Energia", value: 7 },
          { name: "Ilusão", value: 5 },
          { name: "Inteligência", value: 3 },
          { name: "Habilidade Geral", value: 5 },
          { name: "Conhecimento", value: 4 },
          { name: "Arsenal", value: 4 },
        ];
    }
  };

  const stats = getAlissonStats();

  const totalStats = stats.reduce((sum, stat) => sum + stat.value, 0);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        character_years (
          year,
          image_url,
          stats
        )
      `)
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      setDbCharacters(data as Character[]);
    }
  };

  const deleteCharacter = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Tem certeza que deseja excluir este personagem?')) {
      return;
    }

    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Personagem excluído',
        description: 'O personagem foi removido com sucesso.',
      });
      loadCharacters();
    }
  };

  const editCharacter = async (character: Character, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Fetch full character data with years
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        character_years (
          year,
          image_url,
          stats
        )
      `)
      .eq('id', character.id)
      .single();

    if (error) {
      toast({
        title: 'Erro ao carregar dados',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    // Transform data to match Character interface
    const transformedData: Character = {
      ...data,
      character_years: data.character_years?.map((cy: any) => ({
        year: cy.year,
        image_url: cy.image_url,
        stats: cy.stats as any
      }))
    };

    setCharacterToEdit(transformedData);
    setIsEditCharacterModalOpen(true);
  };

  const openCharacterModal = (character: Character) => {
    setSelectedCharacter(character);
    const years = character.character_years
      ?.filter(y => y.image_url || Object.values(y.stats || {}).some(v => v && v > 0))
      .map(y => y.year)
      .sort() || [];
    setSelectedCharacterYear(years[0] || 1990);
    setCharacterModalOpen(true);
  };

  const personagens = dbCharacters
    .filter(char => 
      char.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(char => ({
      nome: char.name,
      papel: `${char.rank ? `Rank ${char.rank}` : 'Personagem'}`,
      imagem: char.character_years?.sort((a, b) => a.year - b.year)[0]?.image_url || '',
      onClick: () => openCharacterModal(char),
      id: char.id,
    }));

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-title">Voltar</span>
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-primary text-glow animate-fade-in">
              Personagens
            </h1>
            {isAdmin && (
              <button
                onClick={() => setIsAddCharacterModalOpen(true)}
                className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center hover:bg-primary/80 transition-colors shadow-lg"
                title="Adicionar Personagem"
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
              placeholder="Buscar personagem por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-card border-2 border-primary/30 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {personagens.map((personagem, index) => (
              <div 
                key={index}
                className={`bg-dark-card p-6 rounded-lg border-2 border-primary/30 hover:border-primary transition-colors group relative ${personagem.onClick ? 'cursor-pointer' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={personagem.onClick || undefined}
              >
                {isAdmin && personagem.id && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => editCharacter(dbCharacters.find(c => c.id === personagem.id)!, e)}
                      className="p-2 bg-primary/20 hover:bg-primary/40 rounded-full transition-colors"
                      title="Editar personagem"
                    >
                      <Pencil className="w-5 h-5 text-primary" />
                    </button>
                    <button
                      onClick={(e) => deleteCharacter(personagem.id!, e)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors"
                      title="Excluir personagem"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                )}
                
                <h2 className="text-2xl md:text-3xl font-title font-semibold text-primary mb-2 group-hover:text-glow transition-all">
                  {personagem.nome}
                </h2>
                <p className="text-gold-light text-sm md:text-base font-title">
                  {personagem.papel}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <Dialog open={isAlissonModalOpen} onOpenChange={setIsAlissonModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-dark-card border-2 border-primary/50">
          <DialogTitle className="text-3xl font-title text-primary text-center mb-6">
            Perfil do Personagem
          </DialogTitle>
          
          <div className="space-y-6">
            {/* Informações básicas */}
            <div className="bg-dark/50 p-6 rounded-lg border border-primary/30">
              <h3 className="text-2xl font-title text-primary mb-4">Alisson Lachowski</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-foreground/90">
                <div>
                  <span className="text-gold-light font-semibold">Nascimento:</span> 30/06/1971
                </div>
                <div>
                  <span className="text-gold-light font-semibold">Gênero:</span> Masculino
                </div>
                <div>
                  <span className="text-gold-light font-semibold">Estado:</span> Vivo
                </div>
                <div>
                  <span className="text-gold-light font-semibold">Rank:</span> A
                </div>
              </div>
              <p className="mt-4 text-foreground/90 leading-relaxed">
                Um Agente do Fear Threshold de Rank A que busca respostas sobre seu passado e qual sua conexão com Malacharion e a Visiones Caelis.
              </p>
            </div>

            {/* Botões de seleção de ano */}
            <div className="flex justify-center gap-4">
              <Button
                variant={selectedYear === "1990" ? "default" : "outline"}
                onClick={() => setSelectedYear("1990")}
                className="font-title"
              >
                1990
              </Button>
              <Button
                variant={selectedYear === "1991-1992" ? "default" : "outline"}
                onClick={() => setSelectedYear("1991-1992")}
                className="font-title"
              >
                1991-1992
              </Button>
              <Button
                variant={selectedYear === "1995" ? "default" : "outline"}
                onClick={() => setSelectedYear("1995")}
                className="font-title"
              >
                1995
              </Button>
            </div>

            {/* Imagem e estatísticas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Imagem */}
              <div className="flex justify-center items-start">
                <img
                  src={getAlissonImage()}
                  alt={`Alisson em ${selectedYear}`}
                  className="rounded-lg border-2 border-primary/50 max-h-[500px] w-auto object-cover"
                />
              </div>

              {/* Estatísticas */}
              <div className="bg-dark/50 p-6 rounded-lg border border-primary/30">
                <h4 className="text-xl font-title text-primary mb-4">Estatísticas</h4>
                <div className="space-y-4">
                  {stats.map((stat) => (
                    <div key={stat.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gold-light font-semibold">{stat.name}</span>
                        <span className="text-foreground/90">{stat.value}/10</span>
                      </div>
                      <div className="w-full bg-dark h-3 rounded-full border border-primary/30">
                        <div
                          className="bg-gradient-to-r from-primary to-gold-light h-full rounded-full transition-all"
                          style={{ width: `${(stat.value / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {/* Total */}
                  <div className="pt-4 border-t border-primary/30 mt-6">
                    <div className="flex justify-between">
                      <span className="text-primary font-title font-bold text-lg">Total</span>
                      <span className="text-primary font-bold text-lg">{totalStats}/90</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddCharacterModal
        isOpen={isAddCharacterModalOpen}
        onClose={() => setIsAddCharacterModalOpen(false)}
        onSuccess={loadCharacters}
      />

      <EditCharacterModal
        isOpen={isEditCharacterModalOpen}
        onClose={() => {
          setIsEditCharacterModalOpen(false);
          setCharacterToEdit(null);
        }}
        onSuccess={loadCharacters}
        character={characterToEdit}
      />

      {/* Modal for database characters */}
      <Dialog open={characterModalOpen} onOpenChange={setCharacterModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-dark-card border-2 border-primary/50">
          <DialogTitle className="text-3xl font-title text-primary text-center mb-6">
            Perfil do Personagem
          </DialogTitle>
          
          {selectedCharacter && (
            <div className="space-y-6">
              {/* Informações básicas */}
              <div className="bg-dark/50 p-6 rounded-lg border border-primary/30">
                <h3 className="text-2xl font-title text-primary mb-4">{selectedCharacter.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-foreground/90">
                  {selectedCharacter.birth_date && (
                    <div>
                      <span className="text-gold-light font-semibold">Nascimento:</span> {selectedCharacter.birth_date}
                    </div>
                  )}
                  {selectedCharacter.gender && (
                    <div>
                      <span className="text-gold-light font-semibold">Gênero:</span> {selectedCharacter.gender}
                    </div>
                  )}
                  {selectedCharacter.status && (
                    <div>
                      <span className="text-gold-light font-semibold">Estado:</span> {selectedCharacter.status}
                    </div>
                  )}
                  {selectedCharacter.rank && (
                    <div>
                      <span className="text-gold-light font-semibold">Rank:</span> {selectedCharacter.rank}
                    </div>
                  )}
                </div>
                {selectedCharacter.description && (
                  <p className="mt-4 text-foreground/90 leading-relaxed">
                    {selectedCharacter.description}
                  </p>
                )}
              </div>

              {/* Botões de seleção de ano */}
              {selectedCharacter.character_years && selectedCharacter.character_years.filter(y => 
                y.image_url || Object.values(y.stats || {}).some(v => v && v > 0)
              ).length > 0 && (
                <>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {selectedCharacter.character_years
                      .filter(y => y.image_url || Object.values(y.stats || {}).some(v => v && v > 0))
                      .sort((a, b) => a.year - b.year)
                      .map((yearData) => (
                        <Button
                          key={yearData.year}
                          variant={selectedCharacterYear === yearData.year ? "default" : "outline"}
                          onClick={() => setSelectedCharacterYear(yearData.year)}
                          className="font-title"
                        >
                          {yearData.year}
                        </Button>
                      ))}
                  </div>

                  {/* Imagem e estatísticas */}
                  {(() => {
                    const currentYearData = selectedCharacter.character_years.find(
                      y => y.year === selectedCharacterYear
                    );
                    
                    if (!currentYearData) return null;

                    const stats = [
                      { name: "Resistência", value: currentYearData.stats.resistencia || 0 },
                      { name: "Força", value: currentYearData.stats.forca || 0 },
                      { name: "Velocidade", value: currentYearData.stats.velocidade || 0 },
                      { name: "Controle de Energia", value: currentYearData.stats.controleEnergia || 0 },
                      { name: "Ilusão", value: currentYearData.stats.ilusao || 0 },
                      { name: "Inteligência", value: currentYearData.stats.inteligencia || 0 },
                      { name: "Habilidade Geral", value: currentYearData.stats.habilidadeGeral || 0 },
                      { name: "Conhecimento", value: currentYearData.stats.conhecimento || 0 },
                      { name: "Arsenal", value: currentYearData.stats.arsenal || 0 },
                    ];

                    const totalStats = stats.reduce((sum, stat) => sum + stat.value, 0);

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Imagem */}
                        {currentYearData.image_url && (
                          <div className="flex justify-center items-start">
                            <img
                              src={currentYearData.image_url}
                              alt={`${selectedCharacter.name} em ${selectedCharacterYear}`}
                              className="rounded-lg border-2 border-primary/50 max-h-[500px] w-auto object-cover"
                            />
                          </div>
                        )}

                        {/* Estatísticas */}
                        <div className="bg-dark/50 p-6 rounded-lg border border-primary/30">
                          <h4 className="text-xl font-title text-primary mb-4">Estatísticas</h4>
                          <div className="space-y-4">
                            {stats.map((stat) => (
                              <div key={stat.name}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-gold-light font-semibold">{stat.name}</span>
                                  <span className="text-foreground/90">{stat.value}/10</span>
                                </div>
                                <div className="w-full bg-dark h-3 rounded-full border border-primary/30">
                                  <div
                                    className="bg-gradient-to-r from-primary to-gold-light h-full rounded-full transition-all"
                                    style={{ width: `${(stat.value / 10) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                            
                            {/* Total */}
                            <div className="pt-4 border-t border-primary/30 mt-6">
                              <div className="flex justify-between">
                                <span className="text-primary font-title font-bold text-lg">Total</span>
                                <span className="text-primary font-bold text-lg">{totalStats}/90</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Personagens;
