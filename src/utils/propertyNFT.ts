/**
 * PropertyNFT 智能合約互動工具
 * 用於與 Sapphire 鏈上的 PropertyNFT 合約互動
 */

import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/config/web3modal";
import PropertyNFTABI from "@/abi/PropertyNFT_Sapphire.json";

// PropertyNFT 合約地址 (Sapphire 鏈)
export const PROPERTY_NFT_ADDRESS =
  "0x077EA4EEB46Fdf1F406E108e52fd463764d73383" as `0x${string}`;

// Sapphire 鏈 ID
export const SAPPHIRE_CHAIN_ID = 23295; // Sapphire Testnet
// 主網: 23294 (Sapphire Mainnet)

interface AdminMintParams {
  to: `0x${string}`; // 接收者地址 (從 imToken 獲得)
  tokenURI: string; // IPFS URI (例如: ipfs://Qm...)
}

interface MintResult {
  success: boolean;
  tokenId?: bigint;
  transactionHash?: string;
  error?: string;
}

/**
 * Admin 鑄造 NFT
 * @param params 鑄造參數
 * @returns 鑄造結果
 */
export async function adminMintNFT(
  params: AdminMintParams
): Promise<MintResult> {
  try {
    console.log("開始鑄造 NFT...", params);

    // 1. 發送交易
    const hash = await writeContract(config, {
      address: PROPERTY_NFT_ADDRESS,
      abi: PropertyNFTABI,
      functionName: "adminMint",
      args: [params.to, params.tokenURI],
      chainId: SAPPHIRE_CHAIN_ID,
    });

    console.log("交易已發送:", hash);

    // 2. 等待交易確認
    const receipt = await waitForTransactionReceipt(config, {
      hash,
      confirmations: 1,
    });

    console.log("交易已確認:", receipt);

    // 3. 解析事件獲取 tokenId
    // PropertyNFT 會發出 Transfer 事件 (來自 ERC721)
    // Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
    let tokenId: bigint | undefined;

    if (receipt.logs && receipt.logs.length > 0) {
      // 尋找 Transfer 事件 (topic[0] 是事件簽名)
      const transferLog = receipt.logs.find((log) => {
        // Transfer 事件的 topic[0]
        return (
          log.topics[0] ===
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
        );
      });

      if (transferLog && transferLog.topics[3]) {
        // topic[3] 是 tokenId (indexed)
        tokenId = BigInt(transferLog.topics[3]);
      }
    }

    return {
      success: true,
      tokenId,
      transactionHash: hash,
    };
  } catch (error: any) {
    console.error("鑄造 NFT 失敗:", error);

    let errorMessage = "鑄造失敗，請稍後再試";

    if (error.message?.includes("User rejected")) {
      errorMessage = "使用者取消了交易";
    } else if (error.message?.includes("insufficient funds")) {
      errorMessage = "餘額不足，請確保有足夠的 Gas 費用";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * 檢查地址是否為合約的 owner
 * (可選：用於前端驗證)
 */
export async function isContractOwner(address: `0x${string}`): Promise<boolean> {
  try {
    // 這裡可以添加讀取合約 owner 的邏輯
    // 目前先返回 true (假設使用者就是 owner)
    return true;
  } catch (error) {
    console.error("檢查 owner 失敗:", error);
    return false;
  }
}

/**
 * 格式化交易 hash 用於顯示
 */
export function formatTransactionHash(hash: string): string {
  if (!hash) return "";
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

/**
 * 獲取 Sapphire 區塊鏈瀏覽器連結
 */
export function getSapphireExplorerUrl(
  hash: string,
  type: "tx" | "address" | "token" = "tx"
): string {
  const baseUrl = "https://explorer.oasis.io/testnet/sapphire"; // Testnet
  // 主網: https://explorer.oasis.io/mainnet/sapphire

  switch (type) {
    case "tx":
      return `${baseUrl}/tx/${hash}`;
    case "address":
      return `${baseUrl}/address/${hash}`;
    case "token":
      return `${baseUrl}/token/${hash}`;
    default:
      return baseUrl;
  }
}
