
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { Page, AdminView } from '../../types';
import { HomeIcon, CourseIcon, FaqIcon, AboutIcon, AdminIcon, UsersIcon, CmsIcon, SettingsIcon, ContactIcon, ChevronDownIcon, ChevronRightIcon } from './icons/Icons';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onLoginClick: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeAdminView: AdminView;
  setActiveAdminView: (view: AdminView) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-2 text-base font-normal rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLoginClick, isOpen, setIsOpen, activeAdminView, setActiveAdminView }) => {
  const { user, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isSettingsActive = activeAdminView === 'settings_contact' || activeAdminView === 'settings_faq';

  useEffect(() => {
    if (isSettingsActive) {
      setIsSettingsOpen(true);
    }
  }, [isSettingsActive]);
  
  const handleLogout = () => {
    logout();
    setActivePage('home');
    setIsOpen(false);
  }

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`fixed top-0 left-0 h-full bg-gray-800 dark:bg-gray-900 text-white w-64 space-y-6 py-7 px-2 transform transition-transform duration-300 z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:h-auto flex flex-col`}>
        <div>
            <div className="flex items-center space-x-2 px-4">
              <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white">LF</div>
              <span className="text-2xl font-extrabold">LearningFold</span>
            </div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <NavItem
              icon={<HomeIcon />}
              label="Home"
              isActive={activePage === 'home'}
              onClick={() => setActivePage('home')}
            />
            <NavItem
              icon={<CourseIcon />}
              label="Courses"
              isActive={activePage === 'courses'}
              onClick={() => setActivePage('courses')}
            />
            <NavItem
              icon={<FaqIcon />}
              label="FAQs"
              isActive={activePage === 'faq'}
              onClick={() => setActivePage('faq')}
            />
            <NavItem
              icon={<AboutIcon />}
              label="About"
              isActive={activePage === 'about'}
              onClick={() => setActivePage('about')}
            />
          </ul>
           {user && (
            <>
                <hr className="my-4 border-gray-600" />
                 <ul className="space-y-2">
                    <NavItem
                        icon={<AdminIcon />}
                        label="Dashboard"
                        isActive={activePage === 'admin' && activeAdminView === 'dashboard'}
                        onClick={() => setActiveAdminView('dashboard')}
                    />
                     <NavItem
                        icon={<CourseIcon />}
                        label="จัดการหลักสูตร"
                        isActive={activePage === 'admin' && activeAdminView === 'courses'}
                        onClick={() => setActiveAdminView('courses')}
                    />
                    <NavItem
                        icon={<UsersIcon />}
                        label="จัดการการลงทะเบียน"
                        isActive={activePage === 'admin' && activeAdminView === 'registrations'}
                        onClick={() => setActiveAdminView('registrations')}
                    />
                    <NavItem
                        icon={<CmsIcon />}
                        label="จัดการประกาศ"
                        isActive={activePage === 'admin' && activeAdminView === 'cms'}
                        onClick={() => setActiveAdminView('cms')}
                    />
                    <li>
                      <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className={`flex items-center justify-between w-full p-2 text-base font-normal rounded-lg transition-colors ${
                          isSettingsActive
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center">
                          <SettingsIcon />
                          <span className="ml-3">ตั้งค่าระบบ</span>
                        </div>
                        {isSettingsOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                      </button>
                      {isSettingsOpen && (
                        <ul className="py-2 pl-7 space-y-2">
                          <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); setActiveAdminView('settings_contact');}} 
                               className={`flex items-center p-2 text-sm font-normal rounded-lg transition-colors ${activeAdminView === 'settings_contact' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                                <ContactIcon />
                                <span className="ml-3">ข้อมูลการติดต่อ</span>
                            </a>
                          </li>
                          <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); setActiveAdminView('settings_faq');}} 
                               className={`flex items-center p-2 text-sm font-normal rounded-lg transition-colors ${activeAdminView === 'settings_faq' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                                <FaqIcon />
                                <span className="ml-3">ข้อมูล FAQs</span>
                            </a>
                          </li>
                        </ul>
                      )}
                    </li>
                </ul>
            </>
           )}
        </nav>

        <div className="p-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => { onLoginClick(); setIsOpen(false); }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;