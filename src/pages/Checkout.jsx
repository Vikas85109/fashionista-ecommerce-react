import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useToast } from '../components/common/ToastContainer';
import { FiCheck, FiLock } from 'react-icons/fi';

const Checkout = () => {
  const { cart, getCartTotal, user, dispatch } = useShop();
  const { showSuccess, showWarning } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    }
    // Format expiry date
    if (name === 'cardExpiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    }
    // Format CVV (numbers only, max 4 digits)
    if (name === 'cardCvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    // Format phone number
    if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData({ ...formData, [name]: formattedValue });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const cardNum = formData.cardNumber.replace(/\s/g, '');
    if (!cardNum) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNum.length < 15) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    if (!formData.cardExpiry) {
      newErrors.cardExpiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Use MM/YY format';
    }
    if (!formData.cardCvv) {
      newErrors.cardCvv = 'CVV is required';
    } else if (formData.cardCvv.length < 3) {
      newErrors.cardCvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (nextStep) => {
    if (step === 1 && !validateStep1()) {
      showWarning('Please fill in all required fields');
      return;
    }
    if (step === 2 && !validateStep2()) {
      showWarning('Please fill in all payment details');
      return;
    }
    setStep(nextStep);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const order = {
      id: Date.now(),
      items: cart,
      total,
      shipping: formData,
      status: 'confirmed',
      date: new Date().toISOString()
    };

    dispatch({ type: 'ADD_ORDER', payload: order });
    showSuccess('Order placed successfully!');
    navigate('/orders', { state: { newOrder: true } });
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {/* Progress Steps */}
      <div className="checkout-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <span className="step-number">{step > 1 ? <FiCheck /> : '1'}</span>
          <span>Shipping</span>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <span className="step-number">{step > 2 ? <FiCheck /> : '2'}</span>
          <span>Payment</span>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span>Review</span>
        </div>
      </div>

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="form-section">
              <h2>Shipping Information</h2>

              <div className="form-row">
                <div className={`form-group ${errors.firstName ? 'error' : ''}`}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                  />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>
                <div className={`form-group ${errors.lastName ? 'error' : ''}`}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                  />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className={`form-group ${errors.email ? 'error' : ''}`}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
                <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="1234567890"
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              <div className={`form-group ${errors.address ? 'error' : ''}`}>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St"
                />
                {errors.address && <span className="form-error">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className={`form-group ${errors.city ? 'error' : ''}`}>
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                  />
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>
                <div className={`form-group ${errors.state ? 'error' : ''}`}>
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NY"
                  />
                  {errors.state && <span className="form-error">{errors.state}</span>}
                </div>
                <div className={`form-group ${errors.zipCode ? 'error' : ''}`}>
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="10001"
                  />
                  {errors.zipCode && <span className="form-error">{errors.zipCode}</span>}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleNextStep(2)}
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="form-section">
              <h2>Payment Information</h2>
              <div className="secure-badge">
                <FiLock /> Secure Payment
              </div>

              <div className={`form-group ${errors.cardNumber ? 'error' : ''}`}>
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                />
                {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
              </div>

              <div className="form-row">
                <div className={`form-group ${errors.cardExpiry ? 'error' : ''}`}>
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    inputMode="numeric"
                  />
                  {errors.cardExpiry && <span className="form-error">{errors.cardExpiry}</span>}
                </div>
                <div className={`form-group ${errors.cardCvv ? 'error' : ''}`}>
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cardCvv"
                    value={formData.cardCvv}
                    onChange={handleChange}
                    placeholder="123"
                    inputMode="numeric"
                  />
                  {errors.cardCvv && <span className="form-error">{errors.cardCvv}</span>}
                </div>
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleNextStep(3)}
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="form-section">
              <h2>Review Your Order</h2>

              <div className="review-section">
                <h3>Shipping Address</h3>
                <p>{formData.firstName} {formData.lastName}</p>
                <p>{formData.address}</p>
                <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                <p>{formData.email}</p>
              </div>

              <div className="review-section">
                <h3>Payment Method</h3>
                <p>Card ending in {formData.cardNumber.slice(-4)}</p>
              </div>

              <div className="review-section">
                <h3>Order Items</h3>
                {cart.map(item => (
                  <div key={item.cartId} className="review-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <p>{item.size} / {item.color}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Place Order - ${total.toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="summary-items">
            {cart.map(item => (
              <div key={item.cartId} className="summary-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <span>x{item.quantity}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
