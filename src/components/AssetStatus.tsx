import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle2, 
  FileCheck, 
  Coins, 
  FileSignature,
  Loader2
} from "lucide-react";
import { useState } from "react";
import ContractReviewDialog from "./ContractReviewDialog";
import DigitalSignatureDialog from "./DigitalSignatureDialog";
import { useToast } from "@/hooks/use-toast";

interface AssetStatusProps {
  onViewNFT: () => void;
}

const statusSteps = [
  { 
    id: 1, 
    name: "資產提交", 
    icon: FileCheck, 
    status: "completed" as const,
    description: "已成功提交資產資訊"
  },
  { 
    id: 2, 
    name: "初步審核", 
    icon: Clock, 
    status: "completed" as const,
    description: "平台已通過初步審核"
  },
  { 
    id: 3, 
    name: "專業估值", 
    icon: Coins, 
    status: "in-progress" as const,
    description: "專業團隊正在進行估值",
    estimatedValue: "NT$ 6,400,000"
  },
  { 
    id: 4, 
    name: "簽訂合約", 
    icon: FileSignature, 
    status: "pending" as const,
    description: "等待估值完成後進行"
  },
  { 
    id: 5, 
    name: "NFT 鑄造", 
    icon: Loader2, 
    status: "pending" as const,
    description: "等待合約簽訂後開始"
  },
];

export default function AssetStatus({ onViewNFT }: AssetStatusProps) {
  const [showContractDialog, setShowContractDialog] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const { toast } = useToast();

  const handleAcceptValuation = () => {
    setShowContractDialog(true);
  };

  const handleContractConfirm = () => {
    setShowContractDialog(false);
    setShowSignatureDialog(true);
  };

  const handleSigningComplete = () => {
    setShowSignatureDialog(false);
    toast({
      title: "簽約完成",
      description: "接下來將進行實體託管流程",
    });
    // 進入託管流程
    onViewNFT();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success">已完成</Badge>;
      case "in-progress":
        return <Badge className="bg-warning">進行中</Badge>;
      case "pending":
        return <Badge variant="secondary">等待中</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string, Icon: any) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-6 h-6 text-success" />;
      case "in-progress":
        return <Icon className="w-6 h-6 text-warning animate-pulse" />;
      case "pending":
        return <Icon className="w-6 h-6 text-muted-foreground" />;
      default:
        return <Icon className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">資產審核狀態</h2>
          <p className="text-muted-foreground mt-1">追蹤您的資產代幣化進度</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-1 mb-6">
          <h3 className="font-semibold text-lg">台北市信義區豪宅</h3>
          <p className="text-sm text-muted-foreground">房地產 • 提交於 2025/10/25</p>
        </div>

        <div className="space-y-6">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === statusSteps.length - 1;
            
            return (
              <div key={step.id} className="relative">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full p-3 ${
                      step.status === "completed" 
                        ? "bg-success/10" 
                        : step.status === "in-progress"
                        ? "bg-warning/10"
                        : "bg-secondary"
                    }`}>
                      {getStatusIcon(step.status, Icon)}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-4 mt-2 ${
                        step.status === "completed" 
                          ? "bg-success" 
                          : "bg-border"
                      }`} />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{step.name}</h4>
                      {getStatusBadge(step.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    {step.estimatedValue && step.status === "in-progress" && (
                      <div className="mt-3 p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                        <div>
                          <p className="text-sm font-medium text-primary mb-1">
                            預估資產價值
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            {step.estimatedValue}
                          </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={handleAcceptValuation}
                          >
                            接受
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => console.log('拒絕估值')}
                          >
                            拒絕
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <ContractReviewDialog
        open={showContractDialog}
        onOpenChange={setShowContractDialog}
        onConfirm={handleContractConfirm}
      />

      <DigitalSignatureDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        onConfirm={handleSigningComplete}
      />
    </div>
  );
}
