"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import genieIcon from "@/assets/genie-icon.png";

export default function Welcome() {
  const router = useRouter();

  const handleConnectWallet = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        {/* Genie Icon with Animation */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" />
          <div className="relative w-48 h-48">
            <Image
              src={genieIcon}
              alt="Genie"
              fill
              className="object-contain animate-float"
            />
          </div>
        </div>

        {/* Connect Wallet Button */}
        <Button
          onClick={handleConnectWallet}
          size="lg"
          className="w-full max-w-xs font-semibold rounded-full shadow-lg hover:shadow-xl transition-all text-[1rem]"
        >
          連接錢包
        </Button>

        {/* Optional decorative elements */}
        <p className="text-sm text-muted-foreground text-center">
          開始您的資產代幣化之旅
        </p>
      </div>
    </div>
  );
}
