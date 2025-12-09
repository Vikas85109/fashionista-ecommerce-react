import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../common/ToastContainer';
import { FiHeart, FiShoppingCart, FiStar, FiCheck } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { dispatch, isInWishlist } = useShop();
  const { showSuccess, showError } = useToast();
  const [addedToCart, setAddedToCart] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
    showSuccess(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!product.inStock) {
      showError('This product is out of stock');
      return;
    }
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
    setAddedToCart(true);
    showSuccess(`${product.name} added to cart!`);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        {!product.inStock && <span className="out-of-stock-badge">Out of Stock</span>}
        <div className="product-actions">
          <button
            className={`action-btn wishlist-btn ${inWishlist ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <FiHeart />
          </button>
          <button
            className={`action-btn cart-btn ${addedToCart ? 'added' : ''}`}
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            aria-label={product.inStock ? `Add ${product.name} to cart` : `${product.name} is out of stock`}
          >
            {addedToCart ? <FiCheck /> : <FiShoppingCart />}
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
