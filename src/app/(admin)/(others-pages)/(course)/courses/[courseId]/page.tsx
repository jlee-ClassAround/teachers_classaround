'use client';

import React, { useEffect, useState, use } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb"; // 이전에 만든 것
import CourseStudentTable from "./components/CourseStudentTable";


export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params); 
  const courseId = resolvedParams.courseId; //

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      const res = await fetch(`/api/courses/${courseId}`); //
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
        <h3 className="text-lg font-bold mb-6">수강생 현황</h3>
        {/* 💡 위에서 만든 테이블 호출 */}
        <CourseStudentTable users={data?.enrolledUsers || []} />
      </div>
    </div>
  );
}