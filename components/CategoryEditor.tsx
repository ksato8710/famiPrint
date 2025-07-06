'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Category } from '@/lib/storage'; // Import Category type
import { useNotification } from './Notification';
import ConfirmModal from './ConfirmModal';

// M3 Icons
const EditIcon = () => <svg className="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const DeleteIcon = () => <svg className="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const SaveIcon = () => <svg className="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>;
const CancelIcon = () => <svg className="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>;

interface CategoryEditorProps {
  onClose: () => void;
  existingCategories: Category[];
  onCategoryUpdated: (categoryName: string | null) => Promise<void> | void; // Changed to accept categoryName and allow Promise<void>
  isForSinglePrint?: boolean; // New prop
  currentPrintCategory?: string | null; // New prop
}

export default function CategoryEditor({ onClose, existingCategories, onCategoryUpdated, isForSinglePrint = false, currentPrintCategory }: CategoryEditorProps) {
  const { showNotification } = useNotification();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [selectedCategoryForPrint, setSelectedCategoryForPrint] = useState<string | null>(currentPrintCategory || null);

  const performDeleteCategory = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);
      if (error) throw error;
      showNotification(`カテゴリ「${category.name}」を削除しました。`, 'success');
      // onCategoryUpdated && onCategoryUpdated(); // 親コンポーネントに更新を通知
    } catch (error: any) {
      showNotification(`カテゴリの削除に失敗しました: ${error.message}`, 'error');
    }
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '') {
      showNotification("カテゴリ名を入力してください。", 'error');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategoryName.trim() }])
        .select();
      if (error) throw error;
      showNotification(`カテゴリ「${newCategoryName}」を追加しました。`, 'success');
      setNewCategoryName('');
      // onCategoryUpdated && onCategoryUpdated(); // 親コンポーネントに更新を通知
    } catch (error: any) {
      console.error('Failed to add category:', error); // デバッグ用ログ
      showNotification(`カテゴリの追加に失敗しました: ${error.message}`, 'error');
    }
  };

  const handleEditCategory = async (category: Category) => {
    const newName = editedCategoryName.trim();
    if (newName === '') {
      showNotification("カテゴリ名を入力してください。", 'error');
      return;
    }
    try {
      const { error } = await supabase
        .from('categories')
        .update({ name: newName })
        .eq('id', category.id);
      if (error) throw error;
      showNotification(`カテゴリを更新しました。`, 'success');
      setEditingCategory(null);
      // onCategoryUpdated && onCategoryUpdated(); // 親コンポーネントに更新を通知 (handled by refreshPrints in parent)
    } catch (error: any) {
      showNotification(`カテゴリの更新に失敗しました: ${error.message}`, 'error');
    }
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setShowConfirmModal(true);
  };

  const handleSaveForPrint = () => {
    onCategoryUpdated(selectedCategoryForPrint);
    onClose();
  };

  return (
    <div className="category-editor-content" onClick={(e) => e.stopPropagation()}>
      <h2 className="category-editor-title">{isForSinglePrint ? "カテゴリ変更" : "カテゴリ管理"}</h2>

      {isForSinglePrint ? (
        <div className="category-editor-section">
          <h3 className="category-editor-subtitle">カテゴリを選択</h3>
          <select
            value={selectedCategoryForPrint || ''}
            onChange={(e) => setSelectedCategoryForPrint(e.target.value || null)}
            className="category-editor-select"
          >
            <option value="">未分類</option>
            {existingCategories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="category-editor-footer">
            <button onClick={handleSaveForPrint} className="category-editor-save-button">保存</button>
            <button onClick={onClose} className="category-editor-close-button">キャンセル</button>
          </div>
        </div>
      ) : (
        <>
          <div className="category-editor-section">
            <h3 className="category-editor-subtitle">新しいカテゴリを追加</h3>
            <div className="category-editor-input-group">
              <input type="text" placeholder="新しいカテゴリ名" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="category-editor-input" />
              <button onClick={handleAddCategory} className="category-editor-add-button">追加</button>
            </div>
          </div>

          <div className="category-editor-section">
            <h3 className="category-editor-subtitle">既存カテゴリ</h3>
            {existingCategories && existingCategories.length === 0 ? (
              <p className="category-editor-no-category-message">まだカテゴリがありません。</p>
            ) : (
              <ul className="category-editor-category-list">
                {existingCategories && existingCategories.map((category) => (
                  <li key={category.id} className="category-editor-category-item">
                    {editingCategory?.id === category.id ? (
                      <input type="text" value={editedCategoryName} onChange={(e) => setEditedCategoryName(e.target.value)} className="category-editor-edit-input" autoFocus />
                    ) : (
                      <span className="category-editor-category-name">{category.name}</span>
                    )}
                    <div className="category-editor-actions">
                      {editingCategory?.id === category.id ? (
                        <>
                          <button onClick={() => handleEditCategory(category)} className="category-editor-action-button primary"><SaveIcon /></button>
                          <button onClick={() => setEditingCategory(null)} className="category-editor-action-button"><CancelIcon /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingCategory(category); setEditedCategoryName(category.name); }} className="category-editor-action-button"><EditIcon /></button>
                          <button onClick={() => handleDeleteCategory(category)} className="category-editor-action-button error"><DeleteIcon /></button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="category-editor-footer">
            <button onClick={onClose} className="category-editor-close-button">閉じる</button>
          </div>
        </>
      )}

      {categoryToDelete && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          message={`カテゴリ「${categoryToDelete.name}」を削除しますか？関連するプリントのカテゴリは解除されます。`}
          onConfirm={() => {
            performDeleteCategory(categoryToDelete);
            setCategoryToDelete(null);
          }}
          onCancel={() => setCategoryToDelete(null)}
        />
      )}
    </div>
  );
}