'use client';


import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { useState } from "react";
import CourseTable from "./components/table";
import ComponentCard from "./components/ComponentCard";



export default function BasicTables() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageBreadcrumb pageTitle="강의 목록" />
      <div className="space-y-6">
        <ComponentCard 
          showSearch={true} 
          onSearch={(v) => setSearchTerm(v)}
        >
          <CourseTable searchTerm={searchTerm}/>
        </ComponentCard>
      </div>
    </div>
  );
}
