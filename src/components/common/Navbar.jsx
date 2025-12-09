import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartCount, wishlist, user, dispatch } = useShop();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_FILTERS', payload: { searchQuery } });
    navigate('/products');
    setSearchQuery('');
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text">FASHIONISTA</span>
        </Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
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
          <Link to="/wishlist" className="nav-icon">
            <FiHeart />
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </Link>

          <Link to="/cart" className="nav-icon">
            <FiShoppingCart />
            {getCartCount() > 0 && <span className="badge">{getCartCount()}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="nav-icon user-btn">
                <FiUser />
              </button>
              <div className="user-dropdown">
                <span className="user-name">Hi, {user.name}</span>
                <Link to="/orders">My Orders</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="nav-icon">
              <FiUser />
            </Link>
          )}

          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
