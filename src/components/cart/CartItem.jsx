import { useShop } from '../../context/ShopContext';
import { useToast } from '../common/ToastContainer';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

const CartItem = ({ item }) => {
  const { dispatch } = useShop();
  const { showSuccess } = useToast();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    dispatch({
      type: 'UPDATE_CART_QUANTITY',
      payload: { cartId: item.cartId, quantity: newQuantity }
    });
  };

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: item.cartId });
    showSuccess('Item removed from cart');
  };

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />

      <div className="cart-item-details">
        <h3>{item.name}</h3>
        <p className="cart-item-variant">
          Size: {item.size} | Color: {item.color}
        </p>
        <p className="cart-item-price">${item.price.toFixed(2)}</p>
      </div>

      <div className="cart-item-quantity">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          aria-label={`Decrease quantity of ${item.name}`}
          disabled={item.quantity <= 1}
        >
          <FiMinus />
        </button>
        <span aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          aria-label={`Increase quantity of ${item.name}`}
        >
          <FiPlus />
        </button>
      </div>

      <div className="cart-item-total">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      <button className="cart-item-remove" onClick={handleRemove} aria-label={`Remove ${item.name} from cart`}>
        <FiTrash2 />
      </button>
    </div>
  );
};

export default CartItem;
