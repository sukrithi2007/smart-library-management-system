import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Bell, Clock, Calendar, Check, Send, X, AlertTriangle } from 'lucide-react';

export const DueDateReminderModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    loans,
    currentUser,
    reminderSettings,
    updateReminderSettings,
    addToast,
    renewBook,
    setCurrentView,
  } = useLibrary();

  if (activeModal !== 'due_reminder') return null;

  const activeLoans = loans.filter((l) => l.userId === currentUser.id && l.status === 'active');

  const calculateDaysLeft = (dueDateStr: string) => {
    const today = new Date('2026-10-17');
    const due = new Date(dueDateStr);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleTestNotification = () => {
    addToast(
      'warning',
      'Test Due-Date Reminder',
      `[DEMO TEST] "Designing Data-Intensive Applications" is due in 2 days (Oct 19). Renew online before the cutoff.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200/20 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Due-Date Reminders & Alerts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated alerts to protect your borrowing privileges
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Active Loans Countdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              Your Current Borrowed Books ({activeLoans.length})
            </h4>

            {activeLoans.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No active loans currently checked out.</p>
            ) : (
              <div className="space-y-2.5">
                {activeLoans.map((loan) => {
                  const daysLeft = calculateDaysLeft(loan.dueDate);
                  const isUrgent = daysLeft <= 3;

                  return (
                    <div
                      key={loan.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isUrgent
                          ? 'border-amber-500/30 bg-amber-500/5'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {loan.bookTitle}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>Due: {loan.dueDate}</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={`font-semibold ${
                              isUrgent ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {daysLeft > 0 ? `${daysLeft} days remaining` : 'Due today!'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => renewBook(loan.id)}
                        disabled={loan.renewalCount >= loan.maxRenewals}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-cyan-400 border border-indigo-200/50 dark:border-indigo-800/40 transition-colors shrink-0 disabled:opacity-40"
                      >
                        Renew (+14d)
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Notification Preferences
            </h4>

            {/* Email Alerts Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-700 dark:text-slate-300">
                Email Dispatch to <span className="font-mono text-cyan-600 dark:text-cyan-400">{currentUser.email}</span>
              </span>
              <input
                type="checkbox"
                checked={reminderSettings.emailAlerts}
                onChange={(e) => updateReminderSettings({ emailAlerts: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            {/* In-App Push Alerts Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-700 dark:text-slate-300">
                In-App Banner & Top Bar Badge Alerts
              </span>
              <input
                type="checkbox"
                checked={reminderSettings.browserAlerts}
                onChange={(e) => updateReminderSettings({ browserAlerts: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            {/* Days Notice Selector */}
            <div>
              <label className="block text-xs text-slate-700 dark:text-slate-300 mb-2">
                Send Initial Reminder:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 5].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => updateReminderSettings({ daysNotice: days })}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      reminderSettings.daysNotice === days
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-cyan-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {days} {days === 1 ? 'day' : 'days'} prior
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={handleTestNotification}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test Due-Date Alert</span>
            </button>

            <button
              onClick={() => {
                setActiveModal(null);
                setCurrentView('my-books');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              View Full Loan Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
