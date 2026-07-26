import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { firebaseService } from '../services/firebase';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';

export const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Prefill profile details if they exist
  const [fullName, setFullName] = useState(profile.fullName || user?.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [address, setAddress] = useState(profile.address || '');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Add some products to your cart before checking out.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Browse Products
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !address || !fullName) {
      alert('Please fill out all shipping details');
      return;
    }

    setLoading(true);
    try {
      // 1. Save updated profile metadata to Appwrite if changed
      if (phone !== profile.phone || address !== profile.address || fullName !== profile.fullName) {
        await updateProfile({ phone, address, fullName });
      }

      // 2. Prepare order items
      const items = cartItems.map((item) => ({
        productID: item.$id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        imageID: item.imageID,
      }));

      // 3. Create the order
      const orderDetails = {
        userID: user.$id,
        customerName: fullName,
        phone,
        address,
        totalPrice: cartTotal,
        quantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        paymentMethod,
      };

      const result = await firebaseService.orders.create(orderDetails, items);
      setPlacedOrderId(result.$id);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Order placement failed:', err);
      alert('Order placement failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
        <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1.5rem' }} />
        <h1 style={{ marginBottom: '1rem' }}>Order Placed!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          Thank you for your purchase, <strong>{fullName}</strong>. Your order ID is <code>{placedOrderId}</code>.
          We will process your order shortly.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn btn-primary">
            Track Order
          </Link>
          <Link to="/" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>
      
      <div className="checkout-grid">
        {/* Shipping Form */}
        <form onSubmit={handleSubmit} className="profile-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>Shipping Details</h3>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              type="tel" 
              className="form-input" 
              required 
              placeholder="e.g. 9876543210"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Shipping Address</label>
            <textarea 
              className="form-input" 
              required 
              rows="4" 
              placeholder="Enter your complete home/office address"
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="COD" 
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <Truck size={18} />
                <span>Cash on Delivery (COD)</span>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', opacity: 0.6 }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="ONLINE" 
                  checked={paymentMethod === 'ONLINE'}
                  onChange={() => setPaymentMethod('ONLINE')}
                />
                <CreditCard size={18} />
                <span>Online Payment (Paytm / Cards) - Coming Soon</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }} 
            disabled={loading}
          >
            {loading ? 'Processing Order...' : `Place COD Order (₹${cartTotal})`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="profile-card" style={{ height: 'fit-content' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.25rem', marginBottom: '1rem' }}>
            {cartItems.map((item) => (
              <div key={item.$id} style={{ display: 'flex', justifyItems: 'space-between', gap: '1rem', fontSize: '0.9rem' }}>
                <img 
                  src={firebaseService.storage.getFilePreview(item.imageID)} 
                  alt={item.name} 
                  style={{ width: '40px', height: '40px', objectFit: 'contain', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span>Total Items Cost</span>
              <span>₹{cartTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span>Shipping Fee</span>
              <span style={{ color: 'var(--success)' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
              <span>Grand Total</span>
              <span style={{ color: 'var(--accent)' }}>₹{cartTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
