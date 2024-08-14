// src/app/page.tsx
import FileUploader from "@/components/FileUploader";
import {
  IconAlertTriangleFilled,
  IconHelpCircleFilled,
} from "@tabler/icons-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 flex justify-center">
        <p>
          AI Steel Equipment Weight Calculator (Beta
          <Link className="inline" href={""}>
            <IconHelpCircleFilled className="inline h-10 w-10 text-[#FF8B31]" />
          </Link>
          )
        </p>
      </h1>
      <FileUploader />
    </main>
  );
}
