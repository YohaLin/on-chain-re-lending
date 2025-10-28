import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ContractReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function ContractReviewDialog({
  open,
  onOpenChange,
  onConfirm,
}: ContractReviewDialogProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setHasScrolledToBottom(false);
    }
  }, [open]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const scrolledToBottom = scrollHeight - scrollTop <= clientHeight + 10;
    
    if (scrolledToBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
      toast({
        title: "已閱讀完成",
        description: "您現在可以確認條款了",
      });
    }
  };

  const handleConfirm = () => {
    if (!hasScrolledToBottom) {
      toast({
        title: "請先閱讀完整合約",
        description: "請滾動至合約底部以確認您已完整閱讀",
        variant: "destructive",
      });
      return;
    }
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">資產代幣化合約條款</DialogTitle>
          <DialogDescription>
            請仔細閱讀以下合約條款，滾動至底部以確認閱讀完成
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="h-[400px] overflow-y-auto pr-4"
          >
            <div className="space-y-4 text-sm text-muted-foreground">
            <section>
              <h4 className="font-semibold text-foreground mb-2">第一條：合約目的</h4>
              <p>
                本合約旨在規範雙方就實體資產（以下簡稱「標的資產」）進行代幣化（Tokenization）之權利義務關係。標的資產將透過區塊鏈技術鑄造為不可替代代幣（NFT），以確保資產所有權的數位化記錄及可追溯性。
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">第二條：資產描述與估值</h4>
              <p>
                標的資產之詳細資訊、估值報告及相關證明文件已由甲方提供，並經乙方審核確認。資產估值由專業第三方鑑價機構出具，僅供參考，不構成任何投資建議或保證。
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">第三條：NFT 鑄造與所有權</h4>
              <p>
                經雙方確認後，乙方將為標的資產鑄造 NFT，該 NFT 將儲存於以太坊區塊鏈上，並採用 ERC-721 標準。NFT 之所有權屬於甲方，甲方有權依法自由轉讓、出售或抵押該 NFT。
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">第四條：平台服務費用</h4>
              <p className="mb-2">
                甲方同意支付乙方以下費用：
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>資產審核費：依資產類型及複雜度收取</li>
                <li>NFT 鑄造費：包含智能合約部署及鏈上交易費用</li>
                <li>平台維護費：按年度收取，用於系統維護及技術支援</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">第五條：資料保護與隱私</h4>
              <p>
                乙方承諾依據相關法律法規保護甲方之個人資料及資產資訊，除法律規定或甲方同意外，不得向第三方揭露。區塊鏈上之公開資訊將依最小揭露原則處理。
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">第六條：免責聲明</h4>
              <p className="mb-2">
                乙方對以下情形不承擔責任：
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>區塊鏈網路故障、癱瘓或其他不可抗力因素</li>
                <li>標的資產市場價值波動或貶值</li>
                <li>因甲方私鑰遺失、洩露導致之損失</li>
                <li>第三方平台或服務之技術問題</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">第七條：爭議解決</h4>
              <p>
                因本合約發生之爭議，雙方應本於誠信原則協商解決。協商不成時，同意以中華民國法律為準據法，並以台灣台北地方法院為第一審管轄法院。
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">第八條：合約效力</h4>
              <p>
                本合約經雙方數位簽署後生效，並與紙本合約具有同等法律效力。任何修改或補充需經雙方書面同意。
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">第九條：保密義務</h4>
              <p>
                雙方對於因履行本合約而知悉之對方商業機密、技術資訊及其他機密資訊，負有保密義務。未經對方書面同意，不得向第三方揭露或使用於本合約目的以外之用途。保密義務於本合約終止後仍持續有效。
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">第十條：智慧財產權</h4>
              <p>
                標的資產之智慧財產權歸甲方所有。NFT 之鑄造不影響標的資產之智慧財產權歸屬。乙方就平台技術、系統及相關軟體保有完整之智慧財產權，甲方不得擅自複製、修改或散布。
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">第十一條：合約終止</h4>
              <p className="mb-2">
                本合約於下列情形得終止：
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>雙方書面同意終止</li>
                <li>一方嚴重違約，經催告仍未改善</li>
                <li>標的資產滅失或喪失代幣化之適格性</li>
                <li>法律或主管機關命令終止</li>
              </ul>
              <p className="mt-2">
                合約終止後，已鑄造之 NFT 仍然有效，雙方就終止前已發生之權利義務仍應履行。
              </p>
            </section>

            <section className="pt-4 border-t">
              <p className="text-center font-semibold text-foreground">
                - 合約條款結束 -
              </p>
              <p className="text-center text-xs mt-2">
                請確認您已完整閱讀並理解以上所有條款
              </p>
            </section>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!hasScrolledToBottom}
            className="w-full sm:w-auto"
          >
            我已仔細閱讀並完全理解上述合約條款
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
