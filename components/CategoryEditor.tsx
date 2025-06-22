'use client';

import { useState } from 'react';

interface CategoryEditorProps {
  currentCategory?: string;
  onSave: (category: string) => Promise<boolean>;
  onCancel: () => void;
}

const PREDEFINED_CATEGORIES = [
  '家族写真',
  '旅行',
  '誕生日',
  'イベント',
  '日常',
  '学校行事',
  'ペット',
  'その他'
];

export default function CategoryEditor({ currentCategory, onSave, onCancel }: CategoryEditorProps) {
  const [category, setCategory] = useState(currentCategory || '');
  const [isCustom, setIsCustom] = useState(!PREDEFINED_CATEGORIES.includes(currentCategory || ''));
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!category.trim()) {
      alert('カテゴリーを入力してください');
      return;
    }

    setIsSaving(true);
    try {
      const success = await onSave(category.trim());
      if (success) {
        onCancel();
      } else {
        alert('保存に失敗しました');
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePredefinedSelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setIsCustom(false);
  };

  const handleCustomToggle = () => {
    setIsCustom(true);
    setCategory('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">カテゴリーを設定</h3>
        
        {!isCustom ? (
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-2">
              {PREDEFINED_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handlePredefinedSelect(cat)}
                  className={`p-2 text-sm rounded border transition-colors ${
                    category === cat
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleCustomToggle}
              className="w-full p-2 text-sm rounded border border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              + カスタムカテゴリーを入力
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カスタムカテゴリー
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="カテゴリー名を入力..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <button
              onClick={() => setIsCustom(false)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              ← 定義済みカテゴリーから選択
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!category.trim() || isSaving}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}