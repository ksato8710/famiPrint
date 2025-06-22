'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PrintData } from '@/lib/storage';

interface MasonryGridProps {
  prints: PrintData[];
  onPrintClick: (print: PrintData) => void;
}

export default function MasonryGrid({ prints, onPrintClick }: MasonryGridProps) {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(1);
      } else if (width < 1024) {
        setColumns(2);
      } else if (width < 1280) {
        setColumns(3);
      } else {
        setColumns(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createColumns = () => {
    const cols: PrintData[][] = Array.from({ length: columns }, () => []);
    
    prints.forEach((print, index) => {
      const columnIndex = index % columns;
      cols[columnIndex].push(print);
    });
    
    return cols;
  };

  if (prints.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          写真がまだありません
        </h3>
        <p className="text-gray-500">
          上のフォームから写真をアップロードしてください
        </p>
      </div>
    );
  }

  const columnGroups = createColumns();

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {columnGroups.map((column, columnIndex) => (
        <div key={columnIndex} className="space-y-4">
          {column.map((print) => (
            <div
              key={print.id}
              className="group cursor-pointer overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition-shadow"
              onClick={() => onPrintClick(print)}
            >
              <div className="relative">
                <Image
                  src={print.url}
                  alt={print.filename}
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-black bg-opacity-50 rounded px-2 py-1 text-white text-xs truncate">
                    {print.filename}
                  </div>
                </div>
              </div>
              {print.category && (
                <div className="p-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {print.category}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}