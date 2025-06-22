'use client';

import { useState, useRef } from 'react';

interface UploadFormProps {
  onUploaded: (urls: string[]) => void;
}

export default function UploadForm({ onUploaded }: UploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (validFiles.length === 0) {
      alert('画像ファイルを選択してください');
      return;
    }

    setIsUploading(true);
    
    try {
      const urls: string[] = [];
      
      for (const file of validFiles) {
        // ここでは仮のURLを生成（実際のストレージ実装後に置き換える）
        const mockUrl = URL.createObjectURL(file);
        urls.push(mockUrl);
      }
      
      onUploaded(urls);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-600">アップロード中...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl text-gray-400">📸</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                画像をドラッグ&ドロップ
              </p>
              <p className="text-sm text-gray-500 mt-1">
                または クリックしてファイルを選択
              </p>
            </div>
            <p className="text-xs text-gray-400">
              複数の画像ファイルを同時にアップロードできます
            </p>
          </div>
        )}
      </div>
    </div>
  );
}