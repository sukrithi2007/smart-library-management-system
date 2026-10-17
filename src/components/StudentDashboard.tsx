import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  BookOpen,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  Download,
  QrCode,
  HelpCircle,
  TrendingUp,
  Heart,
  Compass,
  ArrowRight,
  Shield,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    books,
    loans,
    wishlistIds,
    readingGoal,
    setCurrentView,
    setActiveModal,
    openBookDetail,
    renewBook,
    returnBook,
    downloadBorrowingReportCSV,
  } = useLibrary();

  // Metrics
  const activeLoans = loans.filter((l) => l.userId === currentUser.id && l.status === 'active');
  const pastLoans = loans.filter((l) => l.userId === currentUser.id && l.status === 'returned');
  const totalAvailableBooks = books.reduce((acc, b) => acc + b.availableCopies, 0);

  // Calculate upcoming due dates
  const today = new Date('2026-10-17');
  const loansWithDays = activeLoans.map((l) => {
    const due = new Date(l.dueDate);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { ...l, diffDays };
  });

  const urgentLoans = loansWithDays.filter((l) => l.diffDays <= 3);
  const overdueLoans = loansWithDays.filter((l) => l.diffDays < 0);

  // Recently added books
  const recentBooks = [...books]
    .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
    .slice(0, 4);

  // Recommended based on user interests
  const recommendedBooks = books
    .filter((b) => currentUser.interests.some((interest) => b.category.includes(interest) || b.tags.includes(interest)))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & User Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                {currentUser.role} portal
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-300 font-mono">{currentUser.studentId}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">{currentUser.department}</p>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <button
            onClick={downloadBorrowingReportCSV}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-cyan-300" />
            <span>Download My Report</span>
          </button>

          <button
            onClick={() => setActiveModal('due_reminder')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md transition-colors flex items-center gap-2"
          >
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>Due-Date Reminder</span>
          </button>

          <button
            onClick={() => setCurrentView('explore')}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 hover:brightness-105 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-slate-950" />
            <span>Explore the Galaxy</span>
          </button>
        </div>
      </div>

      {/* Urgent Alert Banner (if loans due within 3 days) */}
      {urgentLoans.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-amber-900 dark:text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">
                Upcoming Due Date Alert: {urgentLoans.length} volume(s) due soon!
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                "{urgentLoans[0].bookTitle}" is due on {urgentLoans[0].dueDate} ({urgentLoans[0].diffDays} days left).
              </p>
            </div>
          </div>
          <button
            onClick={() => renewBook(urgentLoans[0].id)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shrink-0"
          >
            Renew Now (+14d)
          </button>
        </div>
      )}

      {/* 4 Core Quantitative Metrics (tabular-nums) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Available in Library */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Available Books</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {totalAvailableBooks}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Across all campus departments</p>
        </div>

        {/* Currently Borrowed */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Currently Borrowed</span>
            <Clock className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {activeLoans.length} <span className="text-xs font-normal text-slate-400">/ {currentUser.borrowedLimit} quota</span>
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all"
              style={{ width: `${(activeLoans.length / currentUser.borrowedLimit) * 100}%` }}
            />
          </div>
        </div>

        {/* Due Dates Approaching */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Upcoming Due Dates</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {urgentLoans.length > 0 ? `${urgentLoans.length} Due Soon` : 'All Clear'}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {urgentLoans.length > 0 ? `Next due in ${urgentLoans[0].diffDays} days` : 'No imminent deadlines'}
          </p>
        </div>

        {/* Overdue Status */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Overdue Books</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {overdueLoans.length === 0 ? '$0.00' : `${overdueLoans.length} Overdue`}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Account in Pristine Standing
          </p>
        </div>
      </div>

      {/* 16 Functional Quick-Actions Command Strip */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Fast Command Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => setCurrentView('explore')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-left transition-all"
          >
            <Compass className="w-4 h-4 text-indigo-500 mb-1" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">Find My Book</p>
            <p className="text-[10px] text-slate-500">Live search catalog</p>
          </button>

          <button
            onClick={() => setCurrentView('my-books')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 text-left transition-all"
          >
            <Clock className="w-4 h-4 text-cyan-500 mb-1" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">My Reading Journey</p>
            <p className="text-[10px] text-slate-500">Active & past loans</p>
          </button>

          <button
            onClick={() => setCurrentView('recommendations')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 text-left transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-500 mb-1" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">Smart Suggested</p>
            <p className="text-[10px] text-slate-500">Tailored to your major</p>
          </button>

          <button
            onClick={() => setActiveModal('scanner')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-left transition-all"
          >
            <QrCode className="w-4 h-4 text-emerald-500 mb-1" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">Scan & Discover</p>
            <p className="text-[10px] text-slate-500">Barcode camera lookup</p>
          </button>

          <button
            onClick={() => setCurrentView('wishlist')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-left transition-all"
          >
            <Heart className="w-4 h-4 text-rose-500 mb-1" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">My Wishlist</p>
            <p className="text-[10px] text-slate-500">{wishlistIds.length} volumes saved</p>
          </button>

          <button
            onClick={() => setActiveModal('ask_librarian')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 text-left transition-all"
          >
            <HelpCircle className="w-4 h-4 text-violet-500 mb-1" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">Ask the Librarian</p>
            <p className="text-[10px] text-slate-500">Live reference desk</p>
          </button>
        </div>
      </div>

      {/* Active Borrowed Books Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Currently Borrowed Books */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Currently Borrowed ({activeLoans.length})
            </h3>
            <button
              onClick={() => setCurrentView('my-books')}
              className="text-xs text-indigo-600 dark:text-cyan-400 hover:underline"
            >
              Manage all loans →
            </button>
          </div>

          {activeLoans.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Books Currently Checked Out</p>
              <p className="text-xs text-slate-500">Explore the library galaxy to borrow books for your coursework.</p>
              <button
                onClick={() => setCurrentView('explore')}
                className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={loan.bookCover}
                      alt={loan.bookTitle}
                      referrerPolicy="no-referrer"
                      className="w-12 h-16 rounded-lg object-cover shadow-sm shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {loan.bookTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {loan.bookAuthor} · <span className="font-mono">ISBN {loan.bookIsbn}</span>
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                        <span>Due: <span className="font-mono font-semibold">{loan.dueDate}</span></span>
                        <span aria-hidden="true">·</span>
                        <span className="text-indigo-600 dark:text-cyan-400 font-mono">
                          {loan.renewalCount}/{loan.maxRenewals} renewals used
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => renewBook(loan.id)}
                      disabled={loan.renewalCount >= loan.maxRenewals}
                      className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-cyan-400 border border-indigo-200/50 dark:border-indigo-800/40 transition-colors disabled:opacity-40"
                    >
                      Renew My Book
                    </button>
                    <button
                      onClick={() => returnBook(loan.id)}
                      className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      Return to Library
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Reading Velocity & Smart Suggested */}
        <div className="space-y-6">
          {/* Reading Journey Card */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-500" />
                Reading Goal & Insights
              </h3>
              <button
                onClick={() => setCurrentView('analytics')}
                className="text-xs text-indigo-600 dark:text-cyan-400 hover:underline"
              >
                Insights →
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Semester Goal: {readingGoal.targetBooks} Volumes</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {Math.round((readingGoal.completedBooks / readingGoal.targetBooks) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${(readingGoal.completedBooks / readingGoal.targetBooks) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <p className="text-base font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {readingGoal.pagesReadTotal}
                </p>
                <p className="text-[10px] text-slate-400">Pages Conquered</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <p className="text-base font-extrabold text-amber-500 font-mono tabular-nums">
                  {readingGoal.currentStreakDays} Days
                </p>
                <p className="text-[10px] text-slate-400">Active Reading Streak</p>
              </div>
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Smart Recommendations
              </h3>
              <button
                onClick={() => setCurrentView('recommendations')}
                className="text-xs text-indigo-600 dark:text-cyan-400 hover:underline"
              >
                All →
              </button>
            </div>

            <div className="space-y-2.5">
              {recommendedBooks.map((b) => (
                <div
                  key={b.id}
                  onClick={() => openBookDetail(b)}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-cyan-500/40 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer transition-all flex items-center gap-3 group"
                >
                  <img
                    src={b.coverUrl}
                    alt={b.title}
                    referrerPolicy="no-referrer"
                    className="w-9 h-12 rounded object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-cyan-400 transition-colors">
                      {b.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{b.author}</p>
                    <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                      {b.availableCopies > 0 ? `${b.availableCopies} available` : 'Reserve copy'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
