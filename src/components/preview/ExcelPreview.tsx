"use client";
import { frontHelperFunctions } from "@/utils/HelpersFrontEnd";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { PreviewProps } from "./ImagePreview";

function ExcelPreview({ file, fileUrl }: PreviewProps) {
  const [sheetData, setSheetData] = useState<string[][]>([]);

  useEffect(() => {
    if (fileUrl) {
      fetch("/sample-sheets.csv")
        .then((response) => response.text())
        .then((csvText) => {
          const workbook = XLSX.read(csvText, { type: "string" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          setSheetData(jsonData as string[][]);
        });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        setSheetData(jsonData as string[][]);
      };
      reader.readAsArrayBuffer(file!);
    }
  }, [file, fileUrl]);

  return (
    <div className="w-full h-64 flex justify-start items-start overflow-scroll scrollbar-thin rounded-[20px]">
      {sheetData.length > 0 && frontHelperFunctions.renderSheetData(sheetData)}
    </div>
  );
}

export default ExcelPreview;
