import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ResumoArcos = () => {
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-primary text-glow animate-fade-in mb-8">
            Resumo dos Arcos
          </h1>
          
          <div className="space-y-8 animate-fade-in">
            <p className="text-foreground/80 text-center text-lg">
              Em breve...
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResumoArcos;
