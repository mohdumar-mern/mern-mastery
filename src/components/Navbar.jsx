import React, { memo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../app/api/apiSlice/auth/authSlice';
import { useLogoutMutation } from '../app/api/apiSlice/auth/authApiSlice';

const Navbar = memo(() => {
  const { user, token } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutMutation, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Memoized logout handler
  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.data?.message || 'Logout failed');
    } finally {
      setMobileMenuOpen(false); // Ensure mobile menu closes
    }
  }, [logoutMutation, dispatch, navigate]);

  // Memoized menu toggle
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  // Navigation items (DRY principle)
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
    ...(token
      ? [{ onClick: handleLogout, label: isLoading ? 'Logging out...' : 'Logout', disabled: isLoading }]
      : [{ to: '/login', label: 'Login' }]),
  ];

  return (
    <nav
      className="bg-gray-800 text-white shadow-lg sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
              MERN Mastery
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item, index) =>
              item.to ? (
                <Link
                  key={index}
                  to={item.to}
                  className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  aria-label={`Go to ${item.label}`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50 transition-colors"
                  aria-label={`Logout ${item.label}`}
                >
                  {item.label}
                </button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item, index) =>
              item.to ? (
                <Link
                  key={index}
                  to={item.to}
                  className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                  onClick={toggleMobileMenu}
                  aria-label={`Go to ${item.label} from mobile menu`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    toggleMobileMenu();
                  }}
                  disabled={item.disabled}
                  className="block w-full text-left hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium disabled:opacity-50"
                  aria-label={`Logout ${item.label} from mobile menu`}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = 'Navbar'; // For debugging in React DevTools

export default Navbar;