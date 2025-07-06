// components/Notification.tsx
'use client';
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface NotificationContextType {
  showNotification: (message: string, type?: 'success' | 'error') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<'success' | 'error'>('success');

  const showNotification = (msg: string, notificationType: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setType(notificationType);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000); // 3秒後に非表示
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {message && (
        <div className={`notification-container notification-${type}`}>
          <p>{message}</p>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
