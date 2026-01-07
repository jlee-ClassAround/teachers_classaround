"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, HorizontaLDots } from "../icons/index";
// 아까 분리한 메뉴 데이터 임포트
import { navItems, othersItems, NavItem } from "@/constants/SidebarMenu";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();

  // 서브메뉴 상태 관리
  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  // 클릭 토글 핸들러 (호버 없음)
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.innerWidth >= 1024) {
      toggleSidebar(); // PC: 고정 확장/축소
    } else {
      toggleMobileSidebar(); // 모바일: 사이드바 열기/닫기
    }
  };

  // 현재 경로에 따라 서브메뉴 자동 열기
  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems?.some((sub) => isActive(sub.path))) {
          setOpenSubmenu({ type: menuType as "main" | "others", index });
          submenuMatched = true;
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  // 서브메뉴 높이 계산 (애니메이션용)
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev?.type === menuType && prev.index === index ? null : { type: menuType, index }
    );
  };

  // 메뉴 아이템 렌더링 함수
  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group w-full ${
                openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"
              } cursor-pointer ${!isExpanded ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className={openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}>
                {nav.icon}
              </span>
              {isExpanded && (
                <>
                  <span className="menu-item-text">{nav.name}</span>
                  <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180" : ""}`} />
                </>
              )}
            </button>
          ) : (
            nav.path && (
              <Link href={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"} ${!isExpanded ? "lg:justify-center" : ""}`}>
                <span className={isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}>{nav.icon}</span>
                {isExpanded && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          
          {/* 서브메뉴 영역 (펼쳐졌을 때만 렌더링) */}
          {nav.subItems && isExpanded && (
            <div
              ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
              className="overflow-hidden transition-all duration-300"
              style={{ height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link href={subItem.path} className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed flex flex-col top-0 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* 로고 영역 및 토글 버튼 */}
      <div className={`py-8 px-5 flex items-center ${isExpanded || isMobileOpen ? "justify-between" : "justify-center"}`}>
        <Link href="/">
          {isExpanded || isMobileOpen ? (
            <Image className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} />
          ) : (
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
        
        {/* 사이드바가 펼쳐졌을 때 로고 옆에 붙는 토글 버튼 */}
        {(isExpanded || isMobileOpen) && (
          <button onClick={handleToggle} className="p-1.5 border rounded-md hover:bg-gray-100 dark:border-gray-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
            </svg>
          </button>
        )}
      </div>

      {/* 사이드바가 접혔을 때 가운데 나타나는 펴기 버튼 (PC 전용) */}
      {!isExpanded && !isMobileOpen && (
        <button onClick={handleToggle} className="hidden lg:flex mx-auto mb-6 p-2 border border-gray-100 rounded-lg hover:bg-gray-50 dark:border-gray-700">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
           </svg>
        </button>
      )}

      {/* 메뉴 리스트 영역 */}
      <div className="flex flex-col overflow-y-auto no-scrollbar px-5">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* 메인 메뉴 섹션 */}
            <div>
              <h2 className={`mb-4 text-xs uppercase flex text-gray-400 ${!isExpanded ? "justify-center" : ""}`}>
                {isExpanded ? "Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            
            {/* 기타 메뉴 섹션 */}
            <div className="mt-4">
              <h2 className={`mb-4 text-xs uppercase flex text-gray-400 ${!isExpanded ? "justify-center" : ""}`}>
                {isExpanded ? "Others" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;