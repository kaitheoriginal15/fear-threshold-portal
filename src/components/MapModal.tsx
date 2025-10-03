import { X } from "lucide-react";
import mapaImage from "@/assets/mapa.png";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MapModal = ({ isOpen, onClose }: MapModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-6xl w-full max-h-[90vh] overflow-auto bg-dark-card border-2 border-primary rounded-lg shadow-[0_0_50px_rgba(255,215,0,0.3)] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-dark-card/80 border border-primary/50 hover:border-primary hover:bg-dark transition-all hover:scale-110 hover:border-glow"
          aria-label="Fechar modal"
        >
          <X className="w-6 h-6 text-primary" />
        </button>
        
        <div className="p-4">
          <img 
            src={mapaImage} 
            alt="Mapa de Fear Threshold" 
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default MapModal;
