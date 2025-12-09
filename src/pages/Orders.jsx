import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { FiPackage, FiCheck, FiTruck } from 'react-icons/fi';

const Orders = () => {
  const { orders, user } = useShop();
  const location = useLocation();
  const isNewOrder = location.state?.newOrder;

  if (!user) {
    return (
      <div className="orders-login">
        <FiPackage className="empty-icon" />
        <h2>Please sign in to view your orders</h2>
        <Link to="/auth" className="btn btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <FiPackage className="empty-icon" />
        <h2>No orders yet</h2>
        <p>Once you make a purchase, your orders will appear here.</p>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FiCheck />;
      case 'shipped':
        return <FiTruck />;
      default:
        return <FiPackage />;
    }
  };

  return (
    <div className="orders-page">
      {isNewOrder && (
        <div className="order-success">
          <FiCheck className="success-icon" />
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. We'll send you a confirmation email shortly.</p>
        </div>
      )}

      <h1>My Orders</h1>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-id">Order #{order.id}</span>
                <span className="order-date">{formatDate(order.date)}</span>
              </div>
              <div className={`order-status ${order.status}`}>
                {getStatusIcon(order.status)}
                <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map(item => (
                <div key={item.cartId} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Size: {item.size} | Color: {item.color}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <span className="order-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-shipping">
                <h4>Shipping Address</h4>
                <p>{order.shipping.firstName} {order.shipping.lastName}</p>
                <p>{order.shipping.address}</p>
                <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
              </div>
              <div className="order-total">
                <span>Total</span>
                <span className="total-amount">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
