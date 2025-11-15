
import React, { useState, useEffect } from 'react';
import Sidebar from './contexts/components/Sidebar';
import Header from './contexts/components/Header';
import Footer from './contexts/components/Footer';
import LoginModal from './contexts/components/LoginModal';
import HomeView from './contexts/components/views/HomeView';
import CoursesView from './contexts/components/views/CoursesView';
import FaqView from './contexts/components/views/FaqView';
import AboutView from './contexts/components/views/AboutView';
import AdminDashboardView from './contexts/components/views/AdminDashboardView';
import { useAuth } from './hooks/useAuth';
import type { Page } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user && activePage === 'admin') {
      setActivePage('home');
    }
  }, [user, activePage]);

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomeView />;
      case 'courses':
        return <CoursesView />;
      case 'faq':
        return <FaqView />;
      case 'about':
        return <AboutView />;
      case 'admin':
        return user ? <AdminDashboardView /> : <HomeView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onLoginClick={() => setLoginModalOpen(true)}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {renderContent()}
          </div>
        </main>
        <Footer />
      </div>
      {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
    </div>
  );
};

export default App;
