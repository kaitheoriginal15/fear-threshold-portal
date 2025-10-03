import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ResumoArcos = () => {
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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-primary mb-8 text-glow animate-fade-in">
            Resumo dos Arcos
          </h1>
          
          <div className="space-y-8 animate-fade-in">
            <div className="bg-dark-card p-8 rounded-lg border-2 border-primary/30 hover:border-primary/50 transition-colors">
              <h2 className="text-2xl md:text-3xl font-title font-semibold text-primary mb-4">
                Arco I: O Despertar
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                Em um mundo onde a escuridão permeia cada canto, heróis improváveis são chamados para enfrentar horrores além da compreensão humana. O primeiro arco estabelece o cenário sombrio e apresenta as forças malignas que ameaçam consumir tudo.
              </p>
            </div>

            <div className="bg-dark-card p-8 rounded-lg border-2 border-primary/30 hover:border-primary/50 transition-colors">
              <h2 className="text-2xl md:text-3xl font-title font-semibold text-primary mb-4">
                Arco II: A Descida
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                À medida que os mistérios se aprofundam, nossos protagonistas descobrem que o verdadeiro horror pode estar mais próximo do que imaginavam. Alianças são testadas e segredos antigos vêm à tona.
              </p>
            </div>

            <div className="bg-dark-card p-8 rounded-lg border-2 border-primary/30 hover:border-primary/50 transition-colors">
              <h2 className="text-2xl md:text-3xl font-title font-semibold text-primary mb-4">
                Arco III: O Limiar
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                No arco final, tudo converge para um confronto épico. Os heróis devem superar seus medos mais profundos e enfrentar o mal absoluto. Mas a que custo? E o que resta quando o limiar é finalmente cruzado?
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResumoArcos;
