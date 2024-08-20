import ExcelPreview from "@/components/preview/ExcelPreview";
import ImagePreview from "@/components/preview/ImagePreview";
import PDFPreview from "@/components/preview/PDFPreview";

export default function SampleDataPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 flex justify-center">
        Sample Data Files
      </h1>
      <div className="max-w-md mx-auto mt-8">
        <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
          <ImagePreview fileUrl="/sample-image.png" />
          <ExcelPreview fileUrl="/sample-sheets.csv" />
          <PDFPreview fileUrl="/sample-pdf.pdf" />
        </div>
      </div>
    </main>
  );
}
