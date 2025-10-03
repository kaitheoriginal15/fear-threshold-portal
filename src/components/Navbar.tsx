import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-card/95 backdrop-blur-sm border-b-2 border-primary/30">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <img 
            src={logo} 
            alt="Fear Threshold Logo" 
            className="h-12 w-auto drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]"
          />
        </Link>
        
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-title font-bold text-primary text-glow hover:scale-105 transition-transform">
            Fear Threshold
          </h1>
        </Link>

        <div className="w-12 md:w-16" /> {/* Spacer for balance */}
      </div>
    </nav>
  );
};

export default Navbar;
