'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CategoryEditorProps {
  onClose: () => void;
  existingCategories: string[];
  onCategoryUpdated: () => void; // Callback to refresh prints after category changes
}

export default function CategoryEditor({
  onClose,
  existingCategories,
  onCategoryUpdated,
}: CategoryEditorProps) {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');

  const handleAddCategory = async () => {
    if (newCategory.trim() === '') return;
    if (existingCategories.includes(newCategory.trim())) {
      alert('そのカテゴリは既に存在します。');
      return;
    }

    // カテゴリを直接DBに保存する機能はないため、ここではUI上の操作のみ
    // 実際には、カテゴリを管理するテーブルや、プリントのカテゴリを更新するAPIが必要
    // 今回は、既存のプリントのカテゴリを更新することでカテゴリを「作成」したとみなす
    alert(`カテゴリ「${newCategory}」を追加しました。このカテゴリをプリントに割り当ててください。`);
    setNewCategory('');
    onCategoryUpdated(); // 親コンポーネントに更新を通知
  };

  const handleEditCategory = async (oldCategory: string) => {
    if (editedCategoryName.trim() === '') return;
    if (existingCategories.includes(editedCategoryName.trim()) && editedCategoryName.trim() !== oldCategory) {
      alert('そのカテゴリ名は既に存在します。');
      return;
    }

    // 既存のプリントのカテゴリを一括更新
    const { error } = await supabase
      .from('prints')
      .update({ category: editedCategoryName.trim() })
      .eq('category', oldCategory);

    if (error) {
      console.error('Failed to update category:', error);
      alert('カテゴリの更新に失敗しました。');
    } else {
      alert(`カテゴリ「${oldCategory}」を「${editedCategoryName}」に更新しました。`);
      setEditingCategory(null);
      setEditedCategoryName('');
      onCategoryUpdated(); // 親コンポーネントに更新を通知
    }
  };

  const handleDeleteCategory = async (categoryToDelete: string) => {
    if (!confirm(`カテゴリ「${categoryToDelete}」を削除しますか？このカテゴリが割り当てられているプリントのカテゴリは空になります。`)) {
      return;
    }

    // 既存のプリントのカテゴリを一括削除（nullに設定）
    const { error } = await supabase
      .from('prints')
      .update({ category: null })
      .eq('category', categoryToDelete);

    if (error) {
      console.error('Failed to delete category:', error);
      alert('カテゴリの削除に失敗しました。');
    } else {
      alert(`カテゴリ「${categoryToDelete}」を削除しました。`);
      onCategoryUpdated(); // 親コンポーネントに更新を通知
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">カテゴリ管理</h2>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">既存カテゴリ</h3>
          {existingCategories.length === 0 ? (
            <p className="text-gray-600">まだカテゴリがありません。</p>
          ) : (
            <ul className="space-y-2">
              {existingCategories.map((category) => (
                <li key={category} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                  {editingCategory === category ? (
                    <input
                      type="text"
                      value={editedCategoryName}
                      onChange={(e) => setEditedCategoryName(e.target.value)}
                      className="flex-grow p-1 border border-gray-300 rounded-md mr-2"
                    />
                  ) : (
                    <span className="text-gray-800">{category}</span>
                  )}
                  <div className="flex space-x-2">
                    {editingCategory === category ? (
                      <>
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600"
                        >
                          キャンセル
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setEditedCategoryName(category);
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                        >
                          削除
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">新規カテゴリ追加</h3>
          <div className="flex">
            <input
              type="text"
              placeholder="新しいカテゴリ名"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-md mr-2"
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              追加
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}