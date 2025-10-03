import { Link } from "react-router-dom";
import { User, Crown } from "lucide-react";
import logo from "@/assets/logo-new.png";
import { useState } from "react";
import LoginModal from "./LoginModal";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <img 
              src={logo} 
              alt="Fear Threshold Logo" 
              className="h-12 w-auto"
            />
          </Link>
          
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-title font-bold text-primary text-glow hover:scale-105 transition-transform">
              Fear Threshold
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            {user && isAdmin ? (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => signOut()}
                className="text-primary hover:text-primary/80"
                title="Sair (Admin)"
              >
                <Crown className="h-6 w-6" />
              </Button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-primary hover:text-primary/80 transition-colors"
                title="Login Admin"
              >
                <User className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </nav>
      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
