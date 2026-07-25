import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('ecommerce_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.$id === product.$id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.$id === product.$id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.$id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.$id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
    setDiscount(0);
  };

  const applyCoupon = (code) => {
    const uppercaseCode = code.toUpperCase();
    if (uppercaseCode === 'DISCOUNT10') {
      setCouponCode(uppercaseCode);
      setDiscount(0.10); // 10% off
      return { success: true, message: '10% Discount Applied!' };
    }
    if (uppercaseCode === 'FREESHIP') {
      setCouponCode(uppercaseCode);
      setDiscount(50); // Flat Rs 50 off shipping
      return { success: true, message: 'Rs 50 Shipping Discount Applied!' };
    }
    return { success: false, message: 'Invalid Coupon Code' };
  };

  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartTotal = discount < 1 
    ? cartSubtotal * (1 - discount) 
    : Math.max(0, cartSubtotal - discount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTotal,
        couponCode,
        discount,
        applyCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
