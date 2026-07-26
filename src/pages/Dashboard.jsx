import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { firebaseService } from '../services/firebase';
import { User, Phone, MapPin, CheckCircle, Package, Clock, ShieldAlert } from 'lucide-react';

export const Dashboard = () => {
  const { user, profile, updateProfile, logout } = useAuth();
  const [phone, setPhone] = useState(profile.phone || '');
  const [address, setAddress] = useState(profile.address || '');
  const [fullName, setFullName] = useState(profile.fullName || user?.name || '');
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const orderHistory = await firebaseService.orders.listUserOrders(user.$id);
        setOrders(orderHistory);
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  // Sync state if profile loads asynchronously
  useEffect(() => {
    if (profile) {
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setFullName(profile.fullName || user?.name || '');
    }
  }, [profile, user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMsg('');
    try {
      await updateProfile({ phone, address, fullName });
      setUpdateMsg('Profile updated successfully!');
      setTimeout(() => setUpdateMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setUpdateMsg('Failed to update profile: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'shipped': return 'status-shipped';
      case 'processing': return 'status-processing';
      default: return 'status-pending';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>My Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage your profile metadata and track orders</p>
        </div>
        <button className="btn btn-secondary" onClick={logout}>Sign Out</button>
      </div>

      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="profile-card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Profile Metadata</h3>
          
          {updateMsg && (
            <div style={{ 
              color: updateMsg.includes('failed') ? 'var(--error)' : 'var(--success)', 
              fontSize: '0.9rem', 
              marginBottom: '1rem',
              fontWeight: 600
            }}>
              {updateMsg}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" 
                className="form-input" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Phone number" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <textarea 
                className="form-input" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Shipping address" 
                rows="4"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={updating} style={{ width: '100%' }}>
              {updating ? 'Updating Profile...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Orders Card */}
        <div className="orders-card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>My Orders</h3>
          
          {ordersLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <div className="spinner">Fetching Orders...</div>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              You have not placed any orders yet.
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.$id} className="order-box">
                  <div className="order-header-info">
                    <div>
                      <span style={{ fontWeight: 600 }}>Order ID:</span> <code>{order.$id}</code>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Date: {new Date(order.$createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className={`order-status ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order items summary */}
                  <div className="order-items-summary" style={{ marginBottom: '0.75rem' }}>
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--text-main)' }}>
                          {item.productName} <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span>
                        </span>
                        <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Payment: <strong style={{ color: 'var(--text-main)' }}>{order.paymentMethod}</strong></span>
                    <span>Total paid: <strong style={{ color: 'var(--accent)' }}>₹{order.totalPrice}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
