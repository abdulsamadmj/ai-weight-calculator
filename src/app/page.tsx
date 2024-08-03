// src/app/page.tsx
import FileUploader from '@/components/FileUploader';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Steel Equipment Weight Calculator</h1>
      <FileUploader />
    </main>
  );
}