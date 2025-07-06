'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getPrintById, PrintData, updatePrintCategory, getAllCategories, Category } from '@/lib/storage';
import Modal from '@/components/Modal';
import CategoryEditor from '@/components/CategoryEditor';
import { usePrints } from '@/hooks/usePrints'; // To refresh categories after update

// M3 Icon components
const ArrowBackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5zM12 14l-8 4 8 4 8-4-8-4z"/></svg>;

interface PrintDetailPageProps {
  params: { id: string };
}

export default function PrintDetailPage({ params }: PrintDetailPageProps) {
  const router = useRouter();
  const { id } = params;
  const [print, setPrint] = useState<PrintData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const { refreshPrints } = usePrints(null); // To refresh categories after update

  useEffect(() => {
    async function fetchPrint() {
      try {
        const fetchedPrint = await getPrintById(id);
        if (fetchedPrint) {
          setPrint(fetchedPrint);
        } else {
          setError('Print not found.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const categories = await getAllCategories();
        setAllCategories(categories);
      } catch (err: any) {
        console.error('Failed to fetch categories:', err);
      }
    }

    fetchPrint();
    fetchCategories();
  }, [id]);

  const handleDownload = () => {
    if (print?.url) {
      window.open(print.url, '_blank');
    }
  };

  const handleCategoryChange = async (newCategoryName: string | null) => {
    if (print) {
      try {
        await updatePrintCategory(print.id, newCategoryName);
        setPrint(prev => prev ? { ...prev, category_name: newCategoryName } : null);
        refreshPrints(); // Refresh prints in the home page
        setShowCategoryEditor(false);
      } catch (err: any) {
        alert(`Failed to update category: ${err.message}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message-container">
          <p className="error-message">エラー: {error}</p>
          <button onClick={() => router.back()} className="button-primary">戻る</button>
        </div>
      </div>
    );
  }

  if (!print) {
    return (
      <div className="page-container">
        <div className="error-message-container">
          <p className="error-message">プリントが見つかりませんでした。</p>
          <button onClick={() => router.back()} className="button-primary">戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container print-detail-page">
      <header className="detail-header">
        <button onClick={() => router.back()} className="icon-button">
          <ArrowBackIcon />
        </button>
        <h1 className="detail-title">{print.filename}</h1>
        <button onClick={handleDownload} className="icon-button">
          <DownloadIcon />
        </button>
      </header>

      <main className="detail-content">
        <div className="detail-image-container">
          <Image
            src={print.url}
            alt={print.filename}
            layout="fill"
            objectFit="contain"
            className="detail-image"
          />
        </div>

        <div className="detail-info">
          <p className="detail-info-item">
            <strong>アップロード日:</strong> {new Date(print.uploaded_at).toLocaleDateString()}
          </p>
          {print.family_member && (
            <p className="detail-info-item">
              <strong>家族メンバー:</strong> {print.family_member}
            </p>
          )}
          <div className="detail-info-item category-section">
            <strong>カテゴリ:</strong> {print.category_name || '未分類'}
            <button onClick={() => setShowCategoryEditor(true)} className="button-secondary category-edit-button">
              <CategoryIcon /> カテゴリ変更
            </button>
          </div>
        </div>
      </main>

      <Modal isOpen={showCategoryEditor} onClose={() => setShowCategoryEditor(false)} title="カテゴリ変更">
        <CategoryEditor
          onClose={() => setShowCategoryEditor(false)}
          existingCategories={allCategories}
          onCategoryUpdated={handleCategoryChange} // Use handleCategoryChange for updating print's category
          isForSinglePrint={true} // Indicate that this is for a single print
          currentPrintCategory={print.category_name}
        />
      </Modal>
    </div>
  );
}
