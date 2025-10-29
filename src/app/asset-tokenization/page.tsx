"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssetSubmission from "@/components/AssetSubmission";
import AssetStatus from "@/components/AssetStatus";
import CustodyProcess from "@/components/CustodyProcess";
import NFTPreview from "@/components/NFTPreview";
import NFTSuccess from "@/components/NFTSuccess";
import Stepper from "@/components/Stepper";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TabBar from "@/components/TabBar";

export default function AssetTokenization() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const walletAddress = "0x0062...C466";
  const userName = "zoeshih";

  const steps = ["資產代幣化", "審核中", "合約簽署", "託管程序", "生成 NFT"];

  // Map currentStep to stepper progress
  const getStepperProgress = () => {
    if (currentStep === 0) return 0;
    if (currentStep === 1) return 1;
    if (currentStep === 2) return 3;
    if (currentStep === 3) return 3;
    if (currentStep === 4) return 4;
    return 0;
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("0x0062C466");
    toast({
      title: "已複製",
      description: "錢包地址已複製到剪貼簿",
    });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-[#d4ff00] text-foreground text-sm font-semibold">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-none mb-1">
                {userName}
              </p>
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-muted-foreground font-mono">
                  {walletAddress}
                </p>
                <button
                  onClick={handleCopyAddress}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="複製錢包地址"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Stepper steps={steps} currentStep={getStepperProgress()} />

      <main className="w-full mx-auto px-4 py-8 overflow-x-hidden">
        <div className="max-w-5xl mx-auto w-full overflow-x-hidden">
          {currentStep === 0 && (
            <AssetSubmission onSubmitSuccess={() => handleStepChange(1)} />
          )}
          {currentStep === 1 && (
            <AssetStatus onViewNFT={() => handleStepChange(2)} />
          )}
          {currentStep === 2 && (
            <CustodyProcess onComplete={() => handleStepChange(3)} />
          )}
          {currentStep === 3 && (
            <NFTPreview onConfirm={() => handleStepChange(4)} />
          )}
          {currentStep === 4 && <NFTSuccess />}
        </div>
      </main>

      <footer className="border-t mt-20 mb-20">
        <div className="w-full mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 RWA 資產代幣化平台. All rights reserved.</p>
          <p className="mt-2">Powered by Web3 Technology</p>
        </div>
      </footer>

      <TabBar />
    </div>
  );
}
