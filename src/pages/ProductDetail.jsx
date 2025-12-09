import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { FiHeart, FiShoppingCart, FiStar, FiMinus, FiPlus, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../components/product/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, dispatch, isInWishlist, user } = useShop();
  const product = products.find(p => p.id === parseInt(id));

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <Link to="/products">Continue Shopping</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        cartId: `${product.id}-${selectedSize}-${selectedColor}`,
        size: selectedSize,
        color: selectedColor,
        quantity
      }
    });
  };

  const handleWishlistToggle = () => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      return;
    }
    dispatch({
      type: 'ADD_REVIEW',
      payload: { productId: product.id, rating: reviewRating }
    });
    setReviewText('');
    setReviewRating(5);
    alert('Review submitted successfully!');
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <FiChevronRight />
        <Link to="/products">Products</Link>
        <FiChevronRight />
        <span>{product.name}</span>
      </div>

      <div className="product-detail-container">
        {/* Product Image */}
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
          {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        </div>

        {/* Product Info */}
        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="product-rating-detail">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < Math.floor(product.rating) ? 'filled' : ''} />
              ))}
            </div>
            <span>{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="product-price-detail">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                <span className="discount-tag">Save {discount}%</span>
              </>
            )}
          </div>

          <p className="product-description-short">{product.description}</p>

          {/* Size Selection */}
          <div className="option-group">
            <label>Size:</label>
            <div className="size-options">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="option-group">
            <label>Color:</label>
            <div className="color-options">
              {product.colors.map(color => (
                <button
                  key={color}
                  className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="option-group">
            <label>Quantity:</label>
            <div className="quantity-selector">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <FiMinus />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="product-actions-detail">
            <button className="btn btn-primary add-to-cart" onClick={handleAddToCart}>
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              className={`btn btn-outline wishlist-btn ${inWishlist ? 'active' : ''}`}
              onClick={handleWishlistToggle}
            >
              <FiHeart /> {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Product Meta */}
          <div className="product-meta">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Availability:</strong> {product.inStock ? 'In Stock' : 'Out of Stock'}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs">
        <div className="tab-headers">
          <button
            className={activeTab === 'description' ? 'active' : ''}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={activeTab === 'reviews' ? 'active' : ''}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.reviews})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-tab">
              <p>{product.description}</p>
              <h4>Product Features:</h4>
              <ul>
                <li>Premium quality materials</li>
                <li>Comfortable fit for all-day wear</li>
                <li>Easy care and maintenance</li>
                <li>Durable construction</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <h4>Write a Review</h4>
                <div className="rating-input">
                  <label>Rating:</label>
                  <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
                <textarea
                  placeholder="Share your thoughts about this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>You May Also Like</h2>
          <div className="products-grid">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
