import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types';
import {
  Search,
  Filter,
  Star,
  BookOpen,
  MapPin,
  Heart,
  QrCode,
  Check,
  Sparkles,
  ArrowUpDown,
  X,
} from 'lucide-react';

export const ExploreBooks: React.FC = () => {
  const {
    books,
    openBookDetail,
    borrowBook,
    reserveBook,
    toggleWishlist,
    wishlistIds,
    loans,
    currentUser,
    setActiveModal,
  } = useLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'reserved'>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'newest' | 'title'>('popularity');

  // Available categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(books.map((b) => b.category)));
    return ['All', ...cats];
  }, [books]);

  // Filter & Sort
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Text match
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.isbn.toLowerCase().includes(q) ||
          book.tags.some((t) => t.toLowerCase().includes(q)) ||
          book.shelfLocation.toLowerCase().includes(q);

        // Category match
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;

        // Availability match
        const matchesAvailability =
          availabilityFilter === 'all'
            ? true
            : availabilityFilter === 'available'
            ? book.availableCopies > 0
            : book.availableCopies === 0;

        return matchesQuery && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === 'popularity') {
          return b.rating * b.ratingCount - a.rating * a.ratingCount;
        } else if (sortBy === 'newest') {
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
        } else {
          return a.title.localeCompare(b.title);
        }
      });
  }, [books, searchQuery, selectedCategory, availabilityFilter, sortBy]);

  const activeUserLoans = loans.filter((l) => l.userId === currentUser.id && l.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>LibraVerse Unified Stacks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Explore the Galaxy of Books
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Discover peer-reviewed texts, university curriculum references, and research volumes.
          </p>
        </div>

        {/* Quick ISBN Camera Scanner Action */}
        <button
          onClick={() => setActiveModal('scanner')}
          className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity flex items-center gap-2 self-start md:self-auto shrink-0 shadow-sm"
        >
          <QrCode className="w-4 h-4 text-cyan-400 dark:text-cyan-600" />
          <span>Scan Barcode / ISBN</span>
        </button>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input ("Find My Book") */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Find My Book — search by title, author, category, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Availability Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
            <button
              onClick={() => setAvailabilityFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                availabilityFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Volumes
            </button>
            <button
              onClick={() => setAvailabilityFilter('available')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                availabilityFilter === 'available'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              On Shelf
            </button>
            <button
              onClick={() => setAvailabilityFilter('reserved')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                availabilityFilter === 'reserved'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Checked Out
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="popularity">Highest Rated</option>
              <option value="newest">Newly Acquired</option>
              <option value="title">Title (A – Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Books Match Your Criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the category and availability filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setAvailabilityFilter('all');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const isWishlisted = wishlistIds.includes(book.id);
            const isBorrowedByUser = activeUserLoans.some((l) => l.bookId === book.id);

            return (
              <div
                key={book.id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-500/40 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm"
              >
                {/* Book Cover and Top Badges */}
                <div
                  onClick={() => openBookDetail(book)}
                  className="relative aspect-[3/4] bg-slate-800 overflow-hidden cursor-pointer"
                >
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Availability pill on cover */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-md ${
                        book.availableCopies > 0
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {book.availableCopies > 0
                        ? `${book.availableCopies} available`
                        : 'Reserved (Waitlist)'}
                    </span>

                    {/* Wishlist quick toggle button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(book.id);
                      }}
                      className="pointer-events-auto p-1.5 rounded-full bg-slate-950/70 text-white hover:text-rose-400 backdrop-blur-md transition-colors"
                      aria-label="Save to Wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white">
                    <span className="font-mono">{book.pages} pages</span>
                    <span className="font-mono text-cyan-300">{book.publishYear}</span>
                  </div>
                </div>

                {/* Details info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                      <span>{book.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">ISBN {book.isbn.slice(-6)}</span>
                    </div>

                    <h3
                      onClick={() => openBookDetail(book)}
                      className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 cursor-pointer"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 line-clamp-1">
                      {book.author}
                    </p>

                    {/* Shelf Location */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                      <MapPin className="w-3 h-3 text-cyan-500 shrink-0" />
                      <span className="truncate">{book.shelfLocation}</span>
                    </div>
                  </div>

                  {/* Rating and Interactive Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{book.rating.toFixed(1)}</span>
                    </div>

                    {book.availableCopies > 0 ? (
                      <button
                        onClick={() => borrowBook(book.id)}
                        disabled={isBorrowedByUser}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 transition-colors whitespace-nowrap shadow-sm"
                      >
                        {isBorrowedByUser ? 'Borrowed' : 'Borrow This Book'}
                      </button>
                    ) : (
                      <button
                        onClick={() => reserveBook(book.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors whitespace-nowrap shadow-sm"
                      >
                        Reserve My Copy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
