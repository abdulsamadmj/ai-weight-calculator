"use client";
import ExcelPreview from "@/components/preview/ExcelPreview";
import { BackgroundGradient } from "@/components/ui/bg-gradient";
import { useAppData } from "@/utils/AppContext";
import {
  IconChevronRight,
  IconDownload,
  IconLink,
  IconReload,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function CalculatedPage() {
  const { appData } = useAppData();
  const router = useRouter();

  React.useEffect(() => {
    if(!appData?.processedFile)
      router.replace('/')
  }, [appData?.processedFile, router])

  return appData?.processedFile ? (
    <main className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center flex justify-center">
        <p>Weight Calculated Result</p>
      </h1>
      <div className="max-w-md mx-auto mt-5">
        <BackgroundGradient className="relative rounded-[20px] max-w-md w-full bg-white dark:bg-zinc-900 flex justify-center items-center h-64">
          <ExcelPreview file={appData.processedFile.file} />
        </BackgroundGradient>
        <div className="flex flex-col items-center px-2">
          <div className="w-full grid grid-cols-2 gap-4 mt-4">
            <a
              href={appData.processedFile.url}
              download="processed_file"
              className="col-span-1 hover:cursor-pointer flex justify-center gap-1 w-full pl-4 pr-3 py-2 text-black dark:text-white rounded-[20px] bg-green-500 hover:bg-green-600"
            >
              Download
              <IconDownload />
            </a>
            <Link
              href="/"
              className="col-span-1 flex justify-center gap-1 w-full pl-4 pr-3 py-2 text-black dark:text-white rounded-[20px] bg-[#ff8b31] hover:bg-[#ff8a31b3]"
            >
              Retry
              <IconReload />
            </Link>
            <button className="col-span-2 flex justify-center gap-1 w-full pl-4 pr-3 py-2 text-black dark:text-white rounded-[20px] bg-blue-500 hover:bg-blue-600">
              Get Quotation
              <IconChevronRight />
            </button>
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
          <button className="flex justify-center gap-1 w-fit pl-4 pr-3 py-2 mt-2 text-black dark:text-white rounded-[20px] bg-blue-500 hover:bg-blue-600 backdrop-filter backdrop-blur-sm bg-opacity-30">
            Copy Result URL
            <IconLink />
          </button>
        </div>
      </div>
    </main>
  ) : (
    <div>Loading..</div>
  );
}

export default CalculatedPage;
