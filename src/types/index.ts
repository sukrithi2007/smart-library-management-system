export type UserRole = 'student' | 'librarian' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  role: UserRole;
  avatar: string;
  department: string;
  borrowedLimit: number;
  currentBorrowedCount: number;
  joinedDate: string;
  interests: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  coverUrl: string;
  publishYear: number;
  pages: number;
  totalCopies: number;
  availableCopies: number;
  rating: number;
  ratingCount: number;
  shelfLocation: string;
  tags: string[];
  addedDate: string;
  isFeatured?: boolean;
  isStaffPick?: boolean;
}

export interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  bookIsbn: string;
  userId: string;
  userName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string | null;
  renewalCount: number;
  maxRenewals: number;
  status: 'active' | 'returned' | 'overdue';
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  userId: string;
  userName: string;
  reservedDate: string;
  queuePosition: number;
  status: 'waiting' | 'ready_for_pickup' | 'fulfilled' | 'cancelled';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'due_date' | 'overdue' | 'reservation' | 'system' | 'return';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface BookReview {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ReadingGoal {
  targetBooks: number;
  completedBooks: number;
  currentStreakDays: number;
  pagesReadTotal: number;
  favoriteGenre: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export interface DueReminderSettings {
  emailAlerts: boolean;
  browserAlerts: boolean;
  daysNotice: number; // e.g. 3 days before
  overdueFinesEnabled: boolean;
}
