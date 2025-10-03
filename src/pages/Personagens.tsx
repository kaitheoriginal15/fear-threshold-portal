import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Personagens = () => {
  const personagens = [
    {
      nome: "Elena Darkmore",
      papel: "A Investigadora",
      descricao: "Uma detetive determinada que busca respostas sobre o desaparecimento de sua irmã, mesmo que isso signifique mergulhar nas trevas mais profundas."
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
                className="bg-dark-card p-6 rounded-lg border-2 border-primary/30 hover:border-primary transition-all hover:scale-[1.02] hover:border-glow group"
                style={{ animationDelay: `${index * 0.1}s` }}
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
    </div>
  );
};

export default Personagens;
