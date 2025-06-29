'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PrintData } from '@/lib/storage';
import CategoryEditor from './CategoryEditor';

interface DetailModalProps {
  print: PrintData | null;
  onClose: () => void;
  onCategoryUpdate?: (printId: string, category: string) => Promise<boolean>;
}

export default function DetailModal({ print, onClose, onCategoryUpdate }: DetailModalProps) {
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (print) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
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

  const handleCategorySave = async (category: string) => {
    if (print && onCategoryUpdate) {
      const success = await onCategoryUpdate(print.id, category);
      return success;
    }
    return false;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1">
            <h2 className="text-lg font-semibold truncate">{print.filename}</h2>
            <p className="text-sm text-gray-500">
              {formatDate(print.uploaded_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="閉じる"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 overflow-auto">
          <div className="relative max-w-full max-h-full">
            <Image
              src={print.url}
              alt={print.filename}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain shadow-lg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {print.metadata && (
                <>
                  <span>サイズ: {formatFileSize(print.metadata.size)}</span>
                  <span>タイプ: {print.metadata.type}</span>
                  {print.metadata.width > 0 && print.metadata.height > 0 && (
                    <span>
                      解像度: {print.metadata.width} × {print.metadata.height}
                    </span>
                  )}
                </>
              )}
              {print.category ? (
                <button
                  onClick={() => setShowCategoryEditor(true)}
                  className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  {print.category}
                </button>
              ) : (
                <button
                  onClick={() => setShowCategoryEditor(true)}
                  className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer text-sm"
                >
                  + カテゴリーを設定
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ダウンロード
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCategoryEditor && (
        <CategoryEditor
          currentCategory={print.category}
          onSave={handleCategorySave}
          onCancel={() => setShowCategoryEditor(false)}
        />
      )}
    </div>
  );
}