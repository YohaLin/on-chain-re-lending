import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ContractTermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const ContractTermsDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: ContractTermsDialogProps) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setHasScrolledToBottom(false);
    }
  }, [open]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;

      if (isAtBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true);
        toast({
          title: "感謝您的閱讀",
          description: "您現在可以確認已閱讀合約條款",
        });
      }
    }
  };

  const handleConfirm = () => {
    if (!hasScrolledToBottom) {
      toast({
        title: "請先閱讀完整合約",
        description: "請滾動至底部以確認您已閱讀所有條款",
        variant: "destructive",
      });
      return;
    }
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            資產代幣化合約條款
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            請仔細閱讀以下合約條款，滾動至底部以確認閱讀完成
          </p>
        </DialogHeader>

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 px-6 h-[400px] overflow-y-auto"
        >
          <div className="space-y-6 pb-4 pr-4">
            <section>
              <h3 className="text-lg font-bold mb-3">第一條：合約標的</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                本合約旨在規範甲方（資產持有人）與乙方（平台營運方）就標的資產進行代幣化之相關權利義務。標的資產包括但不限於不動產、動產、藝術品、珠寶、車輛等具有價值之有形或無形資產。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-3">第二條：資產鑑定與評估</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                甲方應提供標的資產之完整資訊，包括所有權證明、鑑定報告等相關文件。乙方得委託第三方專業機構進行資產評估，評估費用由雙方協議負擔。資產價值之認定以評估報告為準。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-3">第三條：NFT 鑄造與發行</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                經雙方同意後，乙方將於區塊鏈上鑄造代表標的資產之 NFT。每一標的資產對應唯一之 NFT，並記錄於不可竄改之區塊鏈上。NFT 之鑄造完成後，甲方即取得該 NFT 之所有權。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-3">第四條：保管與監護</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                實體資產應由經認證之專業保管機構進行保管。保管機構應提供適當之保存環境，並投保相關保險。甲方得隨時要求查驗資產狀態，乙方應配合安排。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-3">第五條：交易與轉讓</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                NFT 持有人得於平台上自由交易或轉讓 NFT。每次交易應遵守平台規範，並支付相應之手續費。NFT 之轉讓自區塊鏈記錄完成時生效。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-3">第六條：權利與義務</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                NFT 持有人享有標的資產之經濟利益，包括增值收益、租金收入等。持有人亦負有支付保管費、保險費等維護成本之義務。持有人得隨時申請贖回實體資產。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-3">第七條：平台服務費</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                乙方提供之服務包括資產鑑定、NFT 鑄造、保管安排、交易平台等。甲方應支付服務費，費率依平台公告為準。交易手續費由買賣雙方依約定比例分擔。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-3">第八條：風險揭露</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                甲方充分了解資產代幣化之風險，包括市場價格波動、流動性風險、技術風險等。區塊鏈技術具有不可逆性，交易完成後無法撤銷。甲方應審慎評估自身風險承受能力。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-3">第九條：隱私保護</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                乙方應保護甲方之個人資料及交易資訊，不得未經授權揭露予第三方。區塊鏈上之交易記錄為公開資訊，但不包含個人身份識別資訊。雙方應遵守相關資料保護法規。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-3">第十條：智慧財產權</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                標的資產之智慧財產權歸甲方所有。NFT 之鑄造不影響標的資產之智慧財產權歸屬。乙方就平台技術、系統及相關軟體保有完整之智慧財產權，甲方不得擅自複製、修改或散布。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-3">第十一條：合約終止</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-3">
                本合約於下列情形得終止：
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>雙方書面同意終止</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>一方嚴重違約，經催告仍未改善</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>標的資產滅失或喪失代幣化之適格性</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>法律或主管機關命令終止</span>
                </li>
              </ul>
              <p className="text-sm leading-relaxed text-muted-foreground mt-3">
                合約終止後，已鑄造之 NFT 仍然有效，雙方就終止前已發生之權利義務仍應履行。
              </p>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-center font-bold text-lg mb-4">- 合約條款結束 -</p>
              <p className="text-center text-sm text-muted-foreground">
                請確認您已完整閱讀並理解以上所有條款
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 space-y-3 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full"
            size="lg"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!hasScrolledToBottom}
            className="w-full rounded-full font-semibold"
            size="lg"
          >
            我已仔細閱讀並完全理解上述合約條款
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractTermsDialog;
