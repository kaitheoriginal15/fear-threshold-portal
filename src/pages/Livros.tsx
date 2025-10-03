import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import conceitosImage from "@/assets/conceitos.png";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Livros = () => {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-title">Voltar</span>
          </Link>

          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-primary mb-4 text-glow">
              Livros
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
              Descubra os segredos e conhecimentos ocultos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Livro dos Conceitos"
              image={conceitosImage}
              onClick={() => setIsPdfModalOpen(true)}
            />
          </div>
        </div>
      </main>

      <Footer />

      <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] bg-dark-card border-2 border-primary/50 p-4">
          <DialogTitle className="text-2xl font-title text-primary text-center mb-2">
            Livro dos Conceitos
          </DialogTitle>
          <div className="w-full h-[calc(95vh-80px)]">
            <iframe 
              src="/Livro_dos_Conceitos.pdf" 
              className="w-full h-full rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Livros;
