import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import PredictionPage from "./pages/PredictionPage";
import HeatmapPage from "./pages/HeatmapPage";
import RiskPage from "./pages/RiskPage";
import ReportPage from "./pages/ReportPage";
import ChatbotPage from "./pages/ChatbotPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/predict" element={<PredictionPage />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="/risk" element={<RiskPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;





