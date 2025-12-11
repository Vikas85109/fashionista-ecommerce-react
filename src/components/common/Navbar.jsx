import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { useToast } from './ToastContainer';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const { getCartCount, wishlist, user, dispatch, products } = useShop();
  const { showSuccess, showInfo } = useToast();
  const navigate = useNavigate();

  // Filter products based on search query
  const searchResults = searchQuery.trim().length >= 2
    ? products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) // Limit to 5 results
    : [];

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // if (!searchQuery.trim()) {
    //   showInfo('Please enter a search term');
    //   return;
    // }
    // Reset category to 'all' when searching so results aren't filtered by previous category
    dispatch({ type: 'SET_FILTERS', payload: { searchQuery: searchQuery.trim(), category: 'all' } });
    navigate('/products');
    // setSearchQuery('');
    setShowResults(false);
  };

  const handleResultClick = (productId) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/product/${productId}`);
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

        <div className="nav-search-container" ref={searchRef}>
          <form className="nav-search" onSubmit={handleSearch} role="search">
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                // Only show results if there's at least 2 characters
                setShowResults(value.trim().length >= 2);
              }}
              onInput={(e) => {
                // Handle native clear button (X) click on search input
                if (e.target.value === '') {
                  setSearchQuery('');
                  setShowResults(false);
                }
              }}
              onFocus={() => setShowResults(searchQuery.trim().length >= 2)}
              aria-label="Search products"
            />
            <button type="submit" aria-label="Submit search">
              <FiSearch />
            </button>
          </form>

          {showResults && searchQuery.trim().length >= 2 && (
            <div className="search-results-dropdown">
              {searchResults.length > 0 ? (
                <>
                  {searchResults.map(product => (
                    <div
                      key={product.id}
                      className="search-result-item"
                      onClick={() => handleResultClick(product.id)}
                    >
                      <img src={product.image} alt={product.name} />
                      <div className="search-result-info">
                        <span className="search-result-name">{product.name}</span>
                        <span className="search-result-price">${product.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="search-view-all"
                    onClick={handleSearch}
                  >
                    View all results
                  </button>
                </>
              ) : (
                <div className="search-no-results">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

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
