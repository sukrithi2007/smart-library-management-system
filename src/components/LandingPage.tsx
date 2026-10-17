import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  Shield,
  QrCode,
  Bell,
  Compass,
  Star,
  Users,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, openBookDetail, books, setActiveModal, isLoggedIn } = useLibrary();
  const [searchPreview, setSearchPreview] = useState('');

  const featuredBooks = books.filter((b) => b.isFeatured).slice(0, 4);

  const categories = [
    { name: 'Computer Science & AI', count: 4, icon: '💻', desc: 'Algorithms, Neural Networks, Distributed Systems' },
    { name: 'Physics & Mathematics', count: 2, icon: '⚛️', desc: 'Quantum Information, Relativity, Formal Logic' },
    { name: 'Neuroscience & Biology', count: 1, icon: '🧠', desc: 'Synaptic Plasticity, Cellular Systems, Cognition' },
    { name: 'Philosophy & Mind', count: 1, icon: '🏛️', desc: 'Epistemology, Recursion, Consciousness' },
    { name: 'Architecture & UX', count: 1, icon: '📐', desc: 'Cognitive Ergonomics, Design Systems, Urbanism' },
    { name: 'History & Society', count: 1, icon: '📜', desc: 'Anthropology, Global Civilizations, Modernity' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('explore');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background Atmosphere Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_digital_library_1792230677432.jpg"
            alt="Futuristic Digital University Library"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 backdrop-blur-md text-xs text-indigo-300 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium tracking-wide">Next-Gen College Academic Repository</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] text-balance">
            Where Knowledge Transcends Dimensions: <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-amber-300">LibraVerse</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover thousands of physical and digital volumes, reserve checked-out copies with automated queue notifications, scan barcodes instantly, and track your scholarly journey.
          </p>

          {/* Instant Search Bar ("Find My Book") */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto relative flex items-center p-2 rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl shadow-2xl focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all"
          >
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search by title, author, category, or ISBN..."
              value={searchPreview}
              onChange={(e) => setSearchPreview(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-transparent text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <span>Find My Book</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('explore')}
              className="px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-amber-300 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-slate-950" />
              <span>Explore the Galaxy</span>
            </button>

            <button
              onClick={() => setActiveModal('scanner')}
              className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Scan & Discover</span>
            </button>

            <button
              onClick={() => (isLoggedIn ? setCurrentView('dashboard') : setCurrentView('login'))}
              className="px-5 py-3 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-800/60 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>{isLoggedIn ? 'Go to My Dashboard' : 'Student & Staff Portal'}</span>
            </button>
          </div>

          {/* Live System Metrics Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/60 text-left">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
              <p className="text-2xl font-extrabold text-white font-mono tabular-nums">14,850+</p>
              <p className="text-xs text-slate-400 mt-1">Cataloged Physical Volumes</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
              <p className="text-2xl font-extrabold text-cyan-400 font-mono tabular-nums">99.8%</p>
              <p className="text-xs text-slate-400 mt-1">Real-Time Shelf Tracking</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
              <p className="text-2xl font-extrabold text-indigo-400 font-mono tabular-nums">2,420</p>
              <p className="text-xs text-slate-400 mt-1">Active Student Scholars</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
              <p className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">24 / 7</p>
              <p className="text-xs text-slate-400 mt-1">Smart Reservation Dispatch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Book Catalog Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <span>Curated Academic Stacks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Featured Course Textbooks & Stacks
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('explore')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>View All Volumes ({books.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => openBookDetail(book)}
              className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/40 p-4 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-slate-800 shadow-md">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950/80 text-white backdrop-blur-sm">
                    {book.availableCopies > 0 ? (
                      <span className="text-emerald-400">{book.availableCopies} available</span>
                    ) : (
                      <span className="text-amber-400">Reserved</span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1.5">
                  <span>{book.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{book.publishYear}</span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-indigo-400 mt-1 line-clamp-1">{book.author}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{book.rating.toFixed(1)}</span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-white transition-colors">
                  Details & Borrow →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore the Galaxy: Category Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Compass className="w-4 h-4" />
            <span>Interactive Navigation</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Explore the Galaxy of Disciplines
          </h2>
          <p className="text-xs text-slate-400">
            Filter our unified college collection across key university faculties and research sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => setCurrentView('explore')}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-indigo-500/40 transition-all cursor-pointer group"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{cat.desc}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-cyan-400">{cat.count} Available Volumes</span>
                <span className="group-hover:translate-x-1 transition-transform text-slate-400">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Smart System Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Scan & Discover Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use your device camera to scan book barcodes directly in the stacks or enter ISBNs to inspect availability and shelf map coordinates.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero-Friction Renewals</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated 3-day countdown alerts, 14-day one-click loan extensions, and intelligent priority waitlists for high-demand course reserves.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Role-Based Circulation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated interfaces tailored for Student scholars, Reference Librarians, and Campus Systems Administrators with full audit tracking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
