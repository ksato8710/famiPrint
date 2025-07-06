// components/ConfirmModal.tsx
import React from 'react';
import Modal from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, onClose, message, onConfirm, onCancel }: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onCancel();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="確認">
      <p>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
        <button onClick={handleCancel} className="category-editor-close-button">キャンセル</button>
        <button onClick={handleConfirm} className="primary-button">OK</button>
      </div>
    </Modal>
  );
}
