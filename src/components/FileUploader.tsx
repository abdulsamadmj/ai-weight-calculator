// src/components/FileUploader.tsx
"use client";
import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { PlaceholdersAndVanishInput } from "./ui/vanish-input";
import { BackgroundGradient } from "./ui/bg-gradient";
import {
  IconChevronRight,
  IconInfoCircleFilled,
  IconLoaderQuarter,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import FilePreview from "./preview/FilePreview";
import { cn } from "./ui/utils";
import { useAppData } from "@/utils/AppContext";
import { useRouter } from "next/navigation";

const FileUploader: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textVal, setTextVal] = useState<string | null>(null);
  const { appData, setAppData } = useAppData();
  const router = useRouter();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setAppData({
        ...appData,
        inputFile: acceptedFiles[0],
        processedFile: null,
      });
      setError(null);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled: !!(loading || textVal),
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
        ".xls",
      ],
      "text/csv": [".csv"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appData?.inputFile) return;

    setLoading(true);
    setError(null);
    setAppData({
      ...appData,
      processedFile: null,
    });

    const formData = new FormData();
    formData.append("file", appData.inputFile);

    try {
      const response = await axios.post("/api/calculate-weight", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const fileUrl = URL.createObjectURL(blob);
      const calcFile = new File([blob], "processed_file");
      setAppData({
        ...appData,
        processedFile: {
          file: calcFile,
          url: fileUrl,
        },
      });
      router.push("/calculated");
    } catch (error) {
      console.error("Error processing file:", error);
      setError("Failed to process the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const placeholders = [
    "CS 40S 2 inch 30 meter, weight?",
    "Type in your product details!",
    "Calculate the weight of your Steel Products",
  ];

  const textfieldChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setTextVal(val.length > 0 ? val : null);
  };

  const textfieldSubmitHandler = async () => {
    try {
      const response = await axios.get("/api/calculate-weight", {
        params: {
          message: textVal,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const fileUrl = URL.createObjectURL(blob);
      const calcFile = new File([blob], "processed_file");
      setAppData({
        ...appData,
        processedFile: {
          file: calcFile,
          url: fileUrl,
        },
      });
      router.push("/calculated");
    } catch (error) {
      console.error("Error processing file:", error);
      setError("Failed to process the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-5">
      <PlaceholdersAndVanishInput
        placeholders={
          appData?.inputFile
            ? ["Remove file to use the textfield"]
            : placeholders
        }
        loading={loading}
        disabled={!!appData?.inputFile}
        onChange={textfieldChangeHandler}
        onSubmit={textfieldSubmitHandler}
      />
      <div className="p-5 pb-0 text-xl text-center">OR</div>
      <Link
        href={"/sample-data"}
        className="w-full flex gap-1 justify-end pr-2 pb-2"
      >
        Sample Data <IconInfoCircleFilled />
      </Link>
      <form onSubmit={handleSubmit} className="space-y-4">
        <BackgroundGradient className="rounded-[20px] max-w-md w-full bg-white dark:bg-zinc-900">
          {appData?.inputFile ? (
            <FilePreview file={appData.inputFile} />
          ) : (
            <div
              {...getRootProps({ className: "dropzone" })}
              className="relative flex items-center justify-center w-full rounded-3xl"
            >
              <input {...getInputProps()} />
              <label
                htmlFor="file-upload"
                className={cn(
                  "flex flex-col items-center justify-center w-full h-64 rounded-[20px] cursor-pointer bg-transparent",
                  loading && "cursor-wait",
                  textVal && "cursor-not-allowed"
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Excel, PDF, or Image file
                  </p>

                  <p className="text-xs text-red-500 h-2">
                    {textVal && "Clear Textfield to use File Upload"}
                  </p>
                </div>
              </label>
            </div>
          )}
        </BackgroundGradient>
        <div className="w-full flex flex-col justify-between mt-4 items-center px-4 gap-4">
          <div className="w-full h-10">
            {appData?.inputFile ? (
              <div className="flex truncate gap-2 w-full px-4 py-2 items-center justify-between bg-[#ff8b31] bg-opacity-20 rounded-[20px]">
                <p className="truncate">{appData?.inputFile?.name}</p>
                <button
                  title="Remove File"
                  className={loading ? "cursor-not-allowed" : ""}
                  disabled={loading}
                  onClick={() =>
                    setAppData({
                      ...appData,
                      inputFile: null,
                    })
                  }
                >
                  <IconX />
                </button>
              </div>
            ) : (
              <div className="flex truncate gap-2 w-full px-4 py-2 items-center">
                No Files Selected
              </div>
            )}
          </div>
          <button
            title={
              !appData?.inputFile
                ? "Select a File to Continue"
                : loading
                ? "Loading"
                : "Click to Continue"
            }
            type="submit"
            disabled={!appData?.inputFile || loading}
            className={`w-full flex justify-center pl-4 pr-2 py-2 text-black dark:text-white rounded-[20px] hover:cursor-pointer ${
              !appData?.inputFile
                ? "bg-gray-500 dark:bg-zinc-900  disabled:cursor-not-allowed"
                : loading
                ? "bg-gray-500 dark:bg-zinc-900 disabled:cursor-wait"
                : "bg-[#ff8b31] hover:bg-[#ff8a31b3]"
            }`}
          >
            {loading ? (
              <div className="flex gap-1">
                Processing
                <IconLoaderQuarter className="animate-spin" />
              </div>
            ) : (
              <div className="flex gap-1">
                Submit
                <IconChevronRight />
              </div>
            )}
          </button>
        </div>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default FileUploader;
