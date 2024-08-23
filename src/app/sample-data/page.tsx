"use client";
import ExcelPreview from "@/components/preview/ExcelPreview";
import ImagePreview from "@/components/preview/ImagePreview";
import PDFPreview from "@/components/preview/PDFPreview";
import { BackgroundGradient } from "@/components/ui/bg-gradient";
import { IconDownload } from "@tabler/icons-react";

export default function SampleDataPage() {
  return (
    <main className="container mx-auto overflow-x-hidden scrollbar-thin pb-14 px-2">
      <h1 className="text-3xl font-bold text-center mb-3 flex justify-center">
        Sample Data Files: AI Weight Calculator
      </h1>
      <div className="w-full flex justify-center">
        <div className="max-w-screen-lg w-full flex flex-col">
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <h6 className="text-xl px-2">Image</h6>
              <BackgroundGradient className="relative rounded-[20px] w-full bg-white dark:bg-zinc-900 flex justify-center items-center h-64">
                <ImagePreview fileUrl="/sample-image.png" />
              </BackgroundGradient>
              <a
                href="/sample-image.png"
                download="sample_image"
                className="col-span-1 hover:cursor-pointer flex justify-center gap-1 w-full pl-4 pr-3 py-2 text-black dark:text-white rounded-[20px] bg-green-500 hover:bg-green-600 mt-2"
              >
                Download
                <IconDownload />
              </a>
            </div>
            <div>
              <h6 className="text-xl px-2">CSV/ Sheets</h6>
              <BackgroundGradient className="relative rounded-[20px] w-full bg-white dark:bg-zinc-900 flex justify-center items-center h-64">
                <ExcelPreview fileUrl="/sample-sheets.csv" />
              </BackgroundGradient>
              <a
                href="/sample-sheets.csv"
                download="sample_sheets"
                className="col-span-1 hover:cursor-pointer flex justify-center gap-1 w-full pl-4 pr-3 py-2 text-black dark:text-white rounded-[20px] bg-green-500 hover:bg-green-600 mt-2"
              >
                Download
                <IconDownload />
              </a>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <h6 className="text-xl px-2">PDF</h6>
            <BackgroundGradient className="relative rounded-[20px] w-full bg-white dark:bg-zinc-900 flex justify-center items-center h-64">
              <PDFPreview fileUrl="/sample-pdf.pdf" />
            </BackgroundGradient>
            <a
              href="/sample-pdf.pdf"
              download="sample_pdf"
              className="col-span-1 hover:cursor-pointer flex justify-center gap-1 w-full pl-4 pr-3 py-2 text-black dark:text-white rounded-[20px] bg-green-500 hover:bg-green-600 mt-2"
            >
              Download
              <IconDownload />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
