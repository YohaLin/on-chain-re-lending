import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WalletConnect from "./pages/WalletConnect";
import KYCVerification from "./pages/KYCVerification";
import MyAssets from "./pages/MyAssets";
import LoanSetup from "./pages/LoanSetup";
import LoanConfirm from "./pages/LoanConfirm";
import LoanProcessing from "./pages/LoanProcessing";
import LoanSuccess from "./pages/LoanSuccess";
import MyLoans from "./pages/MyLoans";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WalletConnect />} />
          <Route path="/kyc-verification" element={<KYCVerification />} />
          <Route path="/asset-tokenization" element={<Index />} />
          <Route path="/my-assets" element={<MyAssets />} />
          <Route path="/loan-setup/:assetId" element={<LoanSetup />} />
          <Route path="/loan-confirm" element={<LoanConfirm />} />
          <Route path="/loan-processing" element={<LoanProcessing />} />
          <Route path="/loan-success" element={<LoanSuccess />} />
          <Route path="/my-loans" element={<MyLoans />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
