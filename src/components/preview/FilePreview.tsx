"use client";
import React from "react";
import ImagePreview from "./ImagePreview";
import PDFPreview from "./PDFPreview";
import ExcelPreview from "./ExcelPreview";

interface FilePreviewProps {
  file: File;
}

function FilePreview({ file }: FilePreviewProps) {
  if (!file) return null;

  const fileType = file.type;

  if (fileType.startsWith("image/")) {
    return <ImagePreview file={file} />;
  } else if (fileType === "application/pdf") {
    return <PDFPreview file={file} />;
  } else if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    fileType === "application/vnd.ms-excel"
  ) {
    return <ExcelPreview file={file} />;
  } else {
    return <p>File type not supported for preview.</p>;
  }
}

export default FilePreview;
