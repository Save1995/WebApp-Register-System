
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { Page } from '../../types';
import { HomeIcon, CourseIcon, FaqIcon, AboutIcon, AdminIcon } from './icons/Icons';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onLoginClick: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
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

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLoginClick, isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 space-y-6 py-7 px-2 transform transition-transform duration-300 z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:h-auto`}>
        <div className="flex items-center space-x-2 px-4">
          <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white">LF</div>
          <span className="text-2xl font-extrabold">LearningFold</span>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <NavItem
              icon={<HomeIcon />}
              label="Home"
              isActive={activePage === 'home'}
              onClick={() => { setActivePage('home'); setIsOpen(false); }}
            />
            <NavItem
              icon={<CourseIcon />}
              label="Courses"
              isActive={activePage === 'courses'}
              onClick={() => { setActivePage('courses'); setIsOpen(false); }}
            />
            <NavItem
              icon={<FaqIcon />}
              label="FAQs"
              isActive={activePage === 'faq'}
              onClick={() => { setActivePage('faq'); setIsOpen(false); }}
            />
            <NavItem
              icon={<AboutIcon />}
              label="About"
              isActive={activePage === 'about'}
              onClick={() => { setActivePage('about'); setIsOpen(false); }}
            />
            {user && (
              <NavItem
              icon={<AdminIcon />}
              label="Admin"
              isActive={activePage === 'admin'}
              onClick={() => { setActivePage('admin'); setIsOpen(false); }}
            />
            )}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4">
          {user ? (
            <button
              onClick={() => { logout(); setIsOpen(false); }}
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
