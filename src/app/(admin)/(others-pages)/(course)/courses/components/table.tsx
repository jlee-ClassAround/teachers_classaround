"use client";

import Image from "next/image";
import Link from "next/link"; // 💡 링크 이동을 위해 추가
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

interface Props {
  searchTerm: string;
}

interface CommonCourseForm {
  id: string;
  title: string;
  thumbnail?: string;
  productType: 'SIMPLE' | 'OPTION' | string;
  originalPrice: number;
  discountedPrice: number;
  endDate: string | Date; 
  _count: {
    enrollments: number;
  };
}

export default function CourseTable({ searchTerm }: Props) {
  const [courses, setCourses] = useState<CommonCourseForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 💡 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지에 보여줄 항목 수

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Course fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 검색 필터링
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 💡 페이지네이션 계산
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

  // 검색어가 바뀌면 페이지를 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">강의명</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">강의일</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">등록 인원</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center text-gray-400">데이터 로딩 중...</TableCell>
                  </TableRow>
                ) : currentItems.length > 0 ? (
                  currentItems.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          {/* 💡 상세 페이지 이동 링크 추가 */}
                          <Link 
                            href={`/courses/${course.id}`} 
                            className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {course.title}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                        {course.endDate ? new Date(course.endDate).toLocaleDateString('ko-KR') : "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-white">{course._count.enrollments}</span>명
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center text-gray-400">검색 결과가 없습니다.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between px-2 py-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          전체 {filteredCourses.length}개 중 {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCourses.length)} 표시
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-200 rounded-md disabled:opacity-30 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 transition-colors"
          >
            이전
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            const isActive = currentPage === pageNum;

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  backgroundColor: isActive ? "#ECF3FF" : "transparent",
                  color: isActive ? "#465FFF" : "inherit",
                  borderColor: isActive ? "#ECF3FF" : ""
                }}
                className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                  !isActive ? "border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5" : "font-semibold"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-200 rounded-md disabled:opacity-30 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 transition-colors"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}