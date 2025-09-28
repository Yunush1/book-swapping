'use client'
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Search, Plus, Book, User, LogOut, Bell, Eye, Heart, MessageSquare, Filter, Star, MapPin, Calendar, Clock, Check, X, ArrowLeft, Menu, XIcon, Edit } from 'lucide-react';
import { loginUser, register } from '@/services/auth/auth';
import { userAgent } from 'next/server';
import { sign } from 'crypto';
import { createExchangeRequest, getExchanges, getMyExchangeRequest, getMyExchanges } from '@/services/exchanges/exchanges';
import { useRouter } from 'next/navigation';

// Context for global state management
const AppContext = createContext({
  isAuthenticated: false,
  user: null,
  currentView: '',
  setCurrentView: (view: string) => { },
  books: [],
  getAllBooks: async () => { },
  myBooks: [],
  requests: [],
  selectedBook: null,
  setSelectedBook: (book: any) => { },
  editingBook: null,
  setEditingBook: (book: any) => { },
  showRequestModal: false,
  setShowRequestModal: (show: boolean) => { },
  showMobileMenu: false,
  setShowMobileMenu: (show: boolean) => { },
  login: (user: any) => { },
  signup: (user: any) => { },
  logout: () => { },
  addBook: (book: any) => { },
  updateBook: (book: any) => { },
  addRequest: (request: any) => { },
  updateRequestStatus: (id: number, status: Number) => { },
  isLoading: false,
  error: null,
});

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Mock data for fallback
const mockBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    description: "Classic American novel in good condition. Some wear on cover but pages are intact.",
    genre: "Fiction",
    language: "English",
    owner: { id: 1, name: "John Doe", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", location: "New York", rating: 4.8 },
    postedAt: "2024-01-15",
    available: true
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    condition: "Excellent",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    description: "Pristine condition, barely used. Perfect for book lovers.",
    genre: "Fiction",
    language: "English",
    owner: { id: 2, name: "Jane Smith", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face", location: "Los Angeles", rating: 4.9 },
    postedAt: "2024-01-20",
    available: true
  }
];

const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  location: "New York",
  memberSince: "2023-06-15",
  booksShared: 12,
  rating: 4.8,
  bio: "Avid reader and book lover. Always looking for great reads to share!"
};

// Components
const Header = () => {
  const { currentView, setCurrentView, user, logout, isAuthenticated, setShowMobileMenu, showMobileMenu } = useAppContext();

  if (!isAuthenticated) return null;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Book className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BookSwap</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentView('browse')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === 'browse'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Browse Books
              </button>
              <button
                onClick={() => setCurrentView('myBooks')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === 'myBooks'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                My Books
              </button>
              <button
                onClick={() => setCurrentView('requests')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === 'requests'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Requests
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center space-x-3">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t">
            <nav className="space-y-2">
              <button
                onClick={() => {
                  setCurrentView('browse');
                  setShowMobileMenu(false);
                }}
                className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === 'browse'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Browse Books
              </button>
              <button
                onClick={() => {
                  setCurrentView('myBooks');
                  setShowMobileMenu(false);
                }}
                className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === 'myBooks'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                My Books
              </button>
              <button
                onClick={() => {
                  setCurrentView('requests');
                  setShowMobileMenu(false);
                }}
                className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === 'requests'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Requests
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

const AuthForm = () => {
  const { login, signup, isLoading, error } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    mobileNumber: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData);
      } else {
        await signup(formData);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Book className="w-10 h-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">BookSwap</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">
            {isLogin ? 'Welcome Back' : 'Join Our Community'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isLogin ? 'Sign in to your account' : 'Create your account to start swapping books'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  required={!isLogin}
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your mobile number"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? (isLogin ? 'Signing In...' : 'Creating Account...')
              : (isLogin ? 'Sign In' : 'Create Account')
            }
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700 font-medium"
            disabled={isLoading}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

const BookCard = ({ book, onRequest, showRequestButton = true }: any) => {
  const { setSelectedBook, setCurrentView } = useAppContext();

  const handleViewDetails = () => {
    setSelectedBook(book);
    setCurrentView('bookDetails');
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-64 object-cover"
        />
        {!book.available && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Not Available
          </div>
        )}
        <div className="absolute bottom-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(book.condition)}`}>
            {book.condition}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
        <p className="text-gray-500 text-sm mb-3">{book.description}</p>

        <div className="flex items-center space-x-2 mb-3">
          <img
            src={book.owner.avatar}
            alt={book.owner.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-700">{book.owner.name}</span>
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            {book.owner.location}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleViewDetails}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>

          {showRequestButton && book.available && (
            <button
              onClick={() => onRequest(book)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Request Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const BrowseBooks = () => {
  const { books, setShowRequestModal, setSelectedBook, isLoading, getAllBooks } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCondition = filterCondition === 'all' || book.condition.toLowerCase() === filterCondition;
      return matchesSearch && matchesCondition;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        case 'oldest':
          return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleRequest = (book: any) => {
    setSelectedBook(book);
    setShowRequestModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Browse Books</h1>
          <button
            onClick={getAllBooks}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Conditions</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading books...</span>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onRequest={handleRequest}
                showRequestButton={true}
              />
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Simplified MyBooks component for space
const MyBooks = () => {
  const router = useRouter();
  const { myBooks, setCurrentView, setEditingBook, isLoading } = useAppContext();

  const handleAddBook = () => {
    setEditingBook(null);
    router.push('/books/add-books')
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
        <button
          onClick={handleAddBook}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Book</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading your books...</span>
        </div>
      ) : myBooks.length === 0 ? (
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No books yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first book to share with the community</p>
          <button
            onClick={handleAddBook}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Add Your First Book
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onRequest={() => { }}
              showRequestButton={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Simplified other components...
const RequestsPage = () => {
  const { requests, updateRequestStatus, isLoading, user } = useAppContext();
  const [activeTab, setActiveTab] = useState('received');

  const STATUS = {
    ON_GOING: 400,
    COMPLETED: 401,
    OPEN: 402,
    PENDING: 403,
    ACCEPTED: 404,
    DECLINED: 405,
    REQUEST: 406,
  } as const;
  const getRequestStatus = (status: Number) => {
    switch (status) {
      case STATUS.ON_GOING:
        return "On Going"
      case STATUS.COMPLETED:
        return "Completed"
      case STATUS.OPEN:
        return "Open"
      case STATUS.PENDING:
        return "Pending"
      case STATUS.ACCEPTED:
        return "Accepted"
      case STATUS.DECLINED:
        return "Declined"
      case STATUS.REQUEST:
        return "Request"
      default:
        return "Unknown"
    }
  }
  // Filter requests based on user role (received vs sent)
  const receivedRequests = requests.filter(req => req.ownerId === user?.id);
  const sentRequests = requests.filter(req => req.requesterId === user?.id);

  const handleRequestAction = async (requestId: string, action: Number) => {
    try {
      updateRequestStatus(Number(requestId), action);
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case STATUS.PENDING: return 'text-amber-700 bg-amber-50 border-amber-200';
      case STATUS.ACCEPTED: return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case STATUS.DECLINED: return 'text-red-700 bg-red-50 border-red-200';
      case STATUS.COMPLETED: return 'text-blue-700 bg-blue-50 border-blue-200';
      case STATUS.ON_GOING: return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case STATUS.OPEN: return 'text-gray-700 bg-gray-50 border-gray-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  // Map icons
  const getStatusIcon = (status: number) => {
    switch (status) {
      case STATUS.PENDING: return <Clock className="w-4 h-4" />;
      case STATUS.ACCEPTED: return <Check className="w-4 h-4" />;
      case STATUS.DECLINED: return <X className="w-4 h-4" />;
      case STATUS.COMPLETED: return <Star className="w-4 h-4" />;
      case STATUS.ON_GOING: return <Clock className="w-4 h-4" />;
      case STATUS.OPEN: return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Book Requests</h1>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <span className="text-gray-600 font-medium">Loading your requests...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <MessageSquare className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Book Requests</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Received</p>
              <p className="text-2xl font-bold text-blue-900">{receivedRequests.length}</p>
            </div>
            <div className="p-2 bg-blue-200 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Accepted</p>
              <p className="text-2xl font-bold text-emerald-900">
                {receivedRequests.filter(r => r.status === STATUS.ACCEPTED).length}
              </p>
            </div>
            <div className="p-2 bg-emerald-200 rounded-lg">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-amber-900">
                {receivedRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="p-2 bg-amber-200 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Sent Requests</p>
              <p className="text-2xl font-bold text-purple-900">{sentRequests.length}</p>
            </div>
            <div className="p-2 bg-purple-200 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Enhanced Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-6 px-8 text-base font-semibold transition-all duration-200 ${activeTab === 'received'
                ? 'text-blue-700 border-b-3 border-blue-600 bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Received ({receivedRequests.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-6 px-8 text-base font-semibold transition-all duration-200 ${activeTab === 'sent'
                ? 'text-blue-700 border-b-3 border-blue-600 bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Sent ({sentRequests.length})</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'received' && (
            <div className="space-y-6">
              {receivedRequests.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <MessageSquare className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No requests yet</h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">
                    When someone requests your books, they'll appear here. Start sharing your books to get requests!
                  </p>
                </div>
              ) : (
                receivedRequests.map((request, index) => (
                  <div
                    key={request.id}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start space-x-6">
                      {/* Book Image */}
                      {request.bookImage && (
                        <div className="flex-shrink-0">
                          <img
                            src={request.bookImage}
                            alt={request.bookTitle}
                            className="w-20 h-26 object-cover rounded-lg shadow-md border border-gray-200"
                          />
                        </div>
                      )}

                      {/* Request Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={request.user.image}
                              alt={request.user.name}
                              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                            />
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{request.user.name}</h3>
                              <p className="text-gray-600">wants to borrow</p>
                              <p className="text-lg font-semibold text-blue-600">"{request.exchange.title}"</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              <span>{getRequestStatus(request.status).charAt(0).toUpperCase() + getRequestStatus(request.status).slice(1)}</span>
                            </span>
                          </div>
                        </div>

                        {/* Message */}
                        {request.message && (
                          <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                            <p className="text-gray-800 italic">"{request.message}"</p>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Requested on {new Date(request.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {request.status === STATUS.PENDING && (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleRequestAction(request._id, STATUS.DECLINED)}
                                className="inline-flex items-center px-4 py-2 border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all duration-200 font-medium"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Decline
                              </button>
                              <button
                                onClick={() => handleRequestAction(request._id, STATUS.ACCEPTED)}
                                className="inline-flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Accept
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'sent' && (
            <div className="space-y-6">
              {sentRequests.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <ArrowLeft className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No sent requests</h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">
                    When you request books from others, they'll appear here. Browse books to make your first request!
                  </p>
                </div>
              ) : (
                sentRequests.map((request, index) => (
                  <div
                    key={request.id}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start space-x-6">
                      {/* Book Image */}
                      {request.bookImage && (
                        <div className="flex-shrink-0">
                          <img
                            src={request.bookImage}
                            alt={request.bookTitle}
                            className="w-20 h-26 object-cover rounded-lg shadow-md border border-gray-200"
                          />
                        </div>
                      )}

                      {/* Request Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">"{request.exchange.title}"</h3>
                            <p className="text-gray-600">Request sent to <span className="font-medium">{request.owner.name}</span></p>
                          </div>
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span>{getRequestStatus(request.status).charAt(0).toUpperCase() + getRequestStatus(request.status).slice(1)}</span>
                          </span>
                        </div>

                        {/* Message */}
                        {request.message && (
                          <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                            <p className="text-gray-800 italic">"{request.message}"</p>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Sent on {new Date(request.requestedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AddBookForm = () => (
  <div className="max-w-2xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Book Form</h1>
    <div className="text-center py-12">
      <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">Add book form coming soon</h3>
    </div>
  </div>
);

const BookDetails = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Details</h1>
    <div className="text-center py-12">
      <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">Book details coming soon</h3>
    </div>
  </div>
);

const RequestModal = () => {
  const { showRequestModal, setShowRequestModal, selectedBook, addRequest, isLoading } = useAppContext();
  const [message, setMessage] = useState('');

  if (!showRequestModal || !selectedBook) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRequest = {
        bookId: selectedBook.id,
        message: message,
        owner: selectedBook.owner,
      };

      await addRequest(newRequest);
      setMessage('');
      setShowRequestModal(false);
    } catch (error) {
      console.error('Request error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Request Book</h2>
          <button
            onClick={() => setShowRequestModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={selectedBook.image}
              alt={selectedBook.title}
              className="w-16 h-20 object-cover rounded"
            />
            <div>
              <h3 className="font-medium text-gray-900">{selectedBook.title}</h3>
              <p className="text-sm text-gray-600">by {selectedBook.author}</p>
              <p className="text-sm text-gray-500">Owner: {selectedBook.owner.name}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Owner
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell the owner why you'd like this book or what you can offer in return..."
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setShowRequestModal(false)}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App Provider Component
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('browse');
  const [books, setBooks] = useState(mockBooks); // Start with mock data as fallback
  const [myBooks, setMyBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fixed login function with proper error handling
  const login = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await loginUser({
        email: userData.email,
        password: userData.password
      });

      // Store tokens and user info
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken); // Fixed typo
        localStorage.setItem('user', JSON.stringify(res.user));
      }

      setUser(res.user);
      setIsAuthenticated(true);
      setCurrentView('browse');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed signup function
  const signup = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await register(userData);

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.user));
      }

      setUser(res.user);
      setIsAuthenticated(true);
      setCurrentView('browse');
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Improved data formatting function
  const formatBooksData = (data: any[]) => {
    if (!Array.isArray(data)) {
      console.warn('Invalid data format received:', data);
      return [];
    }

    return data.map((book: any) => ({
      id: book._id || book.id,
      title: book.title || 'Untitled',
      author: book.author || 'Unknown Author',
      condition: mapCondition(book.condition),
      image: book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      description: book.description || 'No description available',
      genre: book.genre || 'General',
      language: book.language || 'English',
      owner: {
        id: book.createdBy?._id || book.createdBy?.id,
        name: book.createdBy?.name || 'Unknown User',
        avatar: book.createdBy?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        location: book.createdBy?.location || 'Unknown Location',
        rating: book.createdBy?.rating || 4.5,
      },
      postedAt: book.createdAt || new Date().toISOString(),
      available: mapAvailability(book.status),
    }));
  };

  // Helper function to map condition codes
  const mapCondition = (condition: any) => {
    if (typeof condition === 'string') return condition;
    switch (condition) {
      case 1200: return 'Good';
      case 1300: return 'Excellent';
      case 1100: return 'Fair';
      default: return 'Good';
    }
  };

  // Helper function to map availability status
  const mapAvailability = (status: any) => {
    if (typeof status === 'boolean') return status;
    switch (status) {
      case 400: return true;
      case 500: return false;
      default: return true;
    }
  };

  // Fixed getAllBooks function
  const getAllBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getExchanges();

      // Handle different response structures
      let booksData = [];
      if (res?.exchanges?.totalItems) {
        booksData = res.exchanges.totalItems;
      } else if (res?.data) {
        booksData = res.data;
      } else if (Array.isArray(res)) {
        booksData = res;
      } else {
        console.warn('Unexpected API response structure:', res);
        // Keep existing books if API call fails
        return;
      }

      const transformedBooks = formatBooksData(booksData);

      if (transformedBooks.length > 0) {
        setBooks(transformedBooks);
      } else {
        console.log('No books received from API, keeping existing data');
      }
    } catch (error: any) {
      console.error("Error fetching books:", error);
      setError('Failed to load books. Please try again.');
      // Don't clear existing books on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed getMyBooks function
  const getMyBooks = async () => {
    setIsLoading(true);
    try {
      const res = await getMyExchanges();
      console.log('ncjkdcnd', res)
      let booksData = [];
      if (res?.exchanges) {
        booksData = res.exchanges;
      } else if (res?.data) {
        booksData = res.data;
      } else if (Array.isArray(res)) {
        booksData = res;
      }

      const transformedBooks = formatBooksData(booksData);
      setMyBooks(transformedBooks);
    } catch (error: any) {
      console.error('Error fetching user books:', error);
      setError('Failed to load your books.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed getMyExchangeRequests function
  const getMyExchangeRequests = async () => {
    setIsLoading(true);
    try {
      const { data: res } = await getMyExchangeRequest();

      // Process requests data based on actual API response
      if (res?.data || res?.requests) {
        const requestsData = res.data || [];
        setRequests(Array.isArray(requestsData) ? requestsData : []);
      }
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      setError('Failed to load requests.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');

      if (accessToken && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.clear();
        }
      }
    }
  }, []);

  // Load data when view changes
  useEffect(() => {
    if (!isAuthenticated) return;

    switch (currentView) {
      case 'browse':
        getAllBooks();
        break;
      case 'myBooks':
        getMyBooks();
        break;
      case 'requests':
        getMyExchangeRequests();
        break;
    }
  }, [currentView, isAuthenticated]);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('browse');
    setBooks(mockBooks); // Reset to mock data
    setMyBooks([]);
    setRequests([]);

    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  };

  // Fixed addRequest function
  const addRequest = async (requestData: any) => {
    setIsLoading(true);
    try {
      // Prepare request data in the format expected by your API
      const payload = {
        bookId: requestData.bookId,
        message: requestData.message,
        owner: requestData.owner,
        // Add other required fields based on your API
      };

      await createExchangeRequest(payload);

      // Refresh requests after successful creation
      await getMyExchangeRequests();

    } catch (error: any) {
      console.error('Error creating request:', error);
      throw error; // Re-throw so RequestModal can handle it
    } finally {
      setIsLoading(false);
    }
  };

  const addBook = (bookData: any) => {
    const newBook = { ...bookData, id: Date.now() };
    setBooks([...books, newBook]);
    setMyBooks([...myBooks, newBook]);
  };

  const updateBook = (updatedBook: any) => {
    setBooks(books.map(book => book.id === updatedBook.id ? updatedBook : book));
    setMyBooks(myBooks.map(book => book.id === updatedBook.id ? updatedBook : book));
  };

  const updateRequestStatus = (requestId: number, status: number) => {
    setRequests(requests.map(request =>
      request.id === requestId ? { ...request, status } : request
    ));
  };

  const value = {
    isAuthenticated,
    user,
    currentView,
    setCurrentView,
    books,
    myBooks,
    requests,
    selectedBook,
    setSelectedBook,
    getAllBooks,
    editingBook,
    setEditingBook,
    showRequestModal,
    setShowRequestModal,
    showMobileMenu,
    setShowMobileMenu,
    login,
    signup,
    logout,
    addBook,
    updateBook,
    addRequest,
    updateRequestStatus,
    isLoading,
    error,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const BookSwapApp = () => {
  const { isAuthenticated, currentView } = useAppContext();

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'browse':
        return <BrowseBooks />;
      case 'myBooks':
        return <MyBooks />;
      case 'addBook':
        return <AddBookForm />;
      case 'requests':
        return <RequestsPage />;
      case 'bookDetails':
        return <BookDetails />;
      default:
        return <BrowseBooks />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {renderCurrentView()}
      </main>
      <RequestModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BookSwapApp />
    </AppProvider>
  );
}