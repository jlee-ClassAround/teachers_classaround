'use client';

import React, { useEffect, useState, use } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CourseStudentTable from "./components/CourseStudentTable";
import ExcelDownloadButton from "@/components/common/ExcelDownloadButton";

const studentExcelColumns = [
  { header: "이름", key: "username" },
  { header: "이메일", key: "email" },
  { header: "연락처", key: "phone" },
  { header: "선택 옵션", key: "courseOption" },
  { 
    header: "진도율", 
    key: "progress", 
    transform: (val: number) => `${val || 0}%` 
  },
  { 
    header: "수강 종료일", 
    key: "endDate", 
    transform: (val: string) => val ? new Date(val).toLocaleDateString('ko-KR') : "-" 
  },
  { 
    header: "상태", 
    key: "isActive", 
    transform: (val: boolean) => val ? "수강중" : "만료" 
  },
];

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params); 
  const courseId = resolvedParams.courseId;

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      const res = await fetch(`/api/courses/${courseId}`);
      const result = await res.json();
      setData(result);
    };
    
    if (courseId) fetchCourseDetail();
  }, [courseId]);

  return (
    <div className="space-y-6 p-6">
      <PageBreadcrumb 
        pageTitle={data?.course?.title || "강의 상세"} 
        items={[
          { label: "강의 목록", href: "/courses" },
          { label: "강의 상세" }
        ]} 
      />

      <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 border border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">수강생 현황</h3>
          
          <ExcelDownloadButton 
            data={data?.enrolledUsers || []} 
            columns={studentExcelColumns}
            fileName={`${data?.course?.title || '강의'}_수강생_현황`}
            sheetName="수강생목록"
          />
        </div>

        {/* 수강생 테이블 */}
        <CourseStudentTable users={data?.enrolledUsers || []} />
      </div>
    </div>
  );
}