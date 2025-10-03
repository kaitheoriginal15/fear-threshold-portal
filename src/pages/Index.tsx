import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import resumoArcosImage from "@/assets/resumo-arcos-new.png";
import personagensImage from "@/assets/personagens-new.png";
import livrosImage from "@/assets/livros.png";
import bestiarioImage from "@/assets/bestiario.png";
import tierListImage from "@/assets/tier-list.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-dark relative overflow-hidden flex flex-col">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16 relative z-10 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-primary mb-4 text-glow">
              Bem-vindo ao Limiar do Medo
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
              Adentre um universo sombrio onde cada escolha pode ser a última
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <FeatureCard
              title="Resumo dos Arcos"
              image={resumoArcosImage}
              link="/resumo-arcos"
            />
            
            <FeatureCard
              title="Personagens"
              image={personagensImage}
              link="/personagens"
            />
            
            <FeatureCard
              title="Livros"
              image={livrosImage}
              link="/livros"
            />

            <FeatureCard
              title="Bestiário"
              image={bestiarioImage}
              link="/bestiario"
            />

            <FeatureCard
              title="Tier List"
              image={tierListImage}
              link="/tier-list"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
