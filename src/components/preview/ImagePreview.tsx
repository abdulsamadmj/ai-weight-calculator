"use client";
import Image from "next/image";
import React from "react";

interface ImagePreviewProps {
  file: File;
}

function ImagePreview({ file }: ImagePreviewProps) {
  const [imageSrc, setImageSrc] = React.useState<string | ArrayBuffer | null>(
    null
  );

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  }, [file]);

  return (
    <div className="w-full h-64 flex justify-center items-center">
      {imageSrc && (
        <Image
          className="h-full w-full object-contain"
          src={imageSrc as string}
          alt="Preview"
          width={200}
          height={200}
        />
      )}
    </div>
  );
}

export default ImagePreview;
