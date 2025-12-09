import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/product/ProductCard';
import { FiHeart } from 'react-icons/fi';

const Wishlist = () => {
  const { wishlist } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="empty-wishlist">
        <FiHeart className="empty-icon" />
        <h2>Your wishlist is empty</h2>
        <p>Save items you love by clicking the heart icon.</p>
        <Link to="/products" className="btn btn-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1>My Wishlist ({wishlist.length} items)</h1>

      <div className="products-grid">
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
