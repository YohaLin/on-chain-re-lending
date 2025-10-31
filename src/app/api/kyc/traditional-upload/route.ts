import { NextRequest, NextResponse } from "next/server";

// 傳統 KYC 上傳 API
// 處理手動上傳的證件和自拍照
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 獲取表單數據
    const fullName = formData.get("fullName") as string;
    const idType = formData.get("idType") as string;
    const idNumber = formData.get("idNumber") as string;
    const birthDate = formData.get("birthDate") as string;
    const idDocument = formData.get("idDocument") as File;
    const selfiePhoto = formData.get("selfiePhoto") as File;
    const walletAddress = formData.get("walletAddress") as string;

    // 驗證必要欄位
    if (!fullName || !idType || !idNumber || !birthDate) {
      return NextResponse.json(
        {
          status: "error",
          message: "請填寫所有必填欄位",
        },
        { status: 400 }
      );
    }

    if (!idDocument || !selfiePhoto) {
      return NextResponse.json(
        {
          status: "error",
          message: "請上傳身份證件和自拍照",
        },
        { status: 400 }
      );
    }

    // 驗證文件大小（10MB）
    const maxSize = 10 * 1024 * 1024;
    if (idDocument.size > maxSize || selfiePhoto.size > maxSize) {
      return NextResponse.json(
        {
          status: "error",
          message: "文件大小不能超過 10MB",
        },
        { status: 400 }
      );
    }

    // 驗證文件格式
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (
      !allowedTypes.includes(idDocument.type) ||
      !allowedTypes.includes(selfiePhoto.type)
    ) {
      return NextResponse.json(
        {
          status: "error",
          message: "只支援 JPG、JPEG、PNG 格式",
        },
        { status: 400 }
      );
    }

    // TODO: 實際實作
    // 1. 將文件上傳到儲存服務（S3, IPFS, 或本地）
    // 2. 調用 OCR API 識別證件資訊
    // 3. 調用人臉識別 API 驗證自拍照
    // 4. 將 KYC 資料儲存到資料庫
    // 5. 可選：將驗證結果上鏈

    // 暫時的模擬處理
    console.log("收到傳統 KYC 上傳:", {
      fullName,
      idType,
      idNumber,
      birthDate,
      walletAddress,
      idDocumentSize: idDocument.size,
      selfiePhotoSize: selfiePhoto.size,
    });

    // 模擬處理時間
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json({
      status: "success",
      data: {
        kycId: `kyc_${Date.now()}`,
        verified: false, // 需要人工審核
        status: "pending_review",
        submittedAt: new Date().toISOString(),
        message: "您的 KYC 申請已提交，通常需要 1-2 個工作天審核",
      },
    });
  } catch (error) {
    console.error("傳統 KYC 上傳錯誤:", error);
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
