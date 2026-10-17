import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookOpen, MapPin, Clock, Phone, Mail, QrCode, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setActiveModal } = useLibrary();

  return (
    <footer className="border-t border-slate-200/20 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/80 backdrop-blur-md text-slate-600 dark:text-slate-400 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Libra<span className="text-cyan-400">Verse</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Next-generation college library ecosystem empowering research, instant circulation, and collaborative scholarship across physical and digital stacks.
            </p>
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-cyan-500" />
              <span>Campus Complex, Kepler Hall & Science Wing</span>
            </div>
          </div>

          {/* Col 2: Navigation & Smart Discovery */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Smart Discovery
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentView('explore')}
                  className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Explore the Galaxy (Book Catalog)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('recommendations')}
                  className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Smart Recommendations
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('scanner')}
                  className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan & Discover (ISBN)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('analytics')}
                  className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Reading Insights & Velocity
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Circulation Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Circulation Desk
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveModal('due_reminder')}
                  className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Due-Date Reminder Settings
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('ask_librarian')}
                  className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ask the Librarian (Help Desk)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('my-books')}
                  className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Renewals & Returns
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('wishlist')}
                  className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                >
                  My Saved Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Library Hours & Direct Lines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Library Hours
            </h4>
            <div className="space-y-1.5 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Mon – Fri: 07:30 – 23:00</span>
              </div>
              <div className="flex items-center gap-2 pl-5.5">
                <span>Sat – Sun: 09:00 – 20:00</span>
              </div>
              <p className="text-[11px] pt-1 text-slate-400">
                24/7 Digital Catalog & Reservation Automated Service
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-1 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-cyan-500" />
                Circulation Desk: +1 (555) 019-4820
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-cyan-500" />
                library@campus.edu
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/40 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 LibraVerse Academic Library Systems. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Loan Policy: 21 Days</span>
            <span aria-hidden="true">·</span>
            <span>Renewals: Up to 2x</span>
            <span aria-hidden="true">·</span>
            <span>Grace Period: 3 Days</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
