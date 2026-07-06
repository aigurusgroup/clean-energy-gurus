import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Landlords from "./pages/Landlords";
import About from "./pages/About";
import HowWeWork from "./pages/HowWeWork";
import PartnerNetwork from "./pages/PartnerNetwork";
import Contact from "./pages/Contact";
import Partners from "./pages/Partners";
import SolarCalculatorPage from "./pages/SolarCalculatorPage";
import EnergyIQ from "./pages/EnergyIQ";
import { EVCharging } from "./pages/ServicePages";
import { ResidentialHub, ResidentialSolarBattery } from "./pages/residential/ResidentialPages";
import { BusinessHub, CommercialSolar, WorkplaceEV } from "./pages/business/BusinessPages";
import AirSourceHeatPumps from "./pages/residential/AirSourceHeatPumps";
import HeatingEfficiency from "./pages/business/HeatingEfficiency";
import { AgricultureHub, FarmSolar, FarmResilience } from "./pages/agriculture/AgriculturePages";
import { OptimisationHub, OptMonitoring, OptTariff, OptBattery } from "./pages/optimisation/OptimisationPages";
import KnowledgeCentre from "./pages/knowledge/KnowledgeCentre";
import { KnowledgeArticles } from "./pages/knowledge/KnowledgeEducation";
import { KnowledgeVideos, KnowledgeCaseStudies, KnowledgeInstallerHub } from "./pages/knowledge/KnowledgeMedia";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Residential */}
          <Route path="/residential" element={<ResidentialHub />} />
          <Route path="/residential/solar-pv" element={<Navigate to="/residential/solar-battery" replace />} />
          <Route path="/residential/battery-storage" element={<Navigate to="/residential/solar-battery" replace />} />
          <Route path="/residential/ev-charging" element={<EVCharging />} />
          <Route path="/residential/solar-battery" element={<ResidentialSolarBattery />} />
          <Route path="/residential/air-source-heat-pumps" element={<AirSourceHeatPumps />} />
          <Route path="/homes" element={<Navigate to="/residential" replace />} />
          <Route path="/solar-calculator" element={<SolarCalculatorPage />} />
          <Route path="/energy-iq" element={<EnergyIQ />} />

          {/* Business */}
          <Route path="/business" element={<BusinessHub />} />
          <Route path="/business/overview" element={<Navigate to="/business" replace />} />
          <Route path="/business/commercial-solar" element={<CommercialSolar />} />
          <Route path="/business/workplace-ev" element={<WorkplaceEV />} />
          <Route path="/business/heating-efficiency" element={<HeatingEfficiency />} />
          <Route path="/business/commercial-battery" element={<Navigate to="/business/commercial-solar" replace />} />
          <Route path="/business/landlords" element={<Landlords />} />
          <Route path="/landlords" element={<Navigate to="/business/landlords" replace />} />

          {/* Agriculture */}
          <Route path="/agriculture" element={<AgricultureHub />} />
          <Route path="/agriculture/solar" element={<FarmSolar />} />
          <Route path="/agriculture/battery" element={<Navigate to="/agriculture/solar" replace />} />
          <Route path="/agriculture/resilience" element={<FarmResilience />} />
          <Route path="/agriculture/solutions" element={<Navigate to="/agriculture/solar" replace />} />
          <Route path="/agriculture/overview" element={<Navigate to="/agriculture" replace />} />
          <Route path="/farms" element={<Navigate to="/agriculture" replace />} />

          {/* Energy Optimisation */}
          <Route path="/energy-optimisation" element={<OptimisationHub />} />
          <Route path="/energy-optimisation/monitoring" element={<OptMonitoring />} />
          <Route path="/energy-optimisation/maintenance" element={<Navigate to="/energy-optimisation/monitoring" replace />} />
          <Route path="/energy-optimisation/tariff" element={<OptTariff />} />
          <Route path="/energy-optimisation/export" element={<Navigate to="/energy-optimisation/tariff" replace />} />
          <Route path="/energy-optimisation/battery" element={<OptBattery />} />
          <Route path="/energy-optimisation/reporting" element={<Navigate to="/energy-optimisation/tariff" replace />} />

          {/* Legacy service routes → redirects */}
          <Route path="/services" element={<Navigate to="/" replace />} />
          <Route path="/services/solar-pv" element={<Navigate to="/residential/solar-battery" replace />} />
          <Route path="/services/battery-storage" element={<Navigate to="/residential/solar-battery" replace />} />
          <Route path="/services/ev-charging" element={<Navigate to="/residential/ev-charging" replace />} />
          <Route path="/services/monitoring" element={<Navigate to="/energy-optimisation/monitoring" replace />} />
          <Route path="/services/tariff-optimisation" element={<Navigate to="/energy-optimisation/tariff" replace />} />

          {/* Knowledge Centre */}
          <Route path="/knowledge" element={<KnowledgeCentre />} />
          <Route path="/knowledge/articles" element={<KnowledgeArticles />} />
          <Route path="/knowledge/solar" element={<Navigate to="/knowledge/articles" replace />} />
          <Route path="/knowledge/battery" element={<Navigate to="/knowledge/articles" replace />} />
          <Route path="/knowledge/ev-charging" element={<Navigate to="/knowledge/articles" replace />} />
          <Route path="/knowledge/videos" element={<KnowledgeVideos />} />
          <Route path="/knowledge/case-studies" element={<KnowledgeCaseStudies />} />
          <Route path="/knowledge/installer-hub" element={<KnowledgeInstallerHub />} />
          <Route path="/insights" element={<Navigate to="/knowledge/articles" replace />} />

          {/* About / Company */}
          <Route path="/about" element={<About />} />
          <Route path="/about/how-we-work" element={<HowWeWork />} />
          <Route path="/about/partner-network" element={<PartnerNetwork />} />
          <Route path="/platform" element={<Navigate to="/about/how-we-work" replace />} />
          <Route path="/contact" element={<Contact />} />

          {/* Partner application (kept, not in main nav) */}
          <Route path="/partners" element={<Partners />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
