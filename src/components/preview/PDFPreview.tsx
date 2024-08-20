"use client";
import dynamic from "next/dynamic";
import React from "react";
import { PreviewProps } from "./ImagePreview";
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

function PDFPreview({ file, fileUrl }: PreviewProps) {
  const url = file ? URL.createObjectURL(file) : fileUrl;

  return (
    <div className="w-full h-64 flex justify-center items-center">
      <embed
        className="w-full h-full rounded-[20px]"
        type="application/pdf"
        src={url}
      />
    </div>
  );
}

export default PDFPreview;
