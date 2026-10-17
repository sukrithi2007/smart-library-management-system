import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  X,
  Star,
  BookOpen,
  MapPin,
  Calendar,
  Layers,
  Heart,
  Share2,
  Check,
  Send,
  Sparkles,
} from 'lucide-react';

export const BookDetailModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedBook,
    borrowBook,
    reserveBook,
    toggleWishlist,
    wishlistIds,
    loans,
    currentUser,
    reviews,
    addReview,
    addToast,
  } = useLibrary();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (activeModal !== 'book_detail' || !selectedBook) return null;

  const isWishlisted = wishlistIds.includes(selectedBook.id);
  const bookReviews = reviews.filter((r) => r.bookId === selectedBook.id);
  const activeUserLoans = loans.filter((l) => l.userId === currentUser.id && l.status === 'active');
  const alreadyBorrowed = activeUserLoans.some((l) => l.bookId === selectedBook.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReview(selectedBook.id, rating, comment);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200/20 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{selectedBook.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">ISBN {selectedBook.isbn}</span>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Split: Cover + Core Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-slate-800 border border-slate-700/50">
              <img
                src={selectedBook.coverUrl}
                alt={selectedBook.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white">
                <span className="font-mono">{selectedBook.pages} pages</span>
                <span className="font-mono">{selectedBook.publishYear}</span>
              </div>
            </div>

            {/* Core Info */}
            <div className="sm:col-span-2 space-y-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  {selectedBook.title}
                </h2>
                <p className="text-sm text-indigo-600 dark:text-cyan-400 font-medium mt-1">
                  by {selectedBook.author}
                </p>
              </div>

              {/* Rating & Stock row */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{selectedBook.rating.toFixed(2)}</span>
                  <span className="text-slate-400 font-normal">({selectedBook.ratingCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedBook.availableCopies > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {selectedBook.availableCopies} of {selectedBook.totalCopies} copies available
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedBook.description}
              </p>

              {/* Shelf Locator Card */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5 text-xs">
                <MapPin className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Campus Shelf Location:
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {selectedBook.shelfLocation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {selectedBook.availableCopies > 0 ? (
                  <button
                    onClick={() => borrowBook(selectedBook.id)}
                    disabled={alreadyBorrowed}
                    className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 transition-all shadow-md shadow-indigo-500/20 whitespace-nowrap"
                  >
                    {alreadyBorrowed ? 'Currently Borrowed' : 'Borrow This Book'}
                  </button>
                ) : (
                  <button
                    onClick={() => reserveBook(selectedBook.id)}
                    className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 whitespace-nowrap"
                  >
                    Reserve My Copy (Join Queue)
                  </button>
                )}

                <button
                  onClick={() => toggleWishlist(selectedBook.id)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isWishlisted
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  aria-label="Toggle Wishlist"
                  title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {selectedBook.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Student Reviews & Discourse */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Student Reviews & Notes ({bookReviews.length})
            </h3>

            {bookReviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No student notes yet. Be the first to review!</p>
            ) : (
              <div className="space-y-3">
                {bookReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {rev.userName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-mono text-[11px]">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{rev.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Write a Review */}
            <form onSubmit={handleSubmitReview} className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Add Your Assessment:
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share a helpful note for classmates reading this volume..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl transition-colors shrink-0"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
