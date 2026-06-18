import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut,
  FiHeart, FiPackage, FiSettings, FiTruck, FiBarChart2
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === 'shopkeeper') return '/seller/dashboard';
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'delivery') return '/delivery';
    return '/profile';
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            <span className="font-bold text-xl text-green-700">ApnaDukaan</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              Home
            </Link>

            <Link to="/shops" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              Shops
            </Link>

            {/* ✅ Packs (only for customers or guests) */}
            {(!user || user.role === 'customer') && (
              <Link to="/packs" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Packs
              </Link>
            )}

            {user?.role === 'customer' && (
              <>
                <Link to="/orders" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                  Orders
                </Link>
                <Link to="/wishlist" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                  Wishlist
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Cart */}
            {(!user || user.role === 'customer') && (
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
                <FiShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Auth */}
            {!user ? (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium hidden sm:block">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-4 hidden sm:block">
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-green-700" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>

                    <Link
                      to={getDashboardLink()}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {user.role === 'admin' ? <FiBarChart2 /> : user.role === 'delivery' ? <FiTruck /> : <FiSettings />}
                      Dashboard
                    </Link>

                    {user.role === 'customer' && (
                      <>
                        <Link
                          to="/orders"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiPackage /> My Orders
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiHeart /> Wishlist
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600">
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-1">
            Home
          </Link>

          <Link to="/shops" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-1">
            Shops
          </Link>

          {/* ✅ Packs */}
          {(!user || user.role === 'customer') && (
            <Link to="/packs" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-1">
              Packs
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-1">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center">
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-red-600 font-medium text-left py-1">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;