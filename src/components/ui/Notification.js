'use client';

import { createContext, useContext, useState, useCallback, useId } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const baseId = useId();

  const showNotification = useCallback(({ message, type = 'success', duration = 3000 }) => {
    const id = `${baseId}-${Date.now()}`;
    
    setNotifications(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, duration);
  }, [baseId]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map(({ id, message, type }) => (
          <div
            key={id}
            className={`px-4 py-2 rounded-lg shadow-lg text-white ${
              type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } transition-all duration-500 ease-in-out transform translate-y-0`}
          >
            {message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
<div
  key={id}
  className={`px-4 py-2 rounded-lg shadow-lg text-white ${
    type === 'success' ? 'bg-green-500/90' : 'bg-red-600/90'
  } backdrop-blur-sm border ${
    type === 'success' ? 'border-green-400/20' : 'border-red-400/20'
  } transition-all duration-500 ease-in-out transform translate-y-0`}
>
  {message}
</div>
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de NotificationProvider');
  }
  return context;
} 