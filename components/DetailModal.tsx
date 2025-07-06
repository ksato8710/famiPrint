'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PrintData } from '@/lib/storage';
import CategoryEditor from './CategoryEditor';

// M3 Icons
const CloseIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const DownloadIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>;

interface DetailModalProps {
  print: PrintData | null;
  onClose: () => void;
  onCategoryUpdate?: (printId: string, categoryName: string | null) => Promise<boolean>;
}

export default function DetailModal({ print, onClose, onCategoryUpdate }: DetailModalProps) {
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (print) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [print, onClose]);

  if (!print) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = print.url;
    link.download = print.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCategorySave = async (categoryName: string | null) => {
    if (print && onCategoryUpdate) {
      return await onCategoryUpdate(print.id, categoryName);
    }
    return false;
  };

  const formatDate = (dateString: string) => new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-surface-container-high rounded-3xl max-w-4xl max-h-[90vh] w-full overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center p-4 text-on-surface-container">
          <div className="flex-1">
            <h2 className="text-xl font-semibold truncate">{print.filename}</h2>
            <p className="text-sm text-on-surface-variant">{formatDate(print.uploaded_at)}</p>
          </div>
          <button onClick={onClose} className="ml-4 p-2 rounded-full hover:bg-on-surface/10 transition-colors" aria-label="閉じる">
            <CloseIcon />
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 flex items-center justify-center p-4 bg-surface-container-lowest overflow-auto">
          <Image src={print.url} alt={print.filename} width={1000} height={1400} className="max-w-full max-h-full object-contain shadow-lg rounded-lg" />
        </div>

        {/* Footer & Actions */}
        <div className="p-4 border-t border-outline/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-on-surface-variant">
              {print.category_name ? (
                <button onClick={() => setShowCategoryEditor(true)} className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity text-sm font-medium">
                  {print.category_name}
                </button>
              ) : (
                <button onClick={() => setShowCategoryEditor(true)} className="bg-surface-variant text-on-surface-variant px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity text-sm font-medium">
                  + カテゴリ設定
                </button>
              )}
            </div>
            <button onClick={handleDownload} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-full font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm">
              <DownloadIcon />
              <span>ダウンロード</span>
            </button>
          </div>
        </div>
      </div>

      {showCategoryEditor && (
        <CategoryEditor
          currentCategory={print.category_name}
          onSave={handleCategorySave}
          onCancel={() => setShowCategoryEditor(false)}
        />
      )}
    </div>
  );
}
