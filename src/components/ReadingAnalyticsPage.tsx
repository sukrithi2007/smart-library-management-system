import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  Flame,
  CheckCircle2,
  Download,
  Sparkles,
} from 'lucide-react';

export const ReadingAnalyticsPage: React.FC = () => {
  const { readingGoal, loans, currentUser, downloadBorrowingReportCSV } = useLibrary();

  const monthlyActivity = [
    { month: 'May', count: 1 },
    { month: 'Jun', count: 2 },
    { month: 'Jul', count: 1 },
    { month: 'Aug', count: 3 },
    { month: 'Sep', count: 4 },
    { month: 'Oct', count: 5 },
  ];

  const categoryDistribution = [
    { name: 'Computer Science & AI', percentage: 48, color: 'bg-indigo-500' },
    { name: 'Physics & Mathematics', percentage: 24, color: 'bg-cyan-500' },
    { name: 'Neuroscience & Biology', percentage: 16, color: 'bg-emerald-500' },
    { name: 'Philosophy & Ethics', percentage: 12, color: 'bg-amber-500' },
  ];

  const achievements = [
    {
      title: 'Cosmic Scholar',
      desc: 'Completed 5 university curriculum volumes in one semester',
      unlocked: true,
      badge: '🪐',
    },
    {
      title: 'Flawless Return Streak',
      desc: 'Zero late fees or overdue fines on campus circulation records',
      unlocked: true,
      badge: '⚡',
    },
    {
      title: 'Multi-Discipline Voyager',
      desc: 'Borrowed books from 3 separate university library wings',
      unlocked: true,
      badge: '🔭',
    },
    {
      title: 'Deep Research Fellow',
      desc: 'Accumulated over 3,000 pages of advanced academic reading',
      unlocked: readingGoal.pagesReadTotal >= 3000,
      badge: '📜',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <TrendingUp className="w-4 h-4" />
            <span>Scholarly Metrics & Velocity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Reading Insights & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual breakdown of your reading velocity, pages conquered, and curricular breadth.
          </p>
        </div>

        <button
          onClick={downloadBorrowingReportCSV}
          className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* 4 Quantitative Snapshot Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Semester Completion</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {readingGoal.completedBooks} <span className="text-xs font-normal text-slate-400">/ {readingGoal.targetBooks} Books</span>
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all"
              style={{ width: `${(readingGoal.completedBooks / readingGoal.targetBooks) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Pages Conquered</span>
            <Sparkles className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {readingGoal.pagesReadTotal.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">~380 pages per completed volume</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Daily Reading Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-500 mt-2 font-mono tabular-nums">
            {readingGoal.currentStreakDays} Days
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Consecutive study sessions logged</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Academic Standing</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 font-mono tabular-nums">
            100% On-Time
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Exemplary circulation conduct</p>
        </div>
      </div>

      {/* Main Charts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Activity Bar Chart */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Borrowing Frequency (2026)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Volumes circulated per academic month</p>
            </div>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
              Peak: October
            </span>
          </div>

          <div className="flex items-end justify-between gap-4 h-44 pt-4 border-b border-slate-100 dark:border-slate-800">
            {monthlyActivity.map((item) => {
              const maxCount = 6;
              const heightPercent = (item.count / maxCount) * 100;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div
                    className="w-full max-w-[42px] bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-medium text-slate-500 mt-1">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Disciplinary Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Focus areas across campus departments</p>
          </div>

          <div className="space-y-4">
            {categoryDistribution.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{cat.name}</span>
                  <span className="font-mono text-slate-500 font-semibold">{cat.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${cat.color} h-full rounded-full transition-all`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reading Badges & Achievements */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Curricular Milestone Achievements
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.title}
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                ach.unlocked
                  ? 'border-indigo-500/30 bg-indigo-50/30 dark:bg-indigo-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 opacity-50'
              }`}
            >
              <div className="text-2xl shrink-0 p-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                {ach.badge}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{ach.title}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {ach.desc}
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {ach.unlocked ? '✓ Unlocked' : 'In Progress'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
