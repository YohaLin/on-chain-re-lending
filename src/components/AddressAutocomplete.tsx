"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader } from "@googlemaps/js-api-loader";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "請輸入資產地址",
  className = "",
  id = "address-input",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError("Google Maps API 金鑰未設定");
      console.error("請在 .env.local 中設定 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["places"],
      language: "zh-TW",
      region: "TW",
    });

    loader
      .load()
      .then(() => {
        setIsLoaded(true);
        if (inputRef.current) {
          // 初始化 Autocomplete
          autocompleteRef.current = new google.maps.places.Autocomplete(
            inputRef.current,
            {
              componentRestrictions: { country: "tw" }, // 限制台灣地區
              fields: ["formatted_address", "address_components", "geometry", "name"],
              types: ["address"], // 只顯示地址類型的建議
            }
          );

          // 監聽地址選擇事件
          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current?.getPlace();
            if (place?.formatted_address) {
              onChange(place.formatted_address);
            } else if (place?.name) {
              onChange(place.name);
            }
          });
        }
      })
      .catch((err) => {
        console.error("載入 Google Maps API 時發生錯誤:", err);
        setError("無法載入地址自動完成功能");
      });

    // 清理函數
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

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
        onChange={(e) => onChange(e.target.value)}
        className={className}
      />
      {!isLoaded && (
        <p className="text-xs text-muted-foreground mt-1">
          載入地址自動完成功能中...
        </p>
      )}
    </div>
  );
}
