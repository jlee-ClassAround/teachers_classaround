"use client";

import React from "react";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import UserDropdown from "@/components/header/UserDropdown";


export default function Header() {
  return (
    <header className="sticky top-0 z-[50] flex w-full items-center bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900 h-12 px-4">
      {/* 1. 왼쪽 영역 (필요 시 사이드바 트리거 등을 넣음) */}
      <div className="flex items-center">
        {/* 현재는 비워둠 */}
      </div>

      {/* 2. 오른쪽 영역 (오른쪽 끝으로 밀기 위해 ml-auto 사용 가능하지만 전체 부모에 justify-between 권장) */}
      <div className="ml-auto flex items-center gap-3">
        {/* <ThemeToggleButton /> */}
        {/* UserDropdown 내부에서 세션 처리를 하도록 설계합니다 */}
        <UserDropdown />
      </div>
    </header>
  );
}