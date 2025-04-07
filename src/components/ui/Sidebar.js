'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  BeakerIcon,
  DocumentChartBarIcon,
  CommandLineIcon,
  CreditCardIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      name: 'Overview',
      icon: HomeIcon,
      path: '/dashboard',
    },
    {
      name: 'Research Assistant',
      icon: BeakerIcon,
      path: '/dashboard/research',
    },
    {
      name: 'Research Reports',
      icon: DocumentChartBarIcon,
      path: '/dashboard/reports',
    },
    {
      name: 'API Playground',
      icon: CommandLineIcon,
      path: '/dashboard/playground',
    },
    {
      name: 'Invoices',
      icon: CreditCardIcon,
      path: '/dashboard/invoices',
    },
    {
      name: 'Documentation',
      icon: BookOpenIcon,
      path: '/dashboard/docs',
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out
                 ${isCollapsed ? 'w-20' : 'w-64'}
                 bg-gray-900/40 backdrop-blur-xl border-r border-gray-800/20`}
    >
      <div className="flex h-full flex-col justify-between">
        {/* Logo y Toggle */}
        <div className="flex items-center justify-between p-4">
          <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Dandi
            </span>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <svg
              className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Menú Principal */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center group px-3 py-3 rounded-lg transition-all duration-200
                          ${isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/20'
                    : 'text-gray-400 hover:bg-gray-800/50'
                  }`}
              >
                <item.icon
                  className={`w-6 h-6 transition-transform duration-200
                            ${isCollapsed ? 'mx-auto' : 'mr-3'}
                            ${isActive ? 'text-indigo-400' : 'text-gray-400'}
                            group-hover:scale-110 group-hover:text-indigo-400`}
                />
                <span
                  className={`${isCollapsed ? 'hidden' : 'block'} 
                             ${isActive ? 'font-medium' : ''}`}
                >
                  {item.name}
                </span>
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800/20">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">DA</span>
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-medium text-gray-200">Dandi Admin</p>
                <p className="text-xs text-gray-400">admin@dandi.ai</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
