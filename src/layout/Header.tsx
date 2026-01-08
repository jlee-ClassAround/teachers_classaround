"use client";

import UserDropdown from "@/components/header/UserDropdown";


export default function Header() {
  return (
    <header className="sticky top-0 z-[50] flex w-full items-center bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900 h-12 px-4">
      <div className="flex items-center">
      </div>
      <div className="ml-auto flex items-center gap-3">
        <UserDropdown />
      </div>
    </header>
  );
}