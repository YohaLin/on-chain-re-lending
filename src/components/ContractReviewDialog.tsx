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

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
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
            <div className="text-3xl font-extrabold mb-6 border-b pb-2 text-blue-700">
              代幣化平台服務條款
            </div>
            <div className="text-xl font-semibold mb-4 text-gray-600">
              本條款總則
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md">
              本《代幣化平台服務條款》（以下簡稱「本條款」）為用戶（以下亦稱「您」）與本公司所營運之區塊鏈實體資產代幣化平台（以下簡稱「本平台」）間具法律約束力之協議。您註冊或使用本平台時，即表示您已閱讀、瞭解並同意遵守本條款之所有內容。本條款旨在規範使用本平台進行實體資產代幣化(NFT)相關服務時，平台與用戶間的權利義務關係。請仔細閱讀以下條款：
            </div>
            <div className="text-xl font-semibold mb-2 mt-6 text-gray-600">
              信託法律架構 (Trust Legal Framework)
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md">
              用戶同意將其實體資產交由本平台指定的獨立第三方（例如律師事務所）依信託法律架構託管。經第三方鑑價確認資產價值後，本平台將透過區塊鏈鑄造一枚非同質化代幣
              (NFT)，作為該資產所有權之鏈上憑證。該 NFT
              僅代表資產的所有權證明，本身不賦予任何收益分配或請求權。
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md text-sm text-gray-500 italic">
              Trust Legal Framework: The User agrees to place their tangible
              asset under the custody of an independent third-party designated
              by the Platform (such as a law firm) pursuant to a trust-based
              legal framework. Upon confirmation of the asset’s value by a
              third-party appraisal, the Platform will mint a Non-Fungible Token
              (NFT) on the blockchain as a certificate evidencing ownership of
              the asset. The NFT represents proof of ownership of the asset only
              and does not confer any profit distribution right or claim to
              income.
            </div>
            <div className="text-xl font-semibold mb-2 mt-6 text-gray-600">
              NFT 性質與限制 (Nature and Limitations of NFT)
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md">
              每一NFT皆對應特定的鏈下實體資產所有權憑證，只能由該資產的原始所有人（用戶）持有和使用。用戶不得將NFT自由轉讓、分割，亦不得在本平台以外的任何其他平台將該NFT流通或交易。上述限制旨在確保NFT僅用於驗證所有權及配合本平台提供之特定功能，不作為一般交易性商品。
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md text-sm text-gray-500 italic">
              Nature and Limitations of NFT: Each NFT represents a certificate
              of ownership of a specific off-chain physical asset and may only
              be held and used by the original owner of that asset (the User).
              The User shall not freely transfer or subdivide the NFT, nor
              circulate or trade the NFT on any platform outside of this
              Platform. These restrictions ensure that the NFT is used solely to
              verify ownership and in conjunction with the specific functions
              provided by the Platform, and is not treated as a freely tradable
              commodity.
            </div>
            <div className="text-xl font-semibold mb-2 mt-6 text-gray-600">
              質押與流動性 (Pledge and Liquidity)
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md">
              用戶僅可在本公司提供的點對點 (P2P)
              借貸平台上使用其NFT進行質押，以將NFT所代表之資產權益轉換為債權代幣，從而獲取流動性資金。該等債權代幣僅能在本平台核准的白名單用戶之間進行流通和交易，不得向非白名單成員公開交易。質押與轉換過程須遵守本平台P2P借貸服務的相關條款與程序規範。
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md text-sm text-gray-500 italic">
              Pledge and Liquidity: The User may only use their NFT as
              collateral on the Company’s provided peer-to-peer (P2P) lending
              platform to convert the value represented by the NFT into a debt
              token, thereby obtaining liquid funds. Any such debt token may be
              circulated and traded only among users pre-approved and
              whitelisted by the Platform, and shall not be publicly sold or
              traded to non-whitelisted parties. The pledging and conversion
              process is subject to the terms and procedures of the Platform’s
              P2P lending services.
            </div>
            <div className="text-xl font-semibold mb-2 mt-6 text-gray-600">
              鑄造與撤銷條件 (Minting and Revocation Conditions)
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md">
              NFT
              的鑄造需在標的資產經獨立第三方鑑價並完成信託登記後方可進行。本平台僅在上述程序完備並確認資產符合資格後，始代為鑄造NFT並記錄於區塊鏈。NFT
              的撤銷（銷毀）或所有權轉移僅得在特定外部事件發生時依據程序執行，包括但不限於：用戶死亡、標的資產價值發生重大下跌、用戶於P2P借貸平台之借款出現逾期未償、用戶資產被依法繼承、或遭法院及主管機關強制執行等情形。一旦上述觸發事件經確認，本平台有權依相關法律程序及本條款規定撤銷該NFT或將NFT所代表之資產所有權轉移予適當主體（例如繼承人或債權人）。
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md text-sm text-gray-500 italic">
              Minting and Revocation Conditions: The minting of an NFT shall
              occur only after the underlying asset has been appraised by an
              independent third party and duly registered under a trust
              arrangement. The Platform will mint the NFT and record it on the
              blockchain only upon completion of these procedures and
              confirmation that the asset meets the eligibility criteria. The
              revocation (burning/cancellation) of an NFT or the transfer of the
              NFT’s ownership certificate may be carried out only when certain
              external events occur and the proper procedures are followed. Such
              events include, but are not limited to: the User’s death; a
              significant decline in the value of the underlying asset; the
              User’s loan obtained via the P2P lending platform becoming overdue
              or in default; the asset being subject to inheritance by law; or
              the asset being subject to court or regulatory enforcement
              actions. Upon verification of any such triggering event, the
              Platform is authorized to, in accordance with applicable laws and
              these Terms, revoke the NFT or transfer the ownership of the asset
              represented by the NFT to an appropriate party (for example, the
              User’s heir or a creditor).
            </div>
            <div className="text-xl font-semibold mb-2 mt-6 text-gray-600">
              適用標的範圍 (Scope of Eligible Assets)
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md">
              本平台所提供之NFT代幣化服務適用之鏈下資產類型包括但不限於：不動產（例如土地、房產）、奢侈品（例如藝術品、名錶、珠寶）、動產（例如汽車、貴金屬）、保證金或定期存款、各類票據（例如匯票、本票）、基金或信託受益權，以及其他經本平台審核認可之有價資產。用戶申請將資產代幣化前，應確認該資產屬於本平台允許的範疇，且有權處分該資產以進行信託登記與NFT鑄造。
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md text-sm text-gray-500 italic">
              Scope of Eligible Assets: The types of off-chain assets eligible
              for tokenization into NFTs on the Platform include, but are not
              limited to: real estate (e.g., land, properties), luxury goods
              (e.g., artwork, premium watches, jewelry), movable assets (e.g.,
              automobiles, precious metals), security deposits or time deposits,
              various negotiable instruments (e.g., drafts, promissory notes),
              beneficial interests in investment funds or trusts, and other
              valuable assets as reviewed and approved by the Platform. Before
              applying to tokenize an asset, the User must ensure that the asset
              falls within the scope permitted by the Platform and that the User
              has the legal right to dispose of or encumber the asset for the
              purpose of trust registration and NFT minting.
            </div>
            <div className="text-xl font-semibold mb-2 mt-6 text-gray-600">
              平台與用戶責任 (Platform and User Responsibilities)
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md">
              平台不對任何透過本平台鑄造之NFT所代表資產的市場價值、變現性或流動性作出保證。用戶瞭解並同意，資產價值可能隨市場行情波動，本平台對於該等價值變動或由此產生的任何損失不承擔責任。用戶有責任確保提供之資產資訊真實無誤，並承擔違法或侵權使用他人資產所帶來的後果。每項擬鑄造NFT之資產均須經由本平台指定或認可的獨立第三方進行鑑價評估，且該鑑價報告將由平台保存備查，以確保NFT對應資產價值之公允和真實。平台和第三方鑑價機構對鑑價結果所依據資料的真實性不承擔責任，鑑價結果僅供代幣化參考之用，不構成本平台對資產價值的任何明示或默示擔保。
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md text-sm text-gray-500 italic">
              Platform and User Responsibilities: The Platform makes no warranty
              as to the market value, convertibility to cash, or liquidity of
              any asset represented by an NFT minted through the Platform. The
              User understands and agrees that asset values may fluctuate with
              market conditions, and the Platform shall not be liable for any
              such value fluctuations or any losses arising therefrom. The User
              is responsible for ensuring that all information provided about
              the asset is true and accurate, and will bear any consequences of
              using assets unlawfully or infringing on others&apos; rights. Each
              asset proposed for NFT minting must undergo a valuation by an
              independent third-party appraiser designated or approved by the
              Platform, and the resulting appraisal report will be retained by
              the Platform for record-keeping, to ensure the fairness and
              accuracy of the asset’s valuation. The Platform and the
              third-party appraiser assume no responsibility for the
              authenticity of the data underlying the appraisal; the appraisal
              result is for tokenization reference only and does not constitute
              any express or implied guarantee by the Platform regarding the
              asset’s value.
            </div>
            <div className="text-xl font-semibold mb-2 mt-6 text-gray-600">
              不構成證券 (No Securities Offering)
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md">
              用戶理解並同意，NFT
              僅為資產所有權之象徵，不代表對任何企業或資產之投資契約、收益權、股權、債權或其他性質之有價證券。NFT
              的發行、持有及其在本平台內部之相關使用行為，不構成任何形式的公開募資、證券發行或集資活動。本平台提供之服務並非設計用於證券交易，亦無意讓NFT持有人獲取投資收益。
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md text-sm text-gray-500 italic">
              No Securities Offering: The User understands and agrees that an
              NFT serves only as a symbol of asset ownership and does not
              represent an investment contract, profit participation right,
              equity share, debt instrument, or any other form of security in
              any enterprise or asset. The issuance, holding, and related use of
              NFTs within the Platform do not constitute any form of public
              fundraising, securities offering, or capital-raising activity. The
              services provided by the Platform are not intended for securities
              trading purposes, nor are they meant to enable NFT holders to
              obtain investment returns.
            </div>
            <div className="text-xl font-semibold mb-2 mt-6 text-gray-600">
              智慧合約與不可逆性 (Smart Contracts and Irreversibility)
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md">
              用戶知悉並同意，NFT
              的鑄造及後續所有關聯交易均透過區塊鏈智慧合約自動執行。一旦NFT鑄造完成並記錄於區塊鏈分散式帳本上，即成為永久記錄，任何人均無法任意變更、刪除或逆轉該筆記錄。本平台對已上鏈之交易或紀錄無編輯或刪除之技術可能性，亦不會介入區塊鏈運作。因此，用戶應謹慎操作，因區塊鏈之不可逆特性所產生之後果將由用戶自行承擔。
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md text-sm text-gray-500 italic">
              Smart Contracts and Irreversibility: The User acknowledges and
              agrees that the minting of NFTs and all subsequent related
              transactions are executed automatically through blockchain smart
              contracts. Once an NFT is minted and recorded on the distributed
              ledger (blockchain), it becomes a permanent record that cannot be
              altered, deleted, or reversed by any party. The Platform has no
              technical ability to edit or remove any transaction or record that
              has been added to the blockchain, nor will it intervene in the
              operation of the blockchain. Accordingly, the User should operate
              with caution, as any consequences arising from the immutable
              nature of blockchain records shall be borne by the User.
            </div>
            <div className="text-xl font-semibold mb-2 mt-6 text-gray-600">
              違約與爭議處理 (Default and Dispute Resolution)
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md">
              如資產持有人（用戶）違反本條款的任一規定，或將NFT用於未經授權、違法之用途，本平台有權視情節輕重對該用戶採取適當措施，包括但不限於暫停或終止相關NFT之功能（例如禁止其於平台內進行質押或轉換）、取消該NFT的有效性，或在必要時依據法律程序處置該NFT所代表之鏈下資產（例如清算、拍賣以償付相關債務）。此外，若用戶違反P2P借貸協議或本平台其他服務規範，平台得依該等協議規定對NFT及其所對應資產採取清算、移轉或其他適當之處置。任何因違約所引起之爭議，當事人同意優先以善意協商方式解決；如協商不成，應依據本條款的準據法條款提請管轄法院或仲裁機構處理。
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md text-sm text-gray-500 italic">
              Default and Dispute Resolution: If the asset owner (User) breaches
              any provision of these Terms, or uses the NFT for any unauthorized
              or unlawful purpose, the Platform reserves the right to take
              appropriate measures commensurate with the severity of the breach.
              Such measures include, but are not limited to, suspending or
              terminating the functionalities of the relevant NFT (for example,
              prohibiting its use as collateral or conversion on the Platform),
              canceling the validity of the NFT, or if necessary, disposing of
              the off-chain asset represented by the NFT in accordance with
              legal procedures (for example, liquidating or auctioning the asset
              to satisfy related debts). Furthermore, if the User breaches the
              P2P lending agreement or any other service rules of the Platform,
              the Platform may, pursuant to those agreements, liquidate,
              transfer, or take other appropriate actions regarding the NFT and
              its underlying asset. The parties agree to attempt in good faith
              to resolve any dispute arising from a breach of these Terms
              through negotiation as a first step; if such negotiation fails,
              the dispute shall be submitted to a competent court or arbitration
              body for resolution in accordance with the Governing Law provision
              of these Terms.
            </div>
            <div className="text-xl font-semibold mb-2 mt-6 text-gray-600">
              準據法與語言 (Governing Law and Language)
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md">
              本條款之效力、解釋、履行及與其有關之權利義務關係，均應適用中華民國（臺灣）之法律並依其詮釋。若本條款中、英文版本之內容存在差異，應以繁體中文版本為準，英文版本僅作翻譯參考之用。雙方並同意以繁體中文作為爭議解決程序之正式語言。本條款如有未盡事宜，依中華民國法律相關規定處理。
            </div>
            <div className="clause-content p-4 my-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-md text-sm text-gray-500 italic">
              Governing Law and Language: The formation, validity,
              interpretation, performance, and all rights and obligations
              arising in connection with these Terms shall be governed by and
              construed in accordance with the laws of the Republic of China
              (Taiwan). In the event of any discrepancy between the Chinese
              version and the English version of these Terms, the Traditional
              Chinese version shall prevail, and the English version is provided
              for reference only. The parties also agree that Traditional
              Chinese shall be the official language for any dispute resolution
              proceedings. Any matters not expressly provided for herein shall
              be handled in accordance with the applicable laws of the Republic
              of China (Taiwan).
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
