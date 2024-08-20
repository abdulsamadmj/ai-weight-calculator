"use client";
import Image from "next/image";
import React from "react";

export type PreviewProps =
  | {
      file: File;
      fileUrl?: string;
    }
  | {
      fileUrl: string;
      file?: File;
    };

function ImagePreview({ file, fileUrl }: PreviewProps) {
  const [imageSrc, setImageSrc] = React.useState<string | ArrayBuffer | null>(
    fileUrl ?? null
  );

  React.useEffect(() => {
    if (fileUrl) {
      setImageSrc(fileUrl);
    } else {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file!);
    }
  }, [file, fileUrl]);

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
