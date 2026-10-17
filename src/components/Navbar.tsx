import React, { useState } from 'react';
import { useLibrary, ViewType } from '../context/LibraryContext';
import { UserRole } from '../types';
import {
  BookOpen,
  Bell,
  Sun,
  Moon,
  LogOut,
  UserCheck,
  ChevronDown,
  Sparkles,
  QrCode,
  Shield,
  HelpCircle,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    currentUser,
    isLoggedIn,
    logout,
    switchDemoRole,
    currentView,
    setCurrentView,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveModal,
  } = useLibrary();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNav = (view: ViewType) => {
    setCurrentView(view);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/20 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element, 1 line) */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Libra<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">Verse</span>
          </span>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNav('explore')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-indigo-600 dark:hover:text-cyan-400 ${
              currentView === 'explore' ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
            }`}
          >
            Explore Catalog
          </button>

          {isLoggedIn && (
            <>
              <button
                onClick={() => handleNav('dashboard')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-indigo-600 dark:hover:text-cyan-400 ${
                  currentView === 'dashboard' ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNav('my-books')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-indigo-600 dark:hover:text-cyan-400 ${
                  currentView === 'my-books' ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
                }`}
              >
                My Loans
              </button>
              <button
                onClick={() => handleNav('recommendations')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-indigo-600 dark:hover:text-cyan-400 ${
                  currentView === 'recommendations' ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
                }`}
              >
                Suggested
              </button>
              <button
                onClick={() => handleNav('analytics')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-indigo-600 dark:hover:text-cyan-400 ${
                  currentView === 'analytics' ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : ''
                }`}
              >
                Insights
              </button>
            </>
          )}

          {(currentUser.role === 'admin' || currentUser.role === 'librarian') && isLoggedIn && (
            <button
              onClick={() => handleNav('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium ${
                currentView === 'admin' ? 'font-bold' : ''
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Center</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Scanner Launcher */}
          <button
            onClick={() => setActiveModal('scanner')}
            title="Scan & Discover (ISBN Barcode Scanner)"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Scan & Discover ISBN"
          >
            <QrCode className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </button>

          {/* Ask Librarian Launcher */}
          <button
            onClick={() => setActiveModal('ask_librarian')}
            title="Ask the Librarian"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Ask the Librarian"
          >
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark / Light Mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                aria-label="Due-Date Reminders and Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      Reminders & Alerts ({unreadCount})
                    </span>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-indigo-600 dark:text-cyan-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-500">No active alerts</div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.actionUrl) {
                              setCurrentView(n.actionUrl as ViewType);
                              setShowNotifMenu(false);
                            }
                          }}
                          className={`p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                          }`}
                        >
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{n.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="pt-2 px-4 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      onClick={() => {
                        setActiveModal('due_reminder');
                        setShowNotifMenu(false);
                      }}
                      className="text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 font-medium"
                    >
                      Configure Due-Date Reminders →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Account / Demo Role Switcher */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Account and demo roles"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500/30"
                />
                <span className="hidden sm:inline text-xs font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">{currentUser.role} Account</p>
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 tracking-wider">
                      SWITCH DEMO ROLE
                    </div>
                    {(['student', 'librarian', 'admin'] as UserRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          switchDemoRole(role);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-xs capitalize flex items-center justify-between transition-colors ${
                          currentUser.role === role
                            ? 'text-indigo-600 dark:text-cyan-400 font-semibold bg-indigo-50/50 dark:bg-indigo-950/30'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{role}</span>
                        {currentUser.role === role && <UserCheck className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setShowRoleMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('login')}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg shadow-sm shadow-indigo-500/20 transition-all whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
