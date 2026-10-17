import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  UserRole,
  Book,
  Loan,
  Reservation,
  NotificationItem,
  BookReview,
  ReadingGoal,
  ToastMessage,
  DueReminderSettings,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_BOOKS,
  INITIAL_LOANS,
  INITIAL_RESERVATIONS,
  INITIAL_WISHLIST_IDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_READING_GOAL,
} from '../data/initialData';

export type ViewType =
  | 'landing'
  | 'dashboard'
  | 'explore'
  | 'my-books'
  | 'wishlist'
  | 'recommendations'
  | 'analytics'
  | 'admin'
  | 'login';

export type ModalType =
  | null
  | 'scanner'
  | 'ask_librarian'
  | 'due_reminder'
  | 'book_detail'
  | 'forgot_password'
  | 'add_book';

interface LibraryContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentUser: User;
  isLoggedIn: boolean;
  login: (emailOrId: string, role?: UserRole) => boolean;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  books: Book[];
  loans: Loan[];
  reservations: Reservation[];
  wishlistIds: string[];
  notifications: NotificationItem[];
  reviews: BookReview[];
  readingGoal: ReadingGoal;
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  borrowBook: (bookId: string) => boolean;
  returnBook: (loanId: string) => boolean;
  renewBook: (loanId: string) => boolean;
  reserveBook: (bookId: string) => boolean;
  cancelReservation: (reservationId: string) => void;
  toggleWishlist: (bookId: string) => void;
  addBook: (bookData: Omit<Book, 'id' | 'addedDate' | 'rating' | 'ratingCount'>) => void;
  updateBook: (bookId: string, updates: Partial<Book>) => void;
  deleteBook: (bookId: string) => boolean;
  addReview: (bookId: string, rating: number, comment: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  reminderSettings: DueReminderSettings;
  updateReminderSettings: (settings: Partial<DueReminderSettings>) => void;
  downloadBorrowingReportCSV: () => void;
  openBookDetail: (book: Book) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('libraverse_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  // Current User & Session
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('libraverse_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS.student;
      }
    }
    return DEMO_USERS.student;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('libraverse_is_logged_in') !== 'false';
  });

  // Navigation View
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Core Data
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('libraverse_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem('libraverse_loans');
    return saved ? JSON.parse(saved) : INITIAL_LOANS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('libraverse_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('libraverse_wishlist');
    return saved ? JSON.parse(saved) : INITIAL_WISHLIST_IDS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('libraverse_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [reviews, setReviews] = useState<BookReview[]>(() => {
    const saved = localStorage.getItem('libraverse_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [readingGoal, setReadingGoal] = useState<ReadingGoal>(() => {
    const saved = localStorage.getItem('libraverse_reading_goal');
    return saved ? JSON.parse(saved) : INITIAL_READING_GOAL;
  });

  const [reminderSettings, setReminderSettings] = useState<DueReminderSettings>(() => {
    const saved = localStorage.getItem('libraverse_reminder_settings');
    return saved
      ? JSON.parse(saved)
      : {
          emailAlerts: true,
          browserAlerts: true,
          daysNotice: 3,
          overdueFinesEnabled: false,
        };
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('libraverse_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('libraverse_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('libraverse_is_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('libraverse_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('libraverse_loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('libraverse_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('libraverse_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('libraverse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('libraverse_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('libraverse_reading_goal', JSON.stringify(readingGoal));
  }, [readingGoal]);

  useEffect(() => {
    localStorage.setItem('libraverse_reminder_settings', JSON.stringify(reminderSettings));
  }, [reminderSettings]);

  // Toast Helpers
  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auth operations
  const login = (emailOrId: string, targetRole?: UserRole): boolean => {
    const cleanInput = emailOrId.trim().toLowerCase();
    let matchedUser: User | undefined;

    if (targetRole && DEMO_USERS[targetRole]) {
      matchedUser = DEMO_USERS[targetRole];
    } else {
      matchedUser = Object.values(DEMO_USERS).find(
        (u) =>
          u.email.toLowerCase() === cleanInput ||
          (u.studentId && u.studentId.toLowerCase() === cleanInput)
      );
    }

    if (!matchedUser) {
      // Default to student if unrecognized demo test
      matchedUser = DEMO_USERS.student;
    }

    setCurrentUser(matchedUser);
    setIsLoggedIn(true);
    addToast('success', `Welcome back, ${matchedUser.name}!`, `Logged in as ${matchedUser.role.toUpperCase()}`);
    setCurrentView(matchedUser.role === 'admin' ? 'admin' : 'dashboard');
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentView('landing');
    addToast('info', 'Logged Out', 'You have been safely signed out of LibraVerse.');
  };

  const switchDemoRole = (role: UserRole) => {
    const user = DEMO_USERS[role];
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      addToast('info', `Switched Role to ${role.toUpperCase()}`, `Now interacting as ${user.name}`);
      if (role === 'admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('dashboard');
      }
    }
  };

  // Borrowing
  const borrowBook = (bookId: string): boolean => {
    if (!isLoggedIn) {
      addToast('error', 'Login Required', 'Please sign in to borrow books from the library.');
      setCurrentView('login');
      return false;
    }

    const book = books.find((b) => b.id === bookId);
    if (!book) {
      addToast('error', 'Book Not Found', 'The requested volume was not found in the catalog.');
      return false;
    }

    // Check if user currently has this exact book checked out
    const activeUserLoans = loans.filter((l) => l.userId === currentUser.id && l.status === 'active');
    const alreadyBorrowed = activeUserLoans.some((l) => l.bookId === bookId);
    if (alreadyBorrowed) {
      addToast('warning', 'Already Borrowed', `You currently have a copy of "${book.title}" on loan.`);
      return false;
    }

    // Check borrowing limit
    if (activeUserLoans.length >= currentUser.borrowedLimit) {
      addToast(
        'error',
        'Borrowing Limit Reached',
        `Your quota of ${currentUser.borrowedLimit} concurrent volumes is currently full. Return a book to borrow another.`
      );
      return false;
    }

    // Check stock
    if (book.availableCopies <= 0) {
      addToast(
        'warning',
        'No Copies Available',
        'All physical copies are currently checked out. You can click "Reserve My Copy" to join the priority waitlist.'
      );
      return false;
    }

    // Perform borrow
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 21); // 21-day loan

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCover: book.coverUrl,
      bookIsbn: book.isbn,
      userId: currentUser.id,
      userName: currentUser.name,
      borrowDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      returnDate: null,
      renewalCount: 0,
      maxRenewals: 2,
      status: 'active',
    };

    // Update book stock
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b))
    );

    // Update loans
    setLoans((prev) => [newLoan, ...prev]);

    // Update user count
    setCurrentUser((prev) => ({
      ...prev,
      currentBorrowedCount: prev.currentBorrowedCount + 1,
    }));

    // If on wishlist, remove
    setWishlistIds((prev) => prev.filter((id) => id !== bookId));

    // If user had a reservation, fulfill it
    setReservations((prev) =>
      prev.map((r) =>
        r.bookId === bookId && r.userId === currentUser.id ? { ...r, status: 'fulfilled' } : r
      )
    );

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Book Borrowed Successfully',
      message: `You borrowed "${book.title}". Due date is ${dueDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}.`,
      type: 'due_date',
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: 'my-books',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#8b5cf6', '#f59e0b'],
      });
    } catch {
      // safe fallback
    }

    addToast(
      'success',
      'Book Borrowed!',
      `"${book.title}" added to your loans. Due date: ${dueDate.toISOString().split('T')[0]}.`
    );
    return true;
  };

  // Return Book
  const returnBook = (loanId: string): boolean => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) {
      addToast('error', 'Loan Not Found', 'Could not locate this circulation record.');
      return false;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Mark loan returned
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, returnDate: todayStr, status: 'returned' } : l))
    );

    // Restore book available copy
    setBooks((prev) =>
      prev.map((b) => (b.id === loan.bookId ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) } : b))
    );

    // Update user active count
    setCurrentUser((prev) => ({
      ...prev,
      currentBorrowedCount: Math.max(0, prev.currentBorrowedCount - 1),
    }));

    // Increment reading goal
    const returnedBook = books.find((b) => b.id === loan.bookId);
    setReadingGoal((prev) => ({
      ...prev,
      completedBooks: prev.completedBooks + 1,
      pagesReadTotal: prev.pagesReadTotal + (returnedBook ? returnedBook.pages : 350),
    }));

    // Check waiting reservations: notify first person
    const waitingRes = reservations
      .filter((r) => r.bookId === loan.bookId && r.status === 'waiting')
      .sort((a, b) => a.queuePosition - b.queuePosition)[0];

    if (waitingRes) {
      setReservations((prev) =>
        prev.map((r) => (r.id === waitingRes.id ? { ...r, status: 'ready_for_pickup' } : r))
      );
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}-res`,
          userId: waitingRes.userId,
          title: 'Reserved Copy Ready!',
          message: `Your reserved copy of "${waitingRes.bookTitle}" has been returned and is waiting at the Circulation Desk.`,
          type: 'reservation',
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: 'explore',
        },
        ...prev,
      ]);
    }

    addToast(
      'success',
      'Book Returned',
      `"${loan.bookTitle}" has been checked in. Reading journey updated!`
    );
    return true;
  };

  // Renew Book
  const renewBook = (loanId: string): boolean => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) {
      addToast('error', 'Loan Not Found', 'Could not find loan record.');
      return false;
    }

    if (loan.status === 'returned') {
      addToast('warning', 'Already Returned', 'This volume has already been returned.');
      return false;
    }

    if (loan.renewalCount >= loan.maxRenewals) {
      addToast(
        'error',
        'Renewal Limit Reached',
        `Maximum ${loan.maxRenewals} renewals allowed for this title. Please return to allow others access.`
      );
      return false;
    }

    // Check if another student has reserved it
    const hasWaitingReservations = reservations.some(
      (r) => r.bookId === loan.bookId && r.status === 'waiting'
    );
    if (hasWaitingReservations) {
      addToast(
        'warning',
        'Renewal Unavailable',
        'Another student is waiting in the reservation queue for this copy. Renewals are paused.'
      );
      return false;
    }

    // Extend due date by 14 days
    const currentDue = new Date(loan.dueDate);
    currentDue.setDate(currentDue.getDate() + 14);
    const newDueDateStr = currentDue.toISOString().split('T')[0];

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              dueDate: newDueDateStr,
              renewalCount: l.renewalCount + 1,
            }
          : l
      )
    );

    addToast(
      'success',
      'Loan Renewed',
      `Extended by 14 days! New due date: ${newDueDateStr}. (${loan.renewalCount + 1}/${loan.maxRenewals} renewals used)`
    );
    return true;
  };

  // Reserve Book
  const reserveBook = (bookId: string): boolean => {
    if (!isLoggedIn) {
      addToast('error', 'Login Required', 'Please sign in to reserve books.');
      setCurrentView('login');
      return false;
    }

    const book = books.find((b) => b.id === bookId);
    if (!book) return false;

    // Check if already reserved
    const existing = reservations.find(
      (r) => r.bookId === bookId && r.userId === currentUser.id && (r.status === 'waiting' || r.status === 'ready_for_pickup')
    );
    if (existing) {
      addToast('warning', 'Already Reserved', `You are already on the reservation list for "${book.title}".`);
      return false;
    }

    const queueCount = reservations.filter(
      (r) => r.bookId === bookId && r.status === 'waiting'
    ).length;

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookCover: book.coverUrl,
      userId: currentUser.id,
      userName: currentUser.name,
      reservedDate: new Date().toISOString().split('T')[0],
      queuePosition: queueCount + 1,
      status: 'waiting',
    };

    setReservations((prev) => [...prev, newRes]);

    addToast(
      'success',
      'Copy Reserved',
      `You are #${queueCount + 1} in the waiting queue for "${book.title}". We'll notify you as soon as a copy is checked in.`
    );
    return true;
  };

  const cancelReservation = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'cancelled' } : r))
    );
    addToast('info', 'Reservation Cancelled', 'Your reservation has been removed.');
  };

  // Wishlist
  const toggleWishlist = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    setWishlistIds((prev) => {
      const exists = prev.includes(bookId);
      if (exists) {
        addToast('info', 'Removed from Wishlist', `"${book?.title || 'Book'}" removed.`);
        return prev.filter((id) => id !== bookId);
      } else {
        addToast('success', 'Added to Wishlist', `"${book?.title || 'Book'}" saved for later.`);
        return [...prev, bookId];
      }
    });
  };

  // Admin / Librarian Catalog Management
  const addBook = (bookData: Omit<Book, 'id' | 'addedDate' | 'rating' | 'ratingCount'>) => {
    const newBook: Book = {
      ...bookData,
      id: `book-custom-${Date.now()}`,
      addedDate: new Date().toISOString().split('T')[0],
      rating: 5.0,
      ratingCount: 1,
    };
    setBooks((prev) => [newBook, ...prev]);
    addToast('success', 'Book Cataloged', `"${newBook.title}" successfully added to the collection.`);
  };

  const updateBook = (bookId: string, updates: Partial<Book>) => {
    setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, ...updates } : b)));
    addToast('success', 'Catalog Updated', 'Book details have been saved.');
  };

  const deleteBook = (bookId: string): boolean => {
    const active = loans.some((l) => l.bookId === bookId && l.status === 'active');
    if (active) {
      addToast('error', 'Cannot Delete', 'This book has active student loans checked out.');
      return false;
    }
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    addToast('info', 'Book Removed', 'Book has been removed from library records.');
    return true;
  };

  const addReview = (bookId: string, rating: number, comment: string) => {
    const newRev: BookReview = {
      id: `rev-${Date.now()}`,
      bookId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newRev, ...prev]);
    addToast('success', 'Review Published', 'Thank you for sharing your thoughts on this volume.');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('info', 'Notifications Cleared', 'All alerts marked as read.');
  };

  const updateReminderSettings = (settings: Partial<DueReminderSettings>) => {
    setReminderSettings((prev) => ({ ...prev, ...settings }));
    addToast('success', 'Preferences Updated', 'Your due date reminder settings were saved.');
  };

  // CSV Report Generator
  const downloadBorrowingReportCSV = () => {
    const userLoans = loans.filter((l) => l.userId === currentUser.id);
    if (userLoans.length === 0) {
      addToast('warning', 'No Records', 'You do not have any borrowing records to export.');
      return;
    }

    const headers = ['Loan ID', 'Book Title', 'Author', 'ISBN', 'Borrow Date', 'Due Date', 'Return Date', 'Status', 'Renewals'];
    const rows = userLoans.map((l) => [
      `"${l.id}"`,
      `"${l.bookTitle.replace(/"/g, '""')}"`,
      `"${l.bookAuthor.replace(/"/g, '""')}"`,
      `"${l.bookIsbn}"`,
      `"${l.borrowDate}"`,
      `"${l.dueDate}"`,
      `"${l.returnDate || 'N/A'}"`,
      `"${l.status.toUpperCase()}"`,
      `"${l.renewalCount}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `libraverse_reading_report_${currentUser.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Report Exported', 'Downloaded your official borrowing statement as CSV.');
  };

  const openBookDetail = (book: Book) => {
    setSelectedBook(book);
    setActiveModal('book_detail');
  };

  return (
    <LibraryContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        isLoggedIn,
        login,
        logout,
        switchDemoRole,
        currentView,
        setCurrentView,
        books,
        loans,
        reservations,
        wishlistIds,
        notifications,
        reviews,
        readingGoal,
        activeModal,
        setActiveModal,
        selectedBook,
        setSelectedBook,
        toasts,
        addToast,
        removeToast,
        borrowBook,
        returnBook,
        renewBook,
        reserveBook,
        cancelReservation,
        toggleWishlist,
        addBook,
        updateBook,
        deleteBook,
        addReview,
        markNotificationRead,
        markAllNotificationsRead,
        reminderSettings,
        updateReminderSettings,
        downloadBorrowingReportCSV,
        openBookDetail,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
