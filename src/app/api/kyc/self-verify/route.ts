import { NextRequest, NextResponse } from "next/server";

// Self.xyz 驗證 API
// 注意：這個實作需要安裝 @selfxyz/core 套件
// 執行: yarn add @selfxyz/qrcode @selfxyz/core

export async function POST(req: NextRequest) {
  try {
    const { attestationId, proof, publicSignals, userContextData } =
      await req.json();

    // 驗證必要參數（所有欄位都必須存在）
    if (!attestationId || !proof || !publicSignals || !userContextData) {
      return NextResponse.json(
        {
          status: "error",
          result: false,
          reason: "缺少必要參數",
        },
        { status: 200 } // 根據 Self.xyz 文件，狀態碼必須是 200
      );
    }

    // 使用 Self.xyz SDK 進行真實驗證
    const { SelfBackendVerifier, AllIds, DefaultConfigStore } = await import("@selfxyz/core");

    const verifier = new SelfBackendVerifier(
      "kyc-verification", // 必須與前端的 scope 參數完全一致
      process.env.NEXT_PUBLIC_SELF_ENDPOINT || "http://192.168.0.225:3000/api/kyc/self-verify",
      false, // 開發環境設為 false，生產環境設為 true
      AllIds,
      new DefaultConfigStore({
        minimumAge: parseInt(process.env.SELF_MINIMUM_AGE || "18"),
        // excludedCountries 已移除，以確保與前端配置匹配
        ofac: false, // 暫時關閉 OFAC 檢查
      }),
      "hex" // 前端使用錢包地址（hex 格式），不是 uuid
    );

    const result = await verifier.verify(
      attestationId,
      proof,
      publicSignals,
      userContextData
    );

    // 檢查驗證結果
    const { isValid, isMinimumAgeValid, isOfacValid } = result.isValidDetails;

    // isOfacValid === true 表示在 OFAC 制裁名單上，應該拒絕
    if (!isValid || !isMinimumAgeValid || isOfacValid) {
      return NextResponse.json(
        {
          status: "error",
          result: false,
          reason: !isValid
            ? "密碼學驗證失敗"
            : !isMinimumAgeValid
            ? "年齡不符合要求"
            : "用戶在 OFAC 制裁名單上",
          error_code: "VERIFICATION_FAILED",
          details: result.isValidDetails,
        },
        { status: 200 } // 根據 Self.xyz 文件，狀態碼必須是 200
      );
    }

    // 驗證成功，返回用戶資料（Self App 要求的格式）
    return NextResponse.json(
      {
        status: "success",
        result: true,
        credentialSubject: result.discloseOutput,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Self 驗證錯誤:", error);
    return NextResponse.json(
      {
        status: "error",
        result: false,
        reason: error instanceof Error ? error.message : "未知錯誤",
        error_code: "SERVER_ERROR",
      },
      { status: 200 } // 根據 Self.xyz 文件，狀態碼必須是 200
    );
  }
}
