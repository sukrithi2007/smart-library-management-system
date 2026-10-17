import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Heart, BookOpen, Trash2, ArrowRight, Sparkles, Star } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const {
    books,
    wishlistIds,
    toggleWishlist,
    borrowBook,
    reserveBook,
    openBookDetail,
    setCurrentView,
  } = useLibrary();

  const wishlistedBooks = books.filter((b) => wishlistIds.includes(b.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span>Personal Curations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            My Reading Wishlist ({wishlistedBooks.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Saved books, course readings, and future research candidates.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('explore')}
          className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Find more books in catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {wishlistedBooks.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <Heart className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any book across the catalog to save it to your personal reading list.
          </p>
          <button
            onClick={() => setCurrentView('explore')}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedBooks.map((book) => (
            <div
              key={book.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between gap-4 group hover:border-indigo-500/40 transition-all"
            >
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
                      <span>{book.rating.toFixed(1)}</span>
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
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
