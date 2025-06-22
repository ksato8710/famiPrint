'use client';

import { useState } from 'react';
import UploadForm from '@/components/UploadForm';
import MasonryGrid from '@/components/MasonryGrid';
import DetailModal from '@/components/DetailModal';
import { usePrints } from '@/hooks/usePrints';
import { PrintData } from '@/lib/storage';

export default function Home() {
  const { prints, isLoading, updateCategory, refreshPrints } = usePrints();
  const [selectedPrint, setSelectedPrint] = useState<PrintData | null>(null);

  const handleUploaded = async (urls: string[]) => {
    // Mock upload implementation - in production this would use real file objects
    console.log('Uploaded URLs:', urls);
    
    // Reload prints to get the latest data
    refreshPrints();
  };

  const handlePrintClick = (print: PrintData) => {
    setSelectedPrint(print);
  };

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">FamiPrint</h1>
          <p className="text-gray-600">
            家族写真のプリント管理アプリ
          </p>
        </header>

        <section className="mb-8">
          <UploadForm onUploaded={handleUploaded} />
        </section>

        <section>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">読み込み中...</p>
            </div>
          ) : (
            <MasonryGrid prints={prints} onPrintClick={handlePrintClick} />
          )}
        </section>

        <DetailModal 
          print={selectedPrint} 
          onClose={() => setSelectedPrint(null)}
          onCategoryUpdate={updateCategory}
        />
      </div>
    </main>
  );
}