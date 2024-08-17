"use client";
import dynamic from "next/dynamic";
import React from "react";
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

interface PDFPreviewProps {
  file: File;
}

function PDFPreview({ file }: PDFPreviewProps) {
  const fileUrl = URL.createObjectURL(file);

  return (
    <div className="w-full h-64 flex justify-center items-center">
      <embed className="w-full h-full rounded-[20px]" type="application/pdf" src={fileUrl} />
    </div>
  );
}

export default PDFPreview;
