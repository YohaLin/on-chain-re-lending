"use client";

import { useRouter, usePathname } from "next/navigation";
import { Wallet, Briefcase, Banknote } from "lucide-react";

const TabBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      id: "wallet",
      label: "錢包",
      icon: Wallet,
      path: "/wallet-dashboard",
    },
    {
      id: "assets",
      label: "資產代幣化",
      icon: Briefcase,
      path: "/asset-tokenization",
    },
    {
      id: "loans",
      label: "借貸中",
      icon: Banknote,
      path: "/my-loans",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/wallet-dashboard") {
      return pathname === "/wallet-dashboard";
    }
    if (path === "/asset-tokenization") {
      return pathname === "/" || pathname === "/asset-tokenization";
    }
    return pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="bg-card border rounded-full shadow-lg mx-auto max-w-md">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabBar;
