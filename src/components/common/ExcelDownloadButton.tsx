'use client';

import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import Button from '../ui/button/Button'; 
import * as XLSX from 'xlsx';
import { toast } from 'sonner';


interface ExcelColumn {
  header: string;      
  key: string;         

  transform?: (value: any, item: any) => string | number; 
}

interface ExcelDownloadButtonProps {
  data: any[];
  columns: ExcelColumn[]; 
  fileName?: string;
  sheetName?: string;
}

export default function ExcelDownloadButton({ 
  data, 
  columns,
  fileName = "export-data", 
  sheetName = "Sheet1" 
}: ExcelDownloadButtonProps) {
  
  const handleDownload = () => {
    if (!data || data.length === 0) {
      toast.error("다운로드할 데이터가 없습니다.");
      return;
    }

    try {
      
      const formattedData = data.map((item) => {
        const row: Record<string, any> = {};
        
        columns.forEach((col) => {
          const rawValue = item[col.key];

          row[col.header] = col.transform 
            ? col.transform(rawValue, item) 
            : (rawValue ?? "-");
        });
        
        return row;
      });


      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);


      const maxWidths = Object.keys(formattedData[0]).map((key) => ({
        wch: Math.max(
          key.length * 2, 
          ...formattedData.map((row: any) => row[key]?.toString().length || 0)
        ) + 5,
      }));
      worksheet["!cols"] = maxWidths;

      const dateStr = new Date().toISOString().split('T')[0];
      const finalFileName = `${fileName}_${dateStr}.xlsx`;
      XLSX.writeFile(workbook, finalFileName);
      
      toast.success("엑셀 파일이 성공적으로 다운로드되었습니다.");
    } catch (error) {
      console.error("Excel download error:", error);
      toast.error("다운로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"

      className="flex items-center gap-2 border-[#465FFF] text-[#465FFF] font-medium transition-all hover:!bg-[#465FFF]/10 hover:!text-[#465FFF] hover:!border-[#465FFF]"
    >
      <FileSpreadsheet className="size-4" />
      <span>엑셀 다운로드</span>
    </Button>
  );
}