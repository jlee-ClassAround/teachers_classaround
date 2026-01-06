"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import NextImage from "next/image";

type Brand = "cojooboo" | "ivy";

type BrandMeta = {
  key: Brand;
  title: string;
  subtitle: string;
  logoSrc: string;
};

const BRANDS: BrandMeta[] = [
  {
    key: "cojooboo",
    title: "코주부클래스",
    subtitle: "cojooboo",
    logoSrc: "/brands/cojooboo.svg",
  },
  {
    key: "ivy",
    title: "아이비클래스",
    subtitle: "ivy",
    logoSrc: "/brands/ivy.svg",
  },
];

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const selectedMeta = useMemo(
    () => BRANDS.find((b) => b.key === selectedBrand) ?? null,
    [selectedBrand]
  );

  const onKakao = (): void => {
    if (!selectedMeta) {
      alert("로그인할 서비스를 선택해주세요.");
      return;
    }

    setIsLoading(true);
    requestAnimationFrame(() => {
      const path = `kakao/${selectedBrand}/start`;
      router.push(path);
      
    });
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              안녕하세요 강사님
            </h1>
          </div>

          {/* ✅ 브랜드 선택 */}
          <div className="space-y-3 mb-4">
            <div className="text-sm font-medium text-gray-700 dark:text-white/80">
              로그인할 서비스를 선택하세요
            </div>

            <div className="grid grid-cols-2 gap-3">
              {BRANDS.map((b) => (
                <BrandCard
                  key={b.key}
                  meta={b}
                  selected={selectedBrand === b.key}
                  disabled={isLoading}
                  onClick={() => setSelectedBrand(b.key)}
                />
              ))}
            </div>

            {selectedMeta ? (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                선택됨: <span className="font-semibold">{selectedMeta.title}</span>
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                서비스를 선택하면 로그인 버튼이 활성화됩니다.
              </div>
            )}
          </div>

          {/* ✅ 카카오 버튼 */}
          <KakaoButton
            isLoading={isLoading}
            onKakao={onKakao}
            disabled={!selectedBrand}
          />
        </div>
      </div>
    </div>
  );
}

function BrandCard({
  meta,
  selected,
  disabled,
  onClick,
}: {
  meta: BrandMeta;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full overflow-hidden rounded-xl border p-3 text-left transition",
        "active:scale-[0.99]",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        selected
          ? "border-emerald-500 ring-2 ring-emerald-200 bg-white"
          : "border-slate-200 bg-white hover:bg-slate-50 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10"
      )}
    >
      {/* 선택 배지 */}
      <div
        className={cn(
          "absolute right-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold",
          selected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
        )}
      >
        <Check className="size-3" />
        {selected ? "선택됨" : "선택"}
      </div>

      <div className="flex items-center gap-3">

        <div className="min-w-0 h-25">
           <img
              src={meta.logoSrc}
              alt={`${meta.title} 로고`}
              className="w-full h-full object-contain"
              draggable={false}
            />
        </div>
      </div>
    </button>
  );
}

function KakaoButton({
  isLoading,
  onKakao,
  disabled,
}: {
  isLoading: boolean;
  onKakao: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onKakao}
      disabled={isLoading || disabled}
      className={cn(
        "px-8 py-4 w-full flex items-center justify-center rounded-lg bg-[#ffeb35] text-[#392020] gap-x-3 hover:opacity-90 transition",
        "disabled:bg-foreground/20 disabled:text-foreground/40 disabled:cursor-not-allowed"
      )}
    >
      <div className="relative aspect-square size-5">
        <NextImage
          fill
          src={"/social/kakao-icon.svg"}
          alt="kakao icon"
          className={cn(isLoading && "opacity-50")}
        />
      </div>
      <span className="font-semibold">
        {isLoading ? "카카오톡 로그인 중..." : "카카오톡으로 3초만에 시작하기"}
      </span>
      {isLoading && <Loader2 className="size-5 stroke-[3px] animate-spin" />}
    </button>
  );
}
