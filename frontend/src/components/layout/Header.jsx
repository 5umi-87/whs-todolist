import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation (Desktop) */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary-main font-bold text-xl">WHS-TodoList</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="ml-10 hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-primary-main dark:hover:text-primary-light px-1 pt-1 font-medium">
                할일
              </Link>
              <Link to="/trash" className="text-gray-700 dark:text-gray-200 hover:text-primary-main dark:hover:text-primary-light px-1 pt-1 font-medium">
                휴지통
              </Link>
              <Link to="/holidays" className="text-gray-700 dark:text-gray-200 hover:text-primary-main dark:hover:text-primary-light px-1 pt-1 font-medium">
                국경일
              </Link>
            </nav>
          </div>

          {/* Right side - User menu and dark mode toggle */}
          <div className="flex items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Menu */}
            {user && (
              <div className="ml-4 relative">
                <button 
                  className="flex items-center text-sm rounded-full focus:outline-none"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{user.username}</span>
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="ml-4 md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block pl-3 pr-4 py-2 border-l-4 border-primary-main text-primary-main bg-primary-50 dark:bg-gray-700 text-base font-medium"
              >
                할일
              </Link>
              <Link
                to="/trash"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 text-base font-medium"
              >
                휴지통
              </Link>
              <Link
                to="/holidays"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 text-base font-medium"
              >
                국경일
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 text-base font-medium"
              >
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;