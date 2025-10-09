import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

const seasons = [
  {
    id: 1,
    title: "Temporada 1: O Filho do Mal",
    description: "Conteúdo da primeira temporada..."
  },
  {
    id: 2,
    title: "Temporada 2: Beowulf",
    description: "Conteúdo da segunda temporada..."
  },
  {
    id: 3,
    title: "Temporada 3: Céu e Terra",
    description: "Conteúdo da terceira temporada..."
  },
  {
    id: 4,
    title: "Temporada 4: Retorno",
    description: "Conteúdo da quarta temporada..."
  },
  {
    id: 5,
    title: "Spin Off: A Guerra dos Reis",
    description: "Conteúdo do spin-off..."
  }
];

const ResumoArcos = () => {
  const [selectedSeason, setSelectedSeason] = useState<typeof seasons[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (season: typeof seasons[0]) => {
    setSelectedSeason(season);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16 flex-grow">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-title">Voltar</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-primary text-glow animate-fade-in mb-8 text-center">
            Resumo dos Arcos
          </h1>
          
          <div className="space-y-4 animate-fade-in">
            {seasons.map((season, index) => (
              <Card
                key={season.id}
                className="bg-dark-card border-2 border-primary/30 hover:border-primary transition-all cursor-pointer p-6 group"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => openModal(season)}
              >
                <h2 className="text-2xl md:text-3xl font-title font-semibold text-primary group-hover:text-glow transition-all">
                  {season.title}
                </h2>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal para detalhes da temporada */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-dark-card border-2 border-primary/50">
          {selectedSeason && (
            <>
              <DialogTitle className="text-3xl font-title text-primary text-center mb-6">
                {selectedSeason.title}
              </DialogTitle>
              
              <div className="space-y-6">
                <div className="bg-dark/50 p-6 rounded-lg border border-primary/30">
                  <p className="text-foreground/90 text-lg leading-relaxed">
                    {selectedSeason.description}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumoArcos;
