"use client";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

interface ExcelPreviewProps {
  file: File;
}

function ExcelPreview({ file }: ExcelPreviewProps) {
  const [sheetData, setSheetData] = useState<string[][]>([]);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      setSheetData(jsonData as string[][]);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return (
    <div className="w-full h-64 flex justify-start items-start overflow-scroll scrollbar-thin rounded-[20px]">
      {sheetData.length > 0 && (
        <table className="border-separate border border-slate-500 rounded-[20px]">
          <thead>
            <tr>
              {sheetData[0].map((col, index) => (
                <th key={index} className="border border-slate-600">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheetData.slice(1).map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-slate-700">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ExcelPreview;
