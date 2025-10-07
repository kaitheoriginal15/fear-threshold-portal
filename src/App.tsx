import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ResumoArcos from "./pages/ResumoArcos";
import Personagens from "./pages/Personagens";
import Livros from "./pages/Livros";
import Bestiario from "./pages/Bestiario";
import TierList from "./pages/TierList";
import DescubraGrupo from "./pages/DescubraGrupo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/resumo-arcos" element={<ResumoArcos />} />
          <Route path="/personagens" element={<Personagens />} />
          <Route path="/livros" element={<Livros />} />
          <Route path="/bestiario" element={<Bestiario />} />
          <Route path="/tier-list" element={<TierList />} />
          <Route path="/descubra-grupo" element={<DescubraGrupo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
