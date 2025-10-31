import { NextRequest, NextResponse } from "next/server";

// 新北市政府不動產實價登錄 API 基礎 URL
const NTPC_API_BASE_URL = "https://data.ntpc.gov.tw/api/datasets/ACCE802D-58CC-4DFF-9E7A-9ECC517F78BE/json";

// 定義新北市不動產實價登錄資料結構
interface NTPCPropertyData {
  district: string; // 鄉鎮市區
  rps01: string; // 交易標的
  rps02: string; // 土地區段位置建物區段門牌
  rps03_area: string; // 土地移轉總面積平方公尺
  rps04: string; // 都市土地使用分區
  rps05: string; // 非都市土地使用分區
  rps06: string; // 非都市土地使用編定
  rps07_yyymmddroc: string; // 交易年月日
  rps08: string; // 交易筆棟數
  rps09: string; // 移轉層次
  rps10: string; // 總樓層數
  rps11: string; // 建物型態
  rps12: string; // 主要用途
  rps13: string; // 主要建材
  rps14_yyymmddroc: string; // 建築完成年月
  rps15_area: string; // 建物移轉總面積平方公尺
  rps16_quantity: string; // 建物現況格局-房
  rps17_quantity: string; // 建物現況格局-廳
  rps18_quantity: string; // 建物現況格局-衛
  rps19: string; // 建物現況格局-隔間
  rps20: string; // 有無管理組織
  rps21_amountsunitdollars: string; // 總價元
  rps22_amountsunitdollars: string; // 單價元平方公尺
  rps23: string; // 車位類別
  rps24_area: string; // 車位移轉總面積平方公尺
  rps25_amountsunitdollars: string; // 車位總價元
  rps26: string; // 備註
  rps27: string; // 編號
  rps28_area: string; // 主建物面積
  rps29_area: string; // 附屬建物面積
  rps30_area: string; // 陽台面積
  rps31: string; // 電梯
  rps32: string; // 移轉編號
}

// 從完整地址提取區域和街道資訊
function extractAddressComponents(address: string): {
  district: string | null;
  street: string | null;
  streetWithFullWidth: string | null; // 保留全形數字版本
} {
  // 移除「新北市」前綴（如果有）
  let cleanAddress = address.replace(/^新北市/, "");

  // 提取區域（例如：新莊區、板橋區）- 在轉換數字之前
  const districtMatch = cleanAddress.match(/^([^市]+?[區鎮鄉市])/);
  const district = districtMatch ? districtMatch[1] : null;

  // 提取街道名稱（保留全形數字，因為 API 資料使用全形）
  let streetWithFullWidth: string | null = null;
  if (district) {
    const afterDistrict = cleanAddress.replace(district, "");
    // 先嘗試匹配到「巷」為止（如果有巷）- 包含全形數字
    const alleyMatch = afterDistrict.match(/^([^０-９0-9]*?[街路道][^巷]*?巷)/);
    if (alleyMatch) {
      streetWithFullWidth = alleyMatch[1].trim();
    } else {
      // 如果沒有巷，就只匹配到街/路/道
      const streetMatch = afterDistrict.match(/^([^０-９0-9]*?[街路道])/);
      streetWithFullWidth = streetMatch ? streetMatch[1].trim() : null;
    }
  }

  // 同時提供半形版本（作為備用）
  const street = streetWithFullWidth
    ? streetWithFullWidth.replace(/[０-９]/g, (char) =>
        String.fromCharCode(char.charCodeAt(0) - 0xfee0)
      )
    : null;

  return { district, street, streetWithFullWidth };
}

// 建構 API 查詢 URL，使用 $filter 參數
function buildApiUrl(district: string | null, street: string | null): string {
  const params = new URLSearchParams();

  // 設定分頁參數（避免資料量過大）
  params.append("page", "0");
  params.append("size", "100");

  // 建構篩選條件
  const filters: string[] = [];

  if (district) {
    // district 欄位完全匹配
    filters.push(`district eq '${district}'`);
  }

  if (street) {
    // rps02 欄位模糊匹配（包含街道名稱）
    filters.push(`rps02 like '${street}'`);
  }

  if (filters.length > 0) {
    // 使用 and 連接多個條件
    params.append("$filter", filters.join(" and "));
  }

  return `${NTPC_API_BASE_URL}?${params.toString()}`;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "地址參數為必填項" },
        { status: 400 }
      );
    }

    // 提取地址組成部分
    const { district, street, streetWithFullWidth } = extractAddressComponents(address);

    if (!district) {
      return NextResponse.json(
        {
          error: "無法辨識地址的區域資訊",
          suggestion: "請確認地址格式，例如：新北市新莊區福壽街123號",
        },
        { status: 400 }
      );
    }

    // 建構包含 $filter 參數的 API URL（優先使用全形數字版本，因為 API 資料使用全形）
    const apiUrl = buildApiUrl(district, streetWithFullWidth || street);

    console.log(`查詢 API URL: ${apiUrl}`);
    console.log(`提取的區域: ${district}, 街道（全形）: ${streetWithFullWidth || "未指定"}, 街道（半形）: ${street || "未指定"}`);

    // 呼叫新北市政府 API（使用篩選參數）
    let response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
    });

    let data: NTPCPropertyData[] = [];

    // 如果使用 $filter 失敗（可能被安全機制阻擋），改用基礎 API
    if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
      console.log("$filter 查詢失敗，改用基礎 API 並在程式碼中過濾");

      // 使用基礎 API（不帶 $filter），但增加 size 以獲取更多資料
      const basicUrl = `${NTPC_API_BASE_URL}?page=0&size=1000`;
      response = await fetch(basicUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
      });

      if (!response.ok) {
        throw new Error(`新北市政府 API 回應錯誤: ${response.status}`);
      }

      const allData: NTPCPropertyData[] = await response.json();

      // 在程式碼中進行過濾
      const searchStreet = streetWithFullWidth || street;
      data = allData.filter((property) => {
        // 先檢查區域
        if (property.district !== district) return false;

        // 如果有街道資訊，檢查地址是否包含街道
        if (searchStreet) {
          return property.rps02 && property.rps02.includes(searchStreet);
        }

        return true;
      });

      console.log(`從 ${allData.length} 筆資料中過濾出 ${data.length} 筆符合的資料`);
    } else {
      data = await response.json();
    }

    if (!data || data.length === 0) {
      // 如果沒有找到資料，嘗試降級搜尋
      const searchStreet = streetWithFullWidth || street;
      if (searchStreet) {
        // 策略1: 如果原本搜尋包含巷弄，嘗試只搜尋主要街道（去掉巷號）
        // 同時處理全形和半形數字
        const mainStreet = searchStreet.match(/^([^０-９0-9]*?[街路道])/);
        if (mainStreet && mainStreet[1] !== searchStreet) {
          console.log(`降級搜尋：從「${searchStreet}」改為「${mainStreet[1]}」`);
          const fallbackUrl1 = buildApiUrl(district, mainStreet[1]);
          const fallbackResponse1 = await fetch(fallbackUrl1, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (fallbackResponse1.ok) {
            const fallbackData1: NTPCPropertyData[] = await fallbackResponse1.json();
            if (fallbackData1 && fallbackData1.length > 0) {
              console.log(`找到 ${fallbackData1.length} 筆資料（使用主街道）`);
              return processPropertyData(fallbackData1, address, district);
            }
          }
        }

        // 策略2: 只用區域查詢（不用街道篩選）
        console.log("使用街道篩選無結果，嘗試只用區域查詢");
        const fallbackUrl2 = buildApiUrl(district, null);
        const fallbackResponse2 = await fetch(fallbackUrl2, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (fallbackResponse2.ok) {
          const fallbackData2: NTPCPropertyData[] = await fallbackResponse2.json();
          if (fallbackData2 && fallbackData2.length > 0) {
            console.log(`找到 ${fallbackData2.length} 筆資料（只用區域）`);
            return processPropertyData(fallbackData2, address, district);
          }
        }
      }

      return NextResponse.json(
        {
          error: "找不到符合的不動產資料",
          suggestion: "請確認地址是否位於新北市，並嘗試使用更完整的地址格式",
          searchCriteria: { district, street: streetWithFullWidth || street },
        },
        { status: 404 }
      );
    }

    return processPropertyData(data, address, district);
  } catch (error) {
    console.error("Property valuation API error:", error);
    return NextResponse.json(
      {
        error: "查詢不動產資料時發生錯誤",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 }
    );
  }
}

// 處理查詢到的不動產資料
function processPropertyData(
  matchedProperties: NTPCPropertyData[],
  originalAddress: string,
  district: string
) {
  // 計算平均價格和價格範圍
  const prices = matchedProperties
    .map((p) => parseFloat(p.rps21_amountsunitdollars || "0"))
    .filter((price) => price > 0);

  const averagePrice = prices.length > 0
    ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
    : 0;

  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  // 獲取最近的交易記錄（前 5 筆）
  const recentTransactions = matchedProperties
    .sort((a, b) => {
      const dateA = parseInt(a.rps07_yyymmddroc || "0");
      const dateB = parseInt(b.rps07_yyymmddroc || "0");
      return dateB - dateA; // 降序排列
    })
    .slice(0, 5)
    .map((property) => ({
      district: property.district,
      address: property.rps02,
      price: parseInt(property.rps21_amountsunitdollars || "0"),
      pricePerSqm: parseInt(property.rps22_amountsunitdollars || "0"),
      area: parseFloat(property.rps15_area || "0"),
      buildingType: property.rps11,
      rooms: property.rps16_quantity,
      livingRooms: property.rps17_quantity,
      bathrooms: property.rps18_quantity,
      floor: property.rps09,
      totalFloors: property.rps10,
      transactionDate: property.rps07_yyymmddroc,
      buildYear: property.rps14_yyymmddroc,
    }));

  return NextResponse.json({
    success: true,
    data: {
      searchAddress: originalAddress,
      matchCount: matchedProperties.length,
      estimatedValue: averagePrice,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
      recentTransactions,
    },
  });
}
