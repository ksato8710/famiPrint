'use client';

import { useState } from 'react';
import UploadForm from '@/components/UploadForm';
import MasonryGrid from '@/components/MasonryGrid';
import DetailModal from '@/components/DetailModal';
import CategoryEditor from '@/components/CategoryEditor'; // Import CategoryEditor
import { usePrints } from '@/hooks/usePrints';
import { PrintData } from '@/lib/storage';

export default function Home() {
  const { prints, isLoading, updateCategory, refreshPrints, categories } = usePrints();
  const [selectedPrint, setSelectedPrint] = useState<PrintData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);

  const handleUploaded = async (urls: string[]) => {
    console.log('Successfully uploaded:', urls.length, 'files');
    
    // Reload prints to get the latest data
    refreshPrints();
  };

  const handlePrintClick = (print: PrintData) => {
    setSelectedPrint(print);
  };

  const filteredPrints = selectedCategory
    ? prints.filter(print => print.category === selectedCategory)
    : prints;

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

        <section className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium 
                ${selectedCategory === null ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
              `}
            >
              すべて
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium 
                  ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                `}
              >
                {category}
              </button>
            ))}
            <button
              onClick={() => setShowCategoryEditor(true)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-green-500 text-white hover:bg-green-600"
            >
              カテゴリ管理
            </button>
          </div>
        </section>

        <section>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">読み込み中...</p>
            </div>
          ) : (
            <MasonryGrid prints={filteredPrints} onPrintClick={handlePrintClick} />
          )}
        </section>

        <DetailModal 
          print={selectedPrint} 
          onClose={() => setSelectedPrint(null)}
          onCategoryUpdate={updateCategory}
        />

        {showCategoryEditor && (
          <CategoryEditor 
            onClose={() => setShowCategoryEditor(false)}
            existingCategories={categories}
            onCategoryUpdated={refreshPrints} // Refresh prints after category changes
          />
        )}
      </div>
    </main>
  );
}