import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string; // 링크가 없는 마지막 항목은 href를 생략할 수 있음
}

interface BreadcrumbProps {
  pageTitle: string; // 왼쪽 큰 제목 (강의명)
  items?: BreadcrumbItem[]; // 오른쪽 경로 아이템들
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, items = [] }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      {/* 왼쪽: 현재 강의명 (큰 제목) */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {pageTitle}
      </h2>

      {/* 오른쪽: Home > 강의 목록 > 강의 상세 */}
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#465FFF] dark:text-gray-400 dark:hover:text-[#465FFF] transition-colors"
              href="/"
            >
              Home
            </Link>
          </li>

          {/* 화살표 아이콘 및 중간 경로들 */}
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <li className="text-gray-500">
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </li>
              <li className={`text-sm ${!item.href ? "text-gray-800 dark:text-white/90 font-medium" : "text-gray-500 hover:text-[#465FFF] dark:text-gray-400 transition-colors"}`}>
                {item.href ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  item.label
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;