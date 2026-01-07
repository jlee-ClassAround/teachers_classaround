"use client";

import { useSidebar } from "@/context/SidebarContext";

import AppSidebar from "@/layout/AppSidebar";
import Header from "@/layout/Header";
import { cn } from "@/lib/utils";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

return (
    <div className="relative flex min-h-screen">
      {/* 사이드바 영역 */}
      <AppSidebar />

      {/* 메인 콘텐츠 영역 */}
      <div
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          !isMobileOpen && mainContentMargin 
        )}
      >
        <Header />

        {/* 페이지 본문 (새 코드의 패딩 및 맥스 너비 적용) */}
        <main className="bg-slate-100 min-h-[calc(100vh-3rem)]">
          <div className="mx-auto p-4 md:p-6 max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}