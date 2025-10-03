import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TierList = () => {
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

          <h1 className="text-4xl md:text-5xl font-title font-bold text-primary mb-8 text-center text-glow">
            Tier List
          </h1>
          
          <div className="space-y-8">
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

export default TierList;
