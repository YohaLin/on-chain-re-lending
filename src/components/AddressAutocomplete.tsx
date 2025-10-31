"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

interface Suggestion {
  description: string;
  place_id: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "請輸入資產地址",
  className = "",
  id = "address-input",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // 生成 session token（用於計費優化）
  useEffect(() => {
    setSessionToken(Math.random().toString(36).substring(7));
    setIsLoaded(true);
  }, []);

  // 使用 Places API (New) 的 Autocomplete endpoint
  const fetchSuggestions = async (input: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError("Google Maps API 金鑰未設定");
      return;
    }

    if (input.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places:autocomplete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
          },
          body: JSON.stringify({
            input: input,
            locationRestriction: {
              rectangle: {
                low: {
                  latitude: 21.9,
                  longitude: 120.0,
                },
                high: {
                  latitude: 25.3,
                  longitude: 122.0,
                },
              },
            },
            includedRegionCodes: ["TW"],
            languageCode: "zh-TW",
            sessionToken: sessionToken,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API 錯誤: ${response.status}`);
      }

      const data = await response.json();

      if (data.suggestions) {
        setSuggestions(
          data.suggestions.map((s: any) => ({
            description: s.placePrediction?.text?.text || "",
            place_id: s.placePrediction?.placeId || "",
          }))
        );
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("取得地址建議時發生錯誤:", err);
      setError("無法載入地址建議");
    }
  };

  // 輸入變更時，延遲搜尋
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // 清除之前的計時器
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 設定新的計時器，延遲 300ms 後搜尋
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  // 選擇建議項目
  const handleSelectSuggestion = (suggestion: Suggestion) => {
    onChange(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
    // 重新生成 session token
    setSessionToken(Math.random().toString(36).substring(7));
  };

  // 點擊外部關閉建議列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // 如果 API 載入失敗，顯示一般輸入框
  if (error) {
    return (
      <div>
        <Input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
        <p className="text-xs text-yellow-600 mt-1">
          {error}（目前使用一般輸入模式）
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Input
        id={id}
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        className={className}
        autoComplete="off"
      />

      {/* 建議列表 */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id || index}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors"
              onMouseDown={(e) => {
                e.preventDefault(); // 防止失去焦點
                handleSelectSuggestion(suggestion);
              }}
            >
              <p className="text-sm text-gray-900">{suggestion.description}</p>
            </div>
          ))}
        </div>
      )}

      {!isLoaded && (
        <p className="text-xs text-muted-foreground mt-1">
          載入地址自動完成功能中...
        </p>
      )}
    </div>
  );
}
