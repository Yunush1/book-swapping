import {createContext, useContext} from 'react'
const AppContext = createContext({
  isAuthenticated: false,
  user: null,
  currentView: '',
  setCurrentView: (view: string) => {},
  books: [],
  myBooks: [],
  requests: [],
  selectedBook: null,
  setSelectedBook: (book: any) => {},
  editingBook: null,
  setEditingBook: (book: any) => {},
  showRequestModal: false,
  setShowRequestModal: (show: boolean) => {},
  showMobileMenu: false,
  setShowMobileMenu: (show: boolean) => {},
  login: (user: any) => {},
  logout: () => {},
  addBook: (book: any) => {},
  updateBook: (book: any) => {},
  addRequest: (request: any) => {},
  updateRequestStatus: (id: number, status: string) => {},
});



const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export { AppContext, useAppContext };