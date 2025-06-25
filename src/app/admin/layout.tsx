"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiTag,
  FiFolder,
  FiSettings,
  FiMenu,
  FiX,
  FiBriefcase
} from 'react-icons/fi';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Blog Posts', href: '/admin/posts', icon: FiFileText },
    { name: 'Portfolio', href: '/admin/portfolio', icon: FiBriefcase },
    { name: 'Authors', href: '/admin/authors', icon: FiUsers },
    { name: 'Categories', href: '/admin/categories', icon: FiFolder },
    { name: 'Tags', href: '/admin/tags', icon: FiTag },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <div className="text-xl font-bold text-primary">Bajramedia</div>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Logout button */}
              <button
                onClick={() => {
                  document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                  window.location.href = '/admin/login';
                }}
                className="hidden md:block text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-primary focus:outline-none"
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
            } md:translate-x-0 fixed md:static top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white shadow-md transition-transform duration-300 ease-in-out`}
        >
          <div className="h-full px-3 py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg ${isActive(item.href)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-white' : 'text-gray-500'}`} />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              ))}

              <li className="md:hidden">
                <button
                  onClick={() => {
                    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    window.location.href = '/admin/login';
                  }}
                  className="flex w-full items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <span className="ml-3">Logout</span>
                </button>
              </li>

              <li className="pt-4 mt-4 border-t border-gray-200">
                <Link
                  href="/"
                  className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="ml-3">Back to Website</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Backdrop */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
