# 選項：改用後端上傳 IPFS

如果你想要更安全的方案，可以改成後端上傳 IPFS。

## 方案對比

| 特性 | 前端上傳 (目前) | 後端上傳 |
|------|----------------|----------|
| 安全性 | ⚠️ API keys 在前端 | ✅ Keys 在後端，更安全 |
| 複雜度 | ✅ 簡單，不需後端 | ❌ 需要後端 API |
| 速度 | ✅ 直接上傳，較快 | ⚠️ 多一次轉發 |
| 費用控制 | ❌ 使用者可能濫用 | ✅ 可加入速率限制 |

## 實作步驟（如果要改用後端）

### 1. 創建後端 API Route

在 `src/app/api/upload-metadata/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const metadata = await request.json();

    // Pinata keys 從伺服器端環境變數讀取 (不會暴露給前端)
    const pinataApiKey = process.env.PINATA_API_KEY;  // 注意：沒有 NEXT_PUBLIC_
    const pinataSecretKey = process.env.PINATA_SECRET_KEY;

    if (!pinataApiKey || !pinataSecretKey) {
      return NextResponse.json(
        { error: "Pinata keys 未設定" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretKey,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: \`\${metadata.name}_metadata.json\`,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(\`Pinata API 錯誤: \${response.status}\`);
    }

    const data = await response.json();
    return NextResponse.json({ uri: \`ipfs://\${data.IpfsHash}\` });
  } catch (error: any) {
    console.error("上傳失敗:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### 2. 修改前端 ipfs.ts

```typescript
export async function uploadMetadataToIPFS(
  metadata: NFTMetadata
): Promise<string> {
  try {
    // 呼叫自己的後端 API (不直接呼叫 Pinata)
    const response = await fetch("/api/upload-metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error(\`上傳失敗: \${response.status}\`);
    }

    const data = await response.json();
    return data.uri; // ipfs://QmXXX...
  } catch (error) {
    console.error("上傳到 IPFS 失敗:", error);
    throw new Error("上傳到 IPFS 失敗，請稍後再試");
  }
}
```

### 3. 環境變數設定

**`.env.local`** (伺服器端，不會暴露):
```env
# 注意：沒有 NEXT_PUBLIC_ 前綴
PINATA_API_KEY=你的key
PINATA_SECRET_KEY=你的secret
```

**優點**:
- ✅ API keys 完全隱藏在後端
- ✅ 可以加入 rate limiting
- ✅ 可以加入 authentication
- ✅ 更好的錯誤處理

**缺點**:
- ❌ 需要維護後端 API
- ❌ 多一次網路請求

## 我的建議

**測試階段**: 使用前端上傳（簡單快速）
**生產階段**: 考慮改用後端上傳（更安全）

如果你決定要改用後端，我可以立即幫你實作！
