'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { uploadMultiplePrints } from '@/lib/storage';
import { usePrints } from '@/hooks/usePrints';

// M3 Icon components (placeholders)
const ArrowBackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>;
const UploadFileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#6750A4"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>;

export default function UploadPage() {
  const router = useRouter();
  const { categories } = usePrints(null);

  const [isUploading, setIsUploading] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const familyMembers = ['かえで', 'しおり', 'あん', 'ママ', 'パパ'];
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState('');

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      setFilesToUpload(Array.from(files));
    }
  };

  const handleUpload = async () => {
    if (filesToUpload.length === 0) { alert('ファイルを選択してください。'); return; }
    if (!selectedFamilyMember) { alert('家族のメンバーを選択してください。'); return; }
    const categoryToUpload = newCategory.trim() || selectedCategory;
    if (!categoryToUpload) { alert('カテゴリを選択または入力してください。'); return; }

    setIsUploading(true);
    try {
      await uploadMultiplePrints(filesToUpload, selectedFamilyMember, categoryToUpload);
      alert('アップロードが完了しました。');
      router.push('/');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('アップロードに失敗しました。');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="page-background">
      {/* Top App Bar */}
      <header className="top-app-bar">
        <div className="app-bar-content">
          <Link href="/" className="icon-button">
            <ArrowBackIcon />
          </Link>
          <h1 className="app-bar-title">新しいプリントを追加</h1>
        </div>
      </header>

      <main className="main-content-area">
        <div className="card-container">
          {/* Step 1: Family Member */}
          <section className="section-spacing">
            <h2 className="section-title">1. だれのもの？</h2>
            <div className="flex-chips-container">
              {familyMembers.map(member => (
                <button
                  key={member}
                  onClick={() => setSelectedFamilyMember(member)}
                  className={`chip-base ${selectedFamilyMember === member ? 'chip-selected' : 'chip-unselected'}`}
                >
                  {member}
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: Category */}
          <section className="section-spacing">
            <h2 className="section-title">2. どんな種類？</h2>
            <div className="grid-form-elements">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); if (e.target.value) setNewCategory(''); }}
                disabled={isUploading || !!newCategory}
                className="form-input"
              >
                <option value="">既存のカテゴリ...</option>
                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
              <input
                type="text"
                placeholder="または新しいカテゴリ..."
                value={newCategory}
                onChange={(e) => { setNewCategory(e.target.value); if (e.target.value) setSelectedCategory(''); }}
                disabled={isUploading}
                className="form-input"
              />
            </div>
          </section>

          {/* Step 3: File Select */}
          <section className="section-spacing-large">
            <h2 className="section-title">3. ファイルを選ぶ</h2>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={(e) => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files); }}
              className={`drag-drop-area ${dragOver ? 'drag-over' : ''}`}
            >
              <input ref={fileInputRef} type="file" multiple accept="image/*,application/pdf" className="hidden-input" onChange={(e) => handleFileChange(e.target.files)} />
              <div className="drag-drop-text-container">
                <UploadFileIcon />
                <p className="margin-top-small">ファイルをドラッグ＆ドロップ</p>
                <p className="text-small">またはクリックして選択</p>
              </div>
            </div>
            {filesToUpload.length > 0 && (
              <div className="file-list-container">
                <p>{filesToUpload.length}個のファイルを選択中:</p>
                <ul className="file-list">
                  {filesToUpload.map(f => <li key={f.name}>{f.name}</li>)}
                </ul>
              </div>
            )}
          </section>

          {/* Upload Button */}
          <div className="text-align-center">
            <button
              onClick={handleUpload}
              disabled={isUploading || filesToUpload.length === 0 || !selectedFamilyMember || (!selectedCategory && !newCategory)}
              className="primary-button"
            >
              {isUploading ? (
                <><div className="spinner"></div><span>アップロード中...</span></>
              ) : (
                <span>アップロードする</span>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}