import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { dispatch, isInWishlist } = useShop();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        cartId: `${product.id}-${product.sizes[0]}-${product.colors[0]}`,
        size: product.sizes[0],
        color: product.colors[0],
        quantity: 1
      }
    });
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        <div className="product-actions">
          <button
            className={`action-btn wishlist-btn ${inWishlist ? 'active' : ''}`}
            onClick={handleWishlistToggle}
          >
            <FiHeart />
          </button>
          <button className="action-btn cart-btn" onClick={handleQuickAdd}>
            <FiShoppingCart />
          </button>
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <FiStar className="star-icon" />
          <span>{product.rating}</span>
          <span className="review-count">({product.reviews})</span>
        </div>
        <div className="product-price">
          <span className="current-price">${product.price.toFixed(2)}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
