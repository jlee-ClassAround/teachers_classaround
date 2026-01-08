"use client";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "username", // 💡 name -> username
    header: "이름",
    cell: ({ row }) => {
      const avatar = row.original.avatar;
      return (
        <div className="flex items-center gap-3">
          {/* 아바타 이미지 */}
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                No
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {row.getValue("username")}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {row.original.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone", // 💡 phone 필드 추가
    header: "연락처",
    cell: ({ row }) => (
      <div className="text-gray-500 dark:text-gray-400">
        {row.getValue("phone") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "courseOption",
    header: "선택 옵션",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {row.getValue("courseOption") || "기본"}
      </span>
    ),
  },
  {
    accessorKey: "progress",
    header: "진도율",
    cell: ({ row }) => {
      const progress = parseFloat(row.getValue("progress") || "0");
      return (
        <div className="flex items-center gap-3 min-w-[120px]">
          <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
            <div 
              className="h-full bg-[#465FFF] transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-500 w-8">
            {progress}%
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: "수강 종료일",
    cell: ({ row }) => {
      const date = row.getValue("endDate");
      return (
        <div className="text-gray-500 dark:text-gray-400">
          {date ? new Date(date as string).toLocaleDateString('ko-KR') : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "상태",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive 
            ? "bg-[#ECF3FF] text-[#465FFF]" 
            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
        }`}>
          {isActive ? "수강중" : "만료"}
        </span>
      );
    },
  },
];