// components/layout/NavBar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { FaMoon, FaSun, FaSignOutAlt, FaBars, FaTimes, FaStickyNote, FaUser, FaCog } from 'react-icons/fa';

export default function NavBar({ darkMode, toggleDarkMode, user }) {
  const [menuState, setMenuState] = useState({
    mobile: false,
    dropdown: false,
    scrolled: false
  });
  const navigate = useNavigate();
  const refs = {
    mobileMenu: useRef(null),
    mobileButton: useRef(null),
    dropdown: useRef(null)
  };

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== menuState.scrolled) {
        setMenuState(prev => ({ ...prev, scrolled: isScrolled }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuState.scrolled]);

  // Handle clicks outside menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check mobile menu
      if (
        menuState.mobile &&
        refs.mobileMenu.current &&
        !refs.mobileMenu.current.contains(event.target) &&
        refs.mobileButton.current &&
        !refs.mobileButton.current.contains(event.target)
      ) {
        setMenuState(prev => ({ ...prev, mobile: false }));
      }

      // Check dropdown
      if (
        menuState.dropdown &&
        refs.dropdown.current &&
        !refs.dropdown.current.contains(event.target)
      ) {
        setMenuState(prev => ({ ...prev, dropdown: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuState.mobile, menuState.dropdown]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      navigate('/signin', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Toggle functions
  const toggles = {
    mobile: () => setMenuState(prev => ({ ...prev, mobile: !prev.mobile })),
    dropdown: () => setMenuState(prev => ({ ...prev, dropdown: !prev.dropdown })),
    closeAll: () => setMenuState(prev => ({ ...prev, mobile: false, dropdown: false }))
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        menuState.scrolled 
          ? 'py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' 
          : 'py-3 bg-white dark:bg-gray-900'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/notes" className="flex items-center gap-2 cursor-pointer group">
          <div className="bg-pink-500 p-2 rounded-lg transform transition-transform group-hover:rotate-12 duration-300">
            <FaStickyNote className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold text-pink-500">
            Notes
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
          </button>

          {/* User dropdown */}
          {user && (
            <div className="relative" ref={refs.dropdown}>
              <button
                onClick={toggles.dropdown}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="h-8 w-8 rounded-full" />
                  ) : (
                    <FaUser />
                  )}
                </div>
                <span className="hidden md:block font-medium truncate max-w-[120px]">
                  {user.displayName || (user.email ? user.email.split('@')[0] : 'User')}
                </span>
              </button>

              {/* Dropdown menu */}
              {menuState.dropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10 bg-white dark:bg-gray-700 text-gray-800 dark:text-white ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center"
                    onClick={toggles.closeAll}
                  >
                    <FaUser className="mr-2 text-pink-500" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center"
                    onClick={toggles.closeAll}
                  >
                    <FaCog className="mr-2 text-pink-500" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      toggles.closeAll();
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600 dark:text-red-300 hover:text-red-700 transition-colors flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            ref={refs.mobileButton}
            onClick={toggles.mobile}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none transition-colors"
          >
            {menuState.mobile ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuState.mobile && (
        <div 
          ref={refs.mobileMenu}
          className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg overflow-hidden z-40"
        >
          <div className="flex flex-col p-2 gap-2">
            {/* User info */}
            {user && (
              <div className="flex items-center gap-2 p-3 border-b border-gray-100 dark:border-gray-700">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="h-8 w-8 rounded-full" />
                  ) : (
                    user.email ? user.email.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium dark:text-white">
                    {user.displayName || (user.email ? user.email.split('@')[0] : 'User')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email || 'No email'}
                  </div>
                </div>
              </div>
            )}
            
            {/* Mobile menu links */}
            {[
              { to: "/profile", icon: <FaUser className="w-5 h-5 text-pink-500" />, text: "Profile" },
              { to: "/settings", icon: <FaCog className="w-5 h-5 text-pink-500" />, text: "Settings" }
            ].map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={toggles.closeAll}
              >
                {item.icon}
                <span className="text-gray-900 dark:text-white">{item.text}</span>
              </Link>
            ))}
            
            {/* Dark mode toggle */}
            <button
              onClick={() => {
                toggleDarkMode();
                toggles.closeAll();
              }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left"
            >
              {darkMode ? (
                <>
                  <FaSun className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-900 dark:text-white">Light Mode</span>
                </>
              ) : (
                <>
                  <FaMoon className="w-5 h-5 text-pink-500" />
                  <span className="text-gray-900 dark:text-white">Dark Mode</span>
                </>
              )}
            </button>
            
            {/* Logout button */}
            {user && (
              <button
                onClick={() => {
                  toggles.closeAll();
                  handleLogout();
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left"
              >
                <FaSignOutAlt className="w-5 h-5 text-red-500" />
                <span className="text-gray-900 dark:text-white">Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}