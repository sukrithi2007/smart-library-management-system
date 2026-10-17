import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book, UserRole } from '../types';
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  BookOpen,
  Users,
  Layers,
  CheckCircle2,
  X,
  Search,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const AdminControlCenter: React.FC = () => {
  const {
    books,
    loans,
    currentUser,
    addBook,
    updateBook,
    deleteBook,
    addToast,
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'inventory' | 'loans' | 'users' | 'settings'>('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Add Book Form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newCategory, setNewCategory] = useState('Computer Science');
  const [newCopies, setNewCopies] = useState(4);
  const [newPages, setNewPages] = useState(450);
  const [newYear, setNewYear] = useState(2024);
  const [newShelf, setNewShelf] = useState('Science Wing · Level 3 · Shelf 310');
  const [newDesc, setNewDesc] = useState('');

  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim() || !newIsbn.trim()) {
      addToast('error', 'Missing Information', 'Please fill in Title, Author, and ISBN.');
      return;
    }

    addBook({
      title: newTitle,
      author: newAuthor,
      isbn: newIsbn,
      category: newCategory,
      totalCopies: Number(newCopies),
      availableCopies: Number(newCopies),
      pages: Number(newPages),
      publishYear: Number(newYear),
      shelfLocation: newShelf,
      description: newDesc || 'Comprehensive academic textbook newly integrated into university library catalog.',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      tags: [newCategory, 'Campus Acquisition', 'Curriculum'],
    });

    setShowAddModal(false);
    // Reset
    setNewTitle('');
    setNewAuthor('');
    setNewIsbn('');
    setNewDesc('');
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.isbn.includes(searchFilter) ||
      b.author.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
            <Shield className="w-4 h-4" />
            <span>Circulation & Inventory Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Admin & Staff Control Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Authenticated control panel for collection cataloging, circulation auditing, and student borrowing policies.
          </p>
        </div>

        {activeTab === 'inventory' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:opacity-95 transition-opacity flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book Volume</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Catalog Inventory ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('loans')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'loans'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Active Circulation Ledger ({loans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Role Accounts (3)</span>
        </button>
      </div>

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search catalog by title, author, or ISBN..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="p-4 font-semibold">Title & Author</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Copies (Avail/Total)</th>
                  <th className="p-4 font-semibold">Shelf Location</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBooks.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{b.title}</p>
                      <p className="text-slate-500 text-[11px] font-mono">ISBN {b.isbn} · {b.author}</p>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{b.category}</td>
                    <td className="p-4 font-mono font-semibold">
                      <span className={b.availableCopies > 0 ? 'text-emerald-500' : 'text-amber-500'}>
                        {b.availableCopies}
                      </span>{' '}
                      / {b.totalCopies}
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {b.shelfLocation}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          const newCount = prompt(`Update total copies for "${b.title}":`, String(b.totalCopies));
                          if (newCount && !isNaN(Number(newCount))) {
                            const diff = Number(newCount) - b.totalCopies;
                            updateBook(b.id, {
                              totalCopies: Number(newCount),
                              availableCopies: Math.max(0, b.availableCopies + diff),
                            });
                          }
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg hover:underline"
                      >
                        Adjust Copies
                      </button>
                      <button
                        onClick={() => deleteBook(b.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                        title="Delete Book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Circulation Ledger Tab */}
      {activeTab === 'loans' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
              <tr>
                <th className="p-4 font-semibold">Loan ID</th>
                <th className="p-4 font-semibold">Borrower</th>
                <th className="p-4 font-semibold">Volume Title</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loans.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-mono text-slate-500 text-[11px]">{l.id}</td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">{l.userName}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    <p className="font-medium">{l.bookTitle}</p>
                    <p className="text-[10px] text-slate-400 font-mono">ISBN {l.bookIsbn}</p>
                  </td>
                  <td className="p-4 font-mono text-slate-600 dark:text-slate-300">{l.dueDate}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                        l.status === 'active'
                          ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/avatar_student_sarah_1792230677063.jpg"
                alt="Sarah Chen"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-cyan-500/30"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sarah Chen</h4>
                <p className="text-xs text-slate-500">sarah.chen@campus.edu</p>
                <span className="text-[10px] font-semibold text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 px-1.5 py-0.5 rounded uppercase">
                  Student
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
              <p>Borrowing Limit: <span className="font-mono font-semibold text-slate-900 dark:text-white">5 Volumes</span></p>
              <p>Current Active: <span className="font-mono text-slate-900 dark:text-white">2 Checked Out</span></p>
              <p>Standing: <span className="text-emerald-500 font-semibold">Clear ($0.00 fines)</span></p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/avatar_librarian_elena_1792230676929.jpg"
                alt="Dr. Elena Rostova"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Dr. Elena Rostova</h4>
                <p className="text-xs text-slate-500">elena.rostova@campus.edu</p>
                <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded uppercase">
                  Librarian
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
              <p>Borrowing Limit: <span className="font-mono font-semibold text-slate-900 dark:text-white">15 Volumes</span></p>
              <p>Access Level: <span className="font-semibold text-slate-900 dark:text-white">Full Cataloging & Check-in</span></p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/avatar_admin_marcus_1792230678680.jpg"
                alt="Marcus Vance"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500/30"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Marcus Vance</h4>
                <p className="text-xs text-slate-500">marcus.vance@campus.edu</p>
                <span className="text-[10px] font-semibold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded uppercase">
                  System Admin
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
              <p>Borrowing Limit: <span className="font-mono font-semibold text-slate-900 dark:text-white">20 Volumes</span></p>
              <p>Access Level: <span className="font-semibold text-slate-900 dark:text-white">Campus Infrastructure Root</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Catalog New Book Volume
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBookSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Book Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Quantum Computing"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Author(s)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phillip Kaye & Raymond Laflamme"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="978-0198570493"
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Physics & Mathematics">Physics & Mathematics</option>
                    <option value="Neuroscience & Biology">Neuroscience & Biology</option>
                    <option value="Philosophy & Mathematics">Philosophy & Mathematics</option>
                    <option value="Architecture & Design">Architecture & Design</option>
                    <option value="History & Civilization">History & Civilization</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Copies
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCopies}
                    onChange={(e) => setNewCopies(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Pages
                  </label>
                  <input
                    type="number"
                    value={newPages}
                    onChange={(e) => setNewPages(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Shelf Location
                </label>
                <input
                  type="text"
                  value={newShelf}
                  onChange={(e) => setNewShelf(e.target.value)}
                  placeholder="e.g. Kepler Hall · 2nd Floor · Shelf 215"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Description / Abstract
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief summary of curriculum topics covered in this book..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
