import React, { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import Header from './Header';

const MainLayout = ({ children }) => {
  const { checkAuth } = useAuthStore();
  const { initializeDarkMode } = useUiStore();

  useEffect(() => {
    checkAuth();
    initializeDarkMode();
  }, [checkAuth, initializeDarkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;