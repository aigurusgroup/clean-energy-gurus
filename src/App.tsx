import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Business from "./pages/Business";
import Farms from "./pages/Farms";
import Landlords from "./pages/Landlords";
import Homes from "./pages/Homes";
import Services from "./pages/Services";
import Platform from "./pages/Platform";
import About from "./pages/About";
import Insights from "./pages/Insights";
import Contact from "./pages/Contact";
import Partners from "./pages/Partners";
import { SolarPV, BatteryStorage, EVCharging, Monitoring, Tariff } from "./pages/ServicePages";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/business" element={<Business />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/landlords" element={<Landlords />} />
          <Route path="/homes" element={<Homes />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/solar-pv" element={<SolarPV />} />
          <Route path="/services/battery-storage" element={<BatteryStorage />} />
          <Route path="/services/ev-charging" element={<EVCharging />} />
          <Route path="/services/monitoring" element={<Monitoring />} />
          <Route path="/services/tariff-optimisation" element={<Tariff />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/about" element={<About />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
