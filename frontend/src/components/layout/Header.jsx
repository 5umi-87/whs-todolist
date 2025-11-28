import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode, initializeDarkMode } = useUiStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  useEffect(() => {
    initializeDarkMode();
  }, [initializeDarkMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('#user-menu-button')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-background-white dark:bg-dark-background shadow-google-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation (Desktop) */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary-main font-bold text-xl">WHS-TodoList</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="ml-10 hidden md:flex space-x-8">
              <Link to="/" className="text-text-primary dark:text-dark-text hover:text-primary-main dark:hover:text-primary-main px-1 pt-1 font-medium text-sm">
                할일
              </Link>
              <Link to="/trash" className="text-text-primary dark:text-dark-text hover:text-primary-main dark:hover:text-primary-main px-1 pt-1 font-medium text-sm">
                휴지통
              </Link>
              <Link to="/holidays" className="text-text-primary dark:text-dark-text hover:text-primary-main dark:hover:text-primary-main px-1 pt-1 font-medium text-sm">
                국경일
              </Link>
            </nav>
          </div>

          {/* Right side - User menu and dark mode toggle */}
          <div className="flex items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-text-primary dark:text-dark-text hover:bg-hover-gray dark:hover:bg-gray-700 focus:outline-none"
              aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Menu */}
            {user && (
              <div className="ml-4 relative hidden md:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-sm focus:outline-none text-text-primary dark:text-dark-text hover:text-primary-main dark:hover:text-primary-main"
                  id="user-menu-button"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="font-medium">{user.username}</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background-white dark:bg-dark-surface rounded shadow-google-md py-1 border border-border-gray dark:border-gray-700">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-text-primary dark:text-dark-text hover:bg-hover-gray dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      프로필
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-text-primary dark:text-dark-text hover:bg-hover-gray dark:hover:bg-gray-700"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <div className="ml-4 md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-text-primary dark:text-dark-text hover:bg-hover-gray dark:hover:bg-gray-700 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">메뉴 열기</span>
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
                className="block pl-3 pr-4 py-2 border-l-4 border-primary-main text-primary-main bg-primary-light dark:bg-gray-700 text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                할일
              </Link>
              <Link
                to="/trash"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-text-primary dark:text-dark-text hover:bg-hover-gray dark:hover:bg-gray-700 hover:border-border-gray text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                휴지통
              </Link>
              <Link
                to="/holidays"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-text-primary dark:text-dark-text hover:bg-hover-gray dark:hover:bg-gray-700 hover:border-border-gray text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                국경일
              </Link>
              <Link
                to="/profile"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-text-primary dark:text-dark-text hover:bg-hover-gray dark:hover:bg-gray-700 hover:border-border-gray text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                프로필
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-text-primary dark:text-dark-text hover:bg-hover-gray dark:hover:bg-gray-700 hover:border-border-gray text-sm font-medium"
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
