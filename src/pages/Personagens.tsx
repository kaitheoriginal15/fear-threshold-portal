import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import alissonS1 from "@/assets/alisson_s1.jpg";
import alissonS2 from "@/assets/alisson_s2.png";
import alissonS3 from "@/assets/alisson_s3.png";

const Personagens = () => {
  const [isAlissonModalOpen, setIsAlissonModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<"1990" | "1991-1992" | "1995">("1990");

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

  const personagens = [
    {
      nome: "Alisson Lachowski",
      papel: "Agente Fear Threshold - Rank A",
      descricao: "Um Agente do Fear Threshold de Rank A que busca respostas sobre seu passado e qual sua conexão com Malacharion e a Visiones Caelis.",
      onClick: () => setIsAlissonModalOpen(true)
    },
    {
      nome: "Marcus Vale",
      papel: "O Ocultista",
      descricao: "Um estudioso das artes proibidas que carrega o peso de conhecimentos que nenhum mortal deveria possuir."
    },
    {
      nome: "Sophia Grimm",
      papel: "A Médium",
      descricao: "Amaldiçoada desde o nascimento com a capacidade de ver além do véu, ela caminha na linha tênue entre os mundos."
    },
    {
      nome: "Victor Stone",
      papel: "O Caçador",
      descricao: "Um guerreiro marcado por cicatrizes, tanto físicas quanto emocionais, que dedica sua vida a combater as criaturas da noite."
    }
  ];

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-primary mb-8 text-glow animate-fade-in">
            Personagens
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {personagens.map((personagem, index) => (
              <div 
                key={index}
                className="bg-dark-card p-6 rounded-lg border-2 border-primary/30 hover:border-primary transition-all hover:scale-[1.02] hover:border-glow group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={personagem.onClick}
              >
                <h2 className="text-2xl md:text-3xl font-title font-semibold text-primary mb-2 group-hover:text-glow transition-all">
                  {personagem.nome}
                </h2>
                <p className="text-gold-light text-sm md:text-base font-title mb-3">
                  {personagem.papel}
                </p>
                <p className="text-foreground/90 leading-relaxed">
                  {personagem.descricao}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-foreground/90">
                <div>
                  <span className="text-gold-light font-semibold">Nascimento:</span> 30/06/1971
                </div>
                <div>
                  <span className="text-gold-light font-semibold">Gênero:</span> Masculino
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
    </div>
  );
};

export default Personagens;
