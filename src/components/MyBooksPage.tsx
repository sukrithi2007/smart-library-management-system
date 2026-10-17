import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  BookOpen,
  Calendar,
  Clock,
  Download,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  BookmarkCheck,
  X,
  Sparkles,
} from 'lucide-react';

export const MyBooksPage: React.FC = () => {
  const {
    loans,
    reservations,
    currentUser,
    renewBook,
    returnBook,
    cancelReservation,
    downloadBorrowingReportCSV,
    setCurrentView,
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'reservations'>('current');

  const today = new Date('2026-10-17');

  const userActiveLoans = loans
    .filter((l) => l.userId === currentUser.id && l.status === 'active')
    .map((l) => {
      const due = new Date(l.dueDate);
      const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...l, diffDays };
    });

  const userHistoryLoans = loans.filter((l) => l.userId === currentUser.id && l.status === 'returned');
  const userReservations = reservations.filter((r) => r.userId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header and Download CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            My Reading Journey & Loans
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track active circulation records, renew loan periods, check in volumes, and export history.
          </p>
        </div>

        <button
          onClick={downloadBorrowingReportCSV}
          className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-cyan-300" />
          <span>Download My Report (CSV)</span>
        </button>
      </div>

      {/* Tabs / Segmented Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('current')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'current'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Active Borrowed Books ({userActiveLoans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'reservations'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Reservations & Waitlist ({userReservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Return History Archive ({userHistoryLoans.length})</span>
        </button>
      </div>

      {/* Active Loans Tab */}
      {activeTab === 'current' && (
        <div className="space-y-4">
          {userActiveLoans.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Active Loans
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You do not have any library volumes checked out right now. Browse our stacks to find reference materials.
              </p>
              <button
                onClick={() => setCurrentView('explore')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
              >
                Explore Books Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userActiveLoans.map((loan) => {
                const isUrgent = loan.diffDays <= 3;

                return (
                  <div
                    key={loan.id}
                    className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between gap-4 ${
                      isUrgent
                        ? 'border-amber-500/40 shadow-amber-500/5'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex gap-4">
                      <img
                        src={loan.bookCover}
                        alt={loan.bookTitle}
                        referrerPolicy="no-referrer"
                        className="w-16 h-24 rounded-xl object-cover shadow-md shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              isUrgent
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}
                          >
                            {loan.diffDays > 0 ? `${loan.diffDays} days left` : 'Due today'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            Loan ID: {loan.id.slice(-6)}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                          {loan.bookTitle}
                        </h3>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">{loan.bookAuthor}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                          ISBN: {loan.bookIsbn}
                        </p>

                        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Due Date: <span className="font-mono font-bold">{loan.dueDate}</span></span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Renewals used: {loan.renewalCount} of {loan.maxRenewals} permitted
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => renewBook(loan.id)}
                        disabled={loan.renewalCount >= loan.maxRenewals}
                        className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-cyan-400 border border-indigo-200/50 dark:border-indigo-800/40 transition-colors disabled:opacity-40"
                      >
                        Renew My Book (+14 Days)
                      </button>

                      <button
                        onClick={() => returnBook(loan.id)}
                        className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        Return to Library
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Reservations Tab */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {userReservations.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <BookmarkCheck className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Active Reservations</p>
              <p className="text-xs text-slate-500">When popular books are checked out, reserve your copy to queue up.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userReservations.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={res.bookCover}
                      alt={res.bookTitle}
                      referrerPolicy="no-referrer"
                      className="w-12 h-16 rounded-lg object-cover shadow-sm shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            res.status === 'ready_for_pickup'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 animate-pulse'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {res.status === 'ready_for_pickup'
                            ? 'Ready at Circulation Desk'
                            : `Queue Position #${res.queuePosition}`}
                        </span>
                        <span className="text-[11px] text-slate-400">Reserved {res.reservedDate}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {res.bookTitle}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {res.status === 'ready_for_pickup'
                          ? 'Please pick up at Kepler Level 1 within 48 hours.'
                          : 'You will receive an automated alert the moment a copy is returned.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => cancelReservation(res.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-colors shrink-0"
                    title="Cancel Reservation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History Archive Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {userHistoryLoans.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <RotateCcw className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Past Returns Recorded</p>
              <p className="text-xs text-slate-500">Returned loans will populate here to build your lifetime reading history.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <tr>
                    <th className="p-4 font-semibold">Book Title & Author</th>
                    <th className="p-4 font-semibold">Borrowed Date</th>
                    <th className="p-4 font-semibold">Return Date</th>
                    <th className="p-4 font-semibold">Circulation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {userHistoryLoans.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-4">
                        <p className="font-semibold text-slate-900 dark:text-white">{h.bookTitle}</p>
                        <p className="text-slate-500 text-[11px]">{h.bookAuthor} · <span className="font-mono">ISBN {h.bookIsbn}</span></p>
                      </td>
                      <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{h.borrowDate}</td>
                      <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{h.returnDate || 'Checked In'}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Returned on Time
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
