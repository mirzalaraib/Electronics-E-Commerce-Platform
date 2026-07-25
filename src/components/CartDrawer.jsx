import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { appwriteService } from '../services/appwrite';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, cartTotal, applyCoupon, couponCode } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  if (!isOpen) return null;

  const handleCouponApply = () => {
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg(res.message);
  };

  const handleCheckout = () => {
    onClose();
    if (!user) {
      // Redirect to dashboard (which prompts login) and then to checkout
      navigate('/dashboard?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Your cart is empty</p>
            <button className="btn btn-secondary" onClick={onClose}>Start Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item) => {
                const imgUrl = appwriteService.storage.getFilePreview(item.imageID);
                return (
                  <div key={item.$id} className="cart-item">
                    <img src={imgUrl} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <p className="cart-item-price">₹{item.price}</p>
                      
                      <div className="quantity-selector" style={{ marginTop: '0.5rem', width: 'fit-content' }}>
                        <button className="quantity-btn" onClick={() => updateQuantity(item.$id, item.quantity - 1)}>
                          <Minus size={12} />
                        </button>
                        <span className="quantity-val" style={{ padding: '0.2rem 0.5rem', fontSize: '0.85rem' }}>
                          {item.quantity}
                        </span>
                        <button className="quantity-btn" onClick={() => updateQuantity(item.$id, item.quantity + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="cart-item-actions">
                      <span className="cart-item-price" style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                      <button className="cart-item-remove" onClick={() => removeFromCart(item.$id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-footer">
              <div className="coupon-box">
                <input 
                  type="text" 
                  className="coupon-input" 
                  placeholder="Coupon (e.g. DISCOUNT10)" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={handleCouponApply}>
                  Apply
                </button>
              </div>
              {couponMsg && (
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: couponCode ? 'var(--success)' : 'var(--error)',
                  marginTop: '-0.5rem' 
                }}>
                  {couponMsg}
                </div>
              )}

              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              {couponCode && (
                <div className="cart-summary-row" style={{ fontSize: '0.9rem', color: 'var(--success)' }}>
                  <span>Discount ({couponCode})</span>
                  <span>- ₹{cartSubtotal - cartTotal}</span>
                </div>
              )}
              <div className="cart-summary-row" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span className="cart-total-price">₹{cartTotal}</span>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={handleCheckout}>
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
