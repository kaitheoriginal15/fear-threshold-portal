import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Plus, Trash2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import AddBeastModal from "@/components/AddBeastModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

const Bestiario = () => {
  const [isAddBeastModalOpen, setIsAddBeastModalOpen] = useState(false);
  const [beasts, setBeasts] = useState<Beast[]>([]);
  const [selectedBeast, setSelectedBeast] = useState<Beast | null>(null);
  const [beastModalOpen, setBeastModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadBeasts();
  }, []);

  const loadBeasts = async () => {
    const { data, error } = await supabase
      .from('beasts')
      .select(`
        *,
        beast_stats (
          image_url,
          stats
        )
      `)
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      const transformedData = data.map(beast => ({
        ...beast,
        beast_stats: Array.isArray(beast.beast_stats) && beast.beast_stats.length > 0 
          ? beast.beast_stats[0] 
          : undefined
      }));
      setBeasts(transformedData as Beast[]);
    }
  };

  const deleteBeast = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Tem certeza que deseja excluir esta besta?')) {
      return;
    }

    const { error } = await supabase
      .from('beasts')
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
        title: 'Besta excluída',
        description: 'A besta foi removida com sucesso.',
      });
      loadBeasts();
    }
  };

  const openBeastModal = (beast: Beast) => {
    setSelectedBeast(beast);
    setBeastModalOpen(true);
  };

  const filteredBeasts = beasts.filter(beast => 
    beast.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden flex flex-col">
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
            <h1 className="text-4xl md:text-5xl font-title font-bold text-primary text-center text-glow flex-1">
              Bestiário
            </h1>
            {isAdmin && (
              <button
                onClick={() => setIsAddBeastModalOpen(true)}
                className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center hover:bg-primary/80 transition-colors shadow-lg"
                title="Adicionar Besta"
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
              placeholder="Buscar besta por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-card border-2 border-primary/30 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {filteredBeasts.map((beast, index) => (
              <div 
                key={beast.id}
                className="bg-dark-card p-6 rounded-lg border-2 border-primary/30 hover:border-primary transition-colors group relative cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => openBeastModal(beast)}
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => deleteBeast(beast.id, e)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors"
                      title="Excluir besta"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                )}
                
                <h2 className="text-2xl md:text-3xl font-title font-semibold text-primary mb-2 group-hover:text-glow transition-all">
                  {beast.name}
                </h2>
                <p className="text-gold-light text-sm md:text-base font-title">
                  {beast.status || 'Criatura Desconhecida'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <AddBeastModal
        isOpen={isAddBeastModalOpen}
        onClose={() => setIsAddBeastModalOpen(false)}
        onSuccess={loadBeasts}
      />

      {/* Modal for beast details */}
      <Dialog open={beastModalOpen} onOpenChange={setBeastModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-dark-card border-2 border-primary/50">
          <DialogTitle className="text-3xl font-title text-primary text-center mb-6">
            Perfil da Criatura
          </DialogTitle>
          
          {selectedBeast && (
            <div className="space-y-6">
              {/* Informações básicas */}
              <div className="bg-dark/50 p-6 rounded-lg border border-primary/30">
                <h3 className="text-2xl font-title text-primary mb-4">{selectedBeast.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-foreground/90">
                  {selectedBeast.sighting && (
                    <div>
                      <span className="text-gold-light font-semibold">Avistamento:</span> {selectedBeast.sighting}
                    </div>
                  )}
                  {selectedBeast.rank && (
                    <div>
                      <span className="text-gold-light font-semibold">Rank:</span> {selectedBeast.rank}
                    </div>
                  )}
                  {selectedBeast.status && (
                    <div>
                      <span className="text-gold-light font-semibold">Estado:</span> {selectedBeast.status}
                    </div>
                  )}
                </div>
                {selectedBeast.description && (
                  <p className="mt-4 text-foreground/90 leading-relaxed">
                    {selectedBeast.description}
                  </p>
                )}
              </div>

              {/* Imagem e estatísticas */}
              {selectedBeast.beast_stats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Imagem */}
                  {selectedBeast.beast_stats.image_url && (
                    <div className="flex justify-center items-start">
                      <img
                        src={selectedBeast.beast_stats.image_url}
                        alt={selectedBeast.name}
                        className="rounded-lg border-2 border-primary/50 max-h-[500px] w-auto object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Estatísticas */}
                  {selectedBeast.beast_stats.stats && Object.keys(selectedBeast.beast_stats.stats).length > 0 && (
                    <div className="bg-dark/50 p-6 rounded-lg border border-primary/30">
                      <h4 className="text-xl font-title text-primary mb-4">Estatísticas</h4>
                      <div className="space-y-4">
                        {Object.entries(selectedBeast.beast_stats.stats)
                          .filter(([_, value]) => value !== undefined && value !== null && value !== 0)
                          .map(([key, value]) => {
                            const labels: Record<string, string> = {
                              resistencia: 'Resistência',
                              forca: 'Força',
                              velocidade: 'Velocidade',
                              ilusao: 'Ilusão',
                              inteligencia: 'Inteligência',
                              habilidadeGeral: 'Habilidade Geral',
                            };
                            return (
                              <div key={key}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-gold-light font-semibold">{labels[key] || key}</span>
                                  <span className="text-foreground/90">{value}/10</span>
                                </div>
                                <div className="w-full bg-dark h-3 rounded-full border border-primary/30">
                                  <div
                                    className="bg-gradient-to-r from-primary to-gold-light h-full rounded-full transition-all"
                                    style={{ width: `${((value as number) / 10) * 100}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}

                        {/* Total */}
                        <div className="pt-4 border-t border-primary/30 mt-6">
                          <div className="flex justify-between">
                            <span className="text-primary font-title font-bold text-lg">Total</span>
                            <span className="text-primary font-bold text-lg">
                              {Object.values(selectedBeast.beast_stats.stats)
                                .filter(v => v !== undefined && v !== null && v !== 0)
                                .reduce((sum, v) => sum + (v as number), 0)}/60
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bestiario;
