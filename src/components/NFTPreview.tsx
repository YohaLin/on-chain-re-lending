"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  FileText,
  ExternalLink,
  Copy,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import ContractReviewDialog from "./ContractReviewDialog";
import buildingImage from "@/assets/building.png";
import { PROPERTY_NFT_ADDRESS } from "@/utils/propertyNFT";

interface AssetData {
  name: string;
  description: string;
  address: string;
  assetType: string;
}

interface NFTPreviewProps {
  onConfirm: () => void;
  assetData: AssetData;
}

export default function NFTPreview({ onConfirm, assetData }: NFTPreviewProps) {
  const router = useRouter();
  const { address } = useAccount(); // 獲取 imToken 連接的地址
  const [copied, setCopied] = useState(false);
  const [showContractDialog, setShowContractDialog] = useState(false);
  const { toast } = useToast();

  const handleContractConfirm = () => {
    setShowContractDialog(false);
    // 不再打開簽名對話框,直接完成
    toast({
      title: "合約已確認",
      description: "進入託管程序",
    });
    onConfirm();
  };

  const nftData = {
    tokenId: "#RWA-待鑄造",
    name: assetData.name || "未命名資產",
    assetType: assetData.assetType || "未分類",
    location: assetData.address || "未提供地址",
    description: assetData.description || "無描述",
    contractHash: PROPERTY_NFT_ADDRESS,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(nftData.contractHash);
    setCopied(true);
    toast({
      title: "已複製",
      description: "合約地址已複製到剪貼簿",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full overflow-hidden">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">NFT 預覽</h2>
        <p className="text-muted-foreground">確認您的資產 NFT 資訊</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 w-full overflow-hidden">
        <Card className="p-6 space-y-4 overflow-hidden">
          <div className="w-full aspect-square bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-xl flex items-center justify-center p-6">
            <div className="text-center space-y-4 w-full">
              <div className="relative w-full max-w-[280px] mx-auto aspect-square">
                <Image
                  src={buildingImage}
                  alt="Building"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Token ID</p>
                <p className="font-mono font-bold text-lg">{nftData.tokenId}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-xl break-words">{nftData.name}</h3>
            <Badge className="bg-primary">{nftData.assetType}</Badge>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">描述</span>
              <span className="font-medium text-sm break-all text-right max-w-xs">
                {nftData.description}
              </span>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6 overflow-hidden">
            <h3 className="font-semibold text-lg mb-4">資產詳細資訊</h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">地址</p>
                  <p className="font-medium break-words">{nftData.location}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">資產類型</p>
                  <p className="font-medium">{nftData.assetType}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 overflow-hidden">
            <h3 className="font-semibold text-lg mb-4">區塊鏈資訊</h3>

            <div className="space-y-4">
              <div className="min-w-0 overflow-hidden">
                <p className="text-sm text-muted-foreground mb-2">智能合約地址</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 min-w-0 text-xs bg-secondary p-3 rounded-lg font-mono break-all">
                    {nftData.contractHash}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopy}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">鏈下合約</p>
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  查看法律文件
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6 bg-primary/5 border-primary/20 overflow-hidden">
        <div className="flex gap-3 sm:gap-4">
          <div className="p-3 bg-primary/10 rounded-full h-fit flex-shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold mb-2">NFT Metadata</h4>
            <p className="text-sm text-muted-foreground mb-3">
              此 NFT 包含完整的資產資訊、估值數據以及法律文件的鏈下連結，確保資產的真實性和可追溯性。
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">ERC-721</Badge>
              <Badge variant="secondary">IPFS 存儲</Badge>
              <Badge variant="secondary">法律綁定</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="default"
          onClick={() => router.back()}
        >
          返回
        </Button>
        <Button
          size="default"
          onClick={() => setShowContractDialog(true)}
        >
          接受
        </Button>
      </div>

      <ContractReviewDialog
        open={showContractDialog}
        onOpenChange={setShowContractDialog}
        onConfirm={handleContractConfirm}
      />
    </div>
  );
}
