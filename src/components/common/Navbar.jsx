import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { useToast } from './ToastContainer';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartCount, wishlist, user, dispatch } = useShop();
  const { showSuccess, showInfo } = useToast();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showInfo('Please enter a search term');
      return;
    }
    dispatch({ type: 'SET_FILTERS', payload: { searchQuery } });
    navigate('/products');
    setSearchQuery('');
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    showSuccess('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text">FASHIONISTA</span>
        </Link>

        <form className="nav-search" onSubmit={handleSearch} role="search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" aria-label="Submit search">
            <FiSearch />
          </button>
        </form>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          <Link to="/products?category=men" onClick={() => setIsMenuOpen(false)}>Men</Link>
          <Link to="/products?category=women" onClick={() => setIsMenuOpen(false)}>Women</Link>
        </div>

        <div className="nav-actions">
          <Link to="/wishlist" className="nav-icon" aria-label={`Wishlist${wishlist.length > 0 ? `, ${wishlist.length} items` : ''}`}>
            <FiHeart />
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </Link>

          <Link to="/cart" className="nav-icon" aria-label={`Shopping cart${getCartCount() > 0 ? `, ${getCartCount()} items` : ''}`}>
            <FiShoppingCart />
            {getCartCount() > 0 && <span className="badge">{getCartCount()}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="nav-icon user-btn" aria-label="User menu" aria-haspopup="true">
                <FiUser />
              </button>
              <div className="user-dropdown">
                <span className="user-name">Hi, {user.name}</span>
                <Link to="/orders">My Orders</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="nav-icon" aria-label="Sign in">
              <FiUser />
            </Link>
          )}

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
