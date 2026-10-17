import React from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { ExploreBooks } from './components/ExploreBooks';
import { MyBooksPage } from './components/MyBooksPage';
import { WishlistPage } from './components/WishlistPage';
import { RecommendationsPage } from './components/RecommendationsPage';
import { ReadingAnalyticsPage } from './components/ReadingAnalyticsPage';
import { AdminControlCenter } from './components/AdminControlCenter';
import { BookDetailModal } from './components/BookDetailModal';
import { ScanDiscoverModal } from './components/ScanDiscoverModal';
import { AskLibrarianModal } from './components/AskLibrarianModal';
import { DueDateReminderModal } from './components/DueDateReminderModal';
import { ToastContainer } from './components/Toast';

const MainContent: React.FC = () => {
  const { currentView } = useLibrary();

  return (
    <main className="flex-1">
      {currentView === 'landing' && <LandingPage />}
      {currentView === 'login' && <LoginPage />}
      {currentView === 'dashboard' && <StudentDashboard />}
      {currentView === 'explore' && <ExploreBooks />}
      {currentView === 'my-books' && <MyBooksPage />}
      {currentView === 'wishlist' && <WishlistPage />}
      {currentView === 'recommendations' && <RecommendationsPage />}
      {currentView === 'analytics' && <ReadingAnalyticsPage />}
      {currentView === 'admin' && <AdminControlCenter />}
    </main>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
        <Navbar />
        <MainContent />
        <Footer />

        {/* Global Modals */}
        <BookDetailModal />
        <ScanDiscoverModal />
        <AskLibrarianModal />
        <DueDateReminderModal />

        {/* Global Toast Alerts */}
        <ToastContainer />
      </div>
    </LibraryProvider>
  );
}
