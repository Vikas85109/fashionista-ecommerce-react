import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/product/ProductCard';
import { FiTruck, FiRefreshCw, FiShield, FiHeadphones } from 'react-icons/fi';

const Home = () => {
  const { products } = useShop();
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const newArrivals = products.slice(0, 8);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">New Season Collection</span>
          <h1>Discover Your Perfect Style</h1>
          <p>Explore our curated collection of trendy fashion for every occasion.</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
            <Link to="/products?category=women" className="btn btn-outline">Women's Collection</Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
            alt="Fashion Model"
          />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature">
          <FiTruck className="feature-icon" />
          <h3>Free Shipping</h3>
          <p>On orders over $100</p>
        </div>
        <div className="feature">
          <FiRefreshCw className="feature-icon" />
          <h3>Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
        <div className="feature">
          <FiShield className="feature-icon" />
          <h3>Secure Payment</h3>
          <p>100% secure checkout</p>
        </div>
        <div className="feature">
          <FiHeadphones className="feature-icon" />
          <h3>24/7 Support</h3>
          <p>Dedicated support team</p>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          <Link to="/products?category=men" className="category-card">
            <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500" alt="Men" />
            <div className="category-overlay">
              <h3>Men</h3>
            </div>
          </Link>
          <Link to="/products?category=women" className="category-card">
            <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500" alt="Women" />
            <div className="category-overlay">
              <h3>Women</h3>
            </div>
          </Link>
          <Link to="/products?category=shoes" className="category-card">
            <img src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500" alt="Shoes" />
            <div className="category-overlay">
              <h3>Shoes</h3>
            </div>
          </Link>
          <Link to="/products?category=accessories" className="category-card">
            <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500" alt="Accessories" />
            <div className="category-overlay">
              <h3>Accessories</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products" className="view-all">View All</Link>
        </div>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="banner-content">
          <span className="banner-tag">Limited Time Offer</span>
          <h2>Up to 50% Off</h2>
          <p>Don't miss out on our biggest sale of the season!</p>
          <Link to="/products" className="btn btn-primary">Shop Sale</Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="arrivals-section">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
          <Link to="/products" className="view-all">View All</Link>
        </div>
        <div className="products-grid">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
