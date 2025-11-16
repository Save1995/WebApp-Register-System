
import React, { useState, useEffect } from 'react';
import Sidebar from './contexts/components/Sidebar';
import Header from './contexts/components/Header';
import Footer from './contexts/components/Footer';
import LoginModal from './contexts/components/LoginModal';
import HomeView from './HomeView';
import CoursesView from './hooks/views/CoursesView';
import FaqView from './hooks/views/FaqView';
import AboutView from './hooks/views/AboutView';
import AdminDashboardView from './hooks/views/AdminDashboardView';
import { useAuth } from './hooks/useAuth';
import type { Page, AdminView } from './types';
import ToastContainer from './contexts/components/ToastContainer';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [adminView, setAdminView] = useState<AdminView>('dashboard');
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user && activePage === 'admin') {
      setActivePage('home');
    }
  }, [user, activePage]);
  
  const handleSetActivePage = (page: Page) => {
    setActivePage(page);
    if (page !== 'admin') {
      // Reset to dashboard when leaving admin section
      setAdminView('dashboard');
    }
    setSidebarOpen(false);
  };
  
  const handleSetActiveAdminView = (view: AdminView) => {
    setActivePage('admin');
    setAdminView(view);
    setSidebarOpen(false);
  }

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
        return user ? <AdminDashboardView activeView={adminView} /> : <HomeView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        activePage={activePage} 
        setActivePage={handleSetActivePage} 
        onLoginClick={() => setLoginModalOpen(true)}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        activeAdminView={adminView}
        setActiveAdminView={handleSetActiveAdminView}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {renderContent()}
          </div>
        </main>
        <Footer />
      </div>
      {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
      <ToastContainer />
    </div>
  );
};

export default App;