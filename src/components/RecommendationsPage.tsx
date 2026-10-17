import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Sparkles, Star, BookOpen, Compass, ArrowRight, Heart } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const {
    books,
    currentUser,
    borrowBook,
    reserveBook,
    toggleWishlist,
    wishlistIds,
    openBookDetail,
    setCurrentView,
  } = useLibrary();

  const [activeInterest, setActiveInterest] = useState<string>('All');

  const filterInterests = ['All', ...currentUser.interests];

  const recommendedList = books.map((book) => {
    // calculate match reason
    let reason = 'Curated academic milestone for your curriculum';
    let matchScore = 88;

    if (book.category.includes('Computer Science')) {
      reason = 'Core foundation for your Computer Science & Cognitive Systems major';
      matchScore = 98;
    } else if (book.tags.some((t) => currentUser.interests.includes(t))) {
      const matched = book.tags.find((t) => currentUser.interests.includes(t));
      reason = `Matches your registered interest in ${matched}`;
      matchScore = 95;
    } else if (book.rating >= 4.9) {
      reason = 'Faculty choice with top peer review ratings across campus';
      matchScore = 92;
    }

    return { ...book, reason, matchScore };
  });

  const filtered = recommendedList.filter((b) => {
    if (activeInterest === 'All') return true;
    return b.category.includes(activeInterest) || b.tags.includes(activeInterest);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          <Sparkles className="w-4 h-4" />
          <span>Algorithmic Academic Synthesis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Smart Recommendations for {currentUser.name}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Synthesized from your department focus (<span className="text-indigo-600 dark:text-cyan-400 font-medium">{currentUser.department}</span>) and past reading velocity.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterInterests.map((interest) => (
          <button
            key={interest}
            onClick={() => setActiveInterest(interest)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeInterest === interest
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {interest}
          </button>
        ))}
      </div>

      {/* Recommended Books List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((book) => {
          const isWishlisted = wishlistIds.includes(book.id);

          return (
            <div
              key={book.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between gap-4 group hover:border-amber-500/40 transition-all"
            >
              <div>
                {/* Recommendation Rationale Callout */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 mb-3 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="leading-tight">{book.reason}</span>
                </div>

                <div className="flex gap-4">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    onClick={() => openBookDetail(book)}
                    className="w-20 h-28 rounded-xl object-cover shadow-md cursor-pointer group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 font-medium block">{book.category}</span>
                    <h3
                      onClick={() => openBookDetail(book)}
                      className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-indigo-600 dark:hover:text-cyan-400 cursor-pointer mt-0.5"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5 line-clamp-1">{book.author}</p>

                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <div className="flex items-center gap-1 text-amber-500 font-mono text-[11px]">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{book.rating.toFixed(2)}</span>
                      </div>
                      <span aria-hidden="true" className="text-slate-400">·</span>
                      <span
                        className={`text-[11px] font-semibold ${
                          book.availableCopies > 0 ? 'text-emerald-500' : 'text-amber-500'
                        }`}
                      >
                        {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Reserved'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                {book.availableCopies > 0 ? (
                  <button
                    onClick={() => borrowBook(book.id)}
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
                  >
                    Borrow This Book
                  </button>
                ) : (
                  <button
                    onClick={() => reserveBook(book.id)}
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm"
                  >
                    Reserve Copy
                  </button>
                )}

                <button
                  onClick={() => toggleWishlist(book.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isWishlisted
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
