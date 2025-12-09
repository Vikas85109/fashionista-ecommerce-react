import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import CartItem from '../components/cart/CartItem';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const Cart = () => {
  const { cart, getCartTotal, dispatch } = useShop();
  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <FiShoppingBag className="empty-icon" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span></span>
          </div>

          {cart.map(item => (
            <CartItem key={item.cartId} item={item} />
          ))}

          <button
            className="btn btn-outline clear-cart"
            onClick={() => dispatch({ type: 'CLEAR_CART' })}
          >
            Clear Cart
          </button>
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {subtotal < 100 && (
            <p className="free-shipping-notice">
              Add ${(100 - subtotal).toFixed(2)} more for free shipping!
            </p>
          )}

          <Link to="/checkout" className="btn btn-primary checkout-btn">
            Proceed to Checkout <FiArrowRight />
          </Link>

          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
