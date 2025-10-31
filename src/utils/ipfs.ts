/**
 * IPFS 上傳工具函數
 * 使用 Pinata 服務上傳 NFT metadata 到 IPFS
 */

interface NFTMetadata {
  name: string;
  description: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
  properties?: {
    address?: string;
    assetType?: string;
    [key: string]: any;
  };
}

/**
 * 上傳 JSON metadata 到 IPFS (使用 Pinata)
 * @param metadata NFT metadata 物件
 * @returns IPFS URI (格式: ipfs://Qm...)
 */
export async function uploadMetadataToIPFS(
  metadata: NFTMetadata
): Promise<string> {
  const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

  // 如果沒有設定 Pinata keys，返回 mock URI (用於測試)
  if (!pinataApiKey || !pinataSecretKey) {
    console.warn(
      "⚠️ Pinata API keys 未設定，使用 mock URI。請在 .env.local 設定 NEXT_PUBLIC_PINATA_API_KEY 和 NEXT_PUBLIC_PINATA_SECRET_KEY"
    );
    // 生成一個基於時間戳的 mock CID
    const mockCID = `QmMock${Date.now()}${Math.random()
      .toString(36)
      .substring(7)}`;
    return `ipfs://${mockCID}`;
  }

  try {
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretKey,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `${metadata.name}_metadata.json`,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Pinata API 錯誤: ${response.status}`);
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error("上傳到 IPFS 失敗:", error);
    throw new Error("上傳到 IPFS 失敗，請稍後再試");
  }
}

/**
 * 上傳圖片文件到 IPFS
 * @param file 圖片文件
 * @returns IPFS URI (格式: ipfs://Qm...)
 */
export async function uploadImageToIPFS(file: File): Promise<string> {
  const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

  if (!pinataApiKey || !pinataSecretKey) {
    console.warn("⚠️ Pinata API keys 未設定，使用 mock URI");
    const mockCID = `QmImageMock${Date.now()}`;
    return `ipfs://${mockCID}`;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: file.name,
      })
    );

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretKey,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Pinata API 錯誤: ${response.status}`);
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error("上傳圖片到 IPFS 失敗:", error);
    throw new Error("上傳圖片失敗，請稍後再試");
  }
}

/**
 * 將 IPFS URI 轉換為 HTTP gateway URL (用於瀏覽器顯示)
 * @param ipfsUri IPFS URI (格式: ipfs://Qm...)
 * @returns HTTP URL
 */
export function ipfsToHttp(ipfsUri: string): string {
  if (!ipfsUri || !ipfsUri.startsWith("ipfs://")) {
    return ipfsUri;
  }
  const cid = ipfsUri.replace("ipfs://", "");
  // 使用 Pinata gateway (也可以用其他 gateway)
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
