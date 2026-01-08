"use client";

import React, { useState, useMemo } from "react";

export default function CourseStudentTable({ users = [] }: { users: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const [sortKey, setSortKey] = useState<string>("username"); // 기본 정렬: 이름
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // 1. 검색 + 정렬 로직 (이름, 이메일, 연락처 통합 검색)
  const processedUsers = useMemo(() => {
    let filtered = users.filter((u) => 
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm)
    );

    return filtered.sort((a, b) => {
      const aValue = a[sortKey] ?? "";
      const bValue = b[sortKey] ?? "";
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, searchTerm, sortKey, sortOrder]);

  // 2. 페이지네이션 계산
  const totalPages = Math.ceil(processedUsers.length / itemsPerPage) || 1;
  const currentItems = processedUsers.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* 상단 컨트롤러: 검색 및 보기 개수 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="이름, 이메일, 연락처로 검색..."
          className="w-full max-w-sm px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#465FFF] dark:bg-gray-800 dark:border-gray-700"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">보기:</span>
          <select 
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-3 py-2 border rounded-lg text-sm outline-none dark:bg-gray-800"
          >
            <option value={10}>10개씩</option>
            <option value={30}>30개씩</option>
            <option value={50}>50개씩</option>
          </select>
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="overflow-hidden border border-gray-200 rounded-xl dark:border-gray-700 bg-white dark:bg-transparent">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-700 font-medium">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:text-[#465FFF]" onClick={() => toggleSort("username")}>
                수강생 {sortKey === "username" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-6 py-4">연락처</th>
              <th className="px-6 py-4">옵션</th>
              <th className="px-6 py-4 cursor-pointer hover:text-[#465FFF]" onClick={() => toggleSort("progress")}>
                진도율 {sortKey === "progress" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-6 py-4 cursor-pointer hover:text-[#465FFF]" onClick={() => toggleSort("endDate")}>
                종료일 {sortKey === "endDate" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-6 py-4">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentItems.length > 0 ? (
              currentItems.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* 아바타 이미지 영역 */}
                      <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{user.username}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {user.phone || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 dark:text-gray-400">{user.courseOption}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#465FFF] transition-all duration-500" 
                          style={{ width: `${user.progress}%` }} 
                        />
                      </div>
                      <span className="font-medium text-xs">{user.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {user.endDate ? new Date(user.endDate).toLocaleDateString('ko-KR') : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.isActive 
                        ? "bg-[#ECF3FF] text-[#465FFF]" 
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {user.isActive ? "수강중" : "만료"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  해당하는 수강생 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 컨트롤 */}
      <div className="flex justify-between items-center px-2 py-4">
        <p className="text-sm text-gray-500 font-medium">
          전체 {processedUsers.length}명 중 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, processedUsers.length)} 표시
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1} 
            className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            이전
          </button>
          <div className="flex items-center justify-center bg-[#ECF3FF] text-[#465FFF] px-4 py-1.5 rounded-lg font-bold text-sm">
            {currentPage} / {totalPages}
          </div>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages} 
            className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}