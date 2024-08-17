// src/components/FileUploader.tsx
"use client";
import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { PlaceholdersAndVanishInput } from "./ui/vanish-input";
import { BackgroundGradient } from "./ui/bg-gradient";
import {
  IconChevronRight,
  IconDownload,
  IconInfoCircleFilled,
  IconLoaderQuarter,
  IconThumbUp,
  IconThumbUpFilled,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { Tooltip } from "flowbite-react";

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);
  const [textVal, setTextVal] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setProcessedFileUrl(null);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
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
    if (!file) return;

    setLoading(true);
    setError(null);
    setProcessedFileUrl(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/process-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = URL.createObjectURL(blob);
      setProcessedFileUrl(url);
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

  const textfieldSubmitHandler = () => {};

  return (
    <div className="max-w-md mx-auto mt-8">
      {processedFileUrl ? (
        <div>
          <BackgroundGradient className="relative rounded-[20px] max-w-md w-full bg-white dark:bg-zinc-900 flex justify-center items-center h-64">
            <div className="w-fit">File Preview</div>
          </BackgroundGradient>
          <div className="flex flex-col items-center px-4">
            <div className="w-full flex justify-between">
              <Link
                href={processedFileUrl ?? ""}
                download="processed_file"
                className=" flex gap-1 w-fit pl-4 pr-3 py-2 text-black dark:text-white rounded-[20px] bg-[#ff8b31] hover:bg-[#ff8a31b3] mt-4"
              >
                Download
                <IconDownload />
              </Link>
              <div className="flex gap-2">
                <button className="flex gap-1 w-fit pl-4 pr-3 py-2 text-black dark:text-white rounded-[20px] bg-[#ff8b31] hover:bg-[#ff8a31b3] mt-4">
                  Get Quotation
                  <IconChevronRight />
                </button>
              </div>
            </div>
            <div className="max-w-md w-full flex flex-col mt-4 items-start">
              <div className="rounded-[20px] p-4 px-6 flex gap-4 backdrop-filter backdrop-blur-sm bg-black bg-opacity-40 w-full">
                <button>
                  <IconThumbUpFilled className="hover:scale-110 hover:text-[#FF8B31]" />
                </button>
                <button>
                  <IconThumbUpFilled className="scale-[-1] hover:scale-[-1.1] hover:text-[#FF8B31]" />
                </button>
                <div className="flex items-center border-b border-[#FF8B31] py-2 w-full">
                  <input
                    className="appearance-none placeholder-white bg-transparent border-none w-full text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-0 "
                    type="text"
                    placeholder="Comment your feedback"
                    aria-label="Comment"
                  />
                  <button
                    className="flex-shrink-0 bg-[#FF8B31] hover:bg-transparent border-[#FF8B31] text-sm border-4 text-white hover:text-[#FF8B31] py-1 px-2 rounded"
                    type="button"
                  >
                    <IconChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {!file && (
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={textfieldChangeHandler}
              onSubmit={textfieldSubmitHandler}
            />
          )}
          {!(file || textVal) && (
            <div className="p-5 pb-0 text-xl text-center">OR</div>
          )}
          {!textVal ? (
            <>
              <Link
                href={""}
                className="w-full flex gap-1 justify-end pr-2 pb-2"
              >
                Sample Data <IconInfoCircleFilled />
              </Link>
              <form onSubmit={handleSubmit} className="space-y-4">
                <BackgroundGradient className="rounded-[20px] max-w-md w-full bg-white dark:bg-zinc-900">
                  <div
                    {...getRootProps({ className: "dropzone" })}
                    className="relative flex items-center justify-center w-full rounded-3xl"
                  >
                    <input {...getInputProps()} />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-64 rounded-[20px] cursor-pointer bg-transparent"
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
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          Excel, PDF, or Image file
                        </p>
                      </div>
                    </label>
                  </div>
                </BackgroundGradient>

                {/* {file && (
              <p className="text-sm text-gray-500">
                Selected file: {file.name}
              </p>
            )} */}
                <div className="w-full flex justify-between mt-4 items-center px-4">
                  <div className="">
                    {file ? (
                      <div className="flex  gap-2 w-fit px-4 py-2 items-center bg-[#ff8b31] bg-opacity-20 rounded-[20px] ">
                        <p>{file?.name}</p>
                        <button onClick={() => setFile(null)}>
                          <IconX />
                        </button>
                      </div>
                    ) : (
                      <p>No Files Selected</p>
                    )}
                  </div>
                  <Tooltip
                    className="dark:bg-white bg-black text-white dark:text-black px-2"
                    arrow={false}
                    content={
                      !file ? "Select a File to Continue" : "Click to Continue"
                    }
                    placement="bottom"
                  >
                    <button
                      type="submit"
                      disabled={!file || loading}
                      className={`w-fit pl-4 pr-2 py-2 text-black dark:text-white rounded-[20px] hover:cursor-pointer ${
                        !file
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
                          Process
                          <IconChevronRight />
                        </div>
                      )}
                    </button>
                  </Tooltip>
                </div>
              </form>
            </>
          ) : null}
        </>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default FileUploader;
