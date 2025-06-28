"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Logo } from '@/components';
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiTag,
  FiFolder,
  FiSettings,
  FiMenu,
  FiX,
  FiBriefcase,
  FiMoon,
  FiSun,
  FiLogOut,
  FiArrowLeft,
  FiGlobe
} from 'react-icons/fi';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('admin-theme', newDarkMode ? 'dark' : 'light');

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems = [
    { name: t('admin.dashboard'), href: '/admin', icon: FiHome },
    { name: t('admin.posts'), href: '/admin/posts', icon: FiFileText },
    { name: t('admin.portfolio'), href: '/admin/portfolio', icon: FiBriefcase },
    { name: 'Technologies', href: '/admin/technologies', icon: FiSettings },
    { name: 'Team', href: '/admin/team', icon: FiUsers },
    { name: 'Partners', href: '/admin/partners', icon: FiGlobe },
    { name: 'About', href: '/admin/about', icon: FiFolder },
    { name: t('admin.authors'), href: '/admin/authors', icon: FiUsers },
    { name: t('admin.categories'), href: '/admin/categories', icon: FiFolder },
    { name: t('admin.tags'), href: '/admin/tags', icon: FiTag },
    { name: t('admin.settings'), href: '/admin/settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Logo size="md" variant="dark" />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <FiLogOut size={16} />
                <span>{t('admin.logout')}</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation */}
        <aside
          className={`${menuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 fixed md:static top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out`}
        >
          <div className="h-full px-3 py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${isActive(item.href)
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              ))}

              <li className="md:hidden pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <FiLogOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="ml-3">{t('admin.logout')}</span>
                </button>
              </li>

              <li className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/"
                  className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  <FiArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="ml-3">{t('admin.backToWebsite')}</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Backdrop */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
