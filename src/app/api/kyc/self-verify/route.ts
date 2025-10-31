import { NextRequest, NextResponse } from "next/server";

// Self.xyz 驗證 API
// 注意：這個實作需要安裝 @selfxyz/core 套件
// 執行: yarn add @selfxyz/qrcode @selfxyz/core

export async function POST(req: NextRequest) {
  try {
    const { attestationId, proof, publicSignals, userContextData } =
      await req.json();

    // 驗證必要參數
    if (!attestationId || !proof || !publicSignals) {
      return NextResponse.json(
        {
          status: "error",
          message: "缺少必要參數",
        },
        { status: 400 }
      );
    }

    // 使用 Self.xyz SDK 進行真實驗證
    const { SelfBackendVerifier, AllIds, DefaultConfigStore } = await import("@selfxyz/core");

    const verifier = new SelfBackendVerifier(
      process.env.SELF_APP_NAME || "on-chain-re-lending",
      process.env.NEXT_PUBLIC_SELF_ENDPOINT || "http://192.168.0.225:3000/api/kyc/self-verify",
      false, // 開發環境設為 false，生產環境設為 true
      AllIds,
      new DefaultConfigStore({
        minimumAge: parseInt(process.env.SELF_MINIMUM_AGE || "18"),
        // excludedCountries 已移除，以確保與前端配置匹配
        ofac: false, // 暫時關閉 OFAC 檢查
      }),
      "uuid"
    );

    const result = await verifier.verify(
      attestationId,
      proof,
      publicSignals,
      userContextData
    );

    if (!result.isValidDetails.isValid) {
      return NextResponse.json(
        {
          status: "error",
          message: "身份驗證失敗",
          details: result.isValidDetails,
        },
        { status: 400 }
      );
    }

    // 驗證成功，返回用戶資料
    return NextResponse.json({
      status: "success",
      data: {
        verified: true,
        credentialSubject: result.discloseOutput,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Self 驗證錯誤:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "伺服器錯誤",
        error: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 }
    );
  }
}
