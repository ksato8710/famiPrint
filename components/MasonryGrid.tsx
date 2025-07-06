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
        setColumns(2); // 2 columns for small screens
      } else if (width < 1024) {
        setColumns(3);
      } else if (width < 1280) {
        setColumns(4);
      } else {
        setColumns(5);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createColumns = () => {
    const cols: PrintData[][] = Array.from({ length: columns }, () => []);
    prints.forEach((print, index) => {
      cols[index % columns].push(print);
    });
    return cols;
  };

  if (prints.length === 0) {
    return (
      <div className="no-prints-message-container">
        <div className="no-prints-message-icon">📂</div>
        <h3 className="no-prints-message-title">
          プリントがありません
        </h3>
        <p className="no-prints-message-text">
          右下の「+」ボタンから追加してください。
        </p>
      </div>
    );
  }

  const columnGroups = createColumns();

  return (
    <div className="masonry-grid-container" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {columnGroups.map((column, columnIndex) => (
        <div key={columnIndex} className="masonry-column">
          {column.map((print) => (
            <div
              key={print.id}
              className="masonry-item"
              onClick={() => {
                console.log('Masonry item clicked:', print.id);
                onPrintClick(print);
              }}
            >
              <Image
                src={print.url}
                alt={print.filename}
                width={500} // Increased base width for better quality
                height={700} // Adjusted height based on common aspect ratio
                className="masonry-image"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                priority={true} // Prioritize loading images in the viewport
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
