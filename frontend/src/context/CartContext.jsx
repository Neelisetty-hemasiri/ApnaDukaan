import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch { return []; }
  });
  const [shopId, setShopId] = useState(() => localStorage.getItem('cartShopId') || null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    localStorage.setItem('cartShopId', shopId || '');
  }, [cartItems, shopId]);

  const addToCart = (product, quantity = 1) => {
    // Enforce single-shop cart
    if (shopId && shopId !== product.shop._id && shopId !== product.shop) {
      return { error: 'You can only order from one shop at a time. Clear cart first.' };
    }
    setShopId(product.shop._id || product.shop);
    setCartItems(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + quantity } : i);
      }
      return [...prev, { ...product, qty: quantity }];
    });
    return { success: true };
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i._id !== productId);
      if (updated.length === 0) setShopId(null);
      return updated;
    });
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);
    setCartItems(prev => prev.map(i => i._id === productId ? { ...i, qty } : i));
  };

  const clearCart = () => {
    setCartItems([]);
    setShopId(null);
  };

  const itemsPrice = cartItems.reduce((acc, i) => acc + (i.discountedPrice || i.price) * i.qty, 0);
  const taxPrice   = Math.round(itemsPrice * 0.05);
  const deliveryCharge = itemsPrice > 500 ? 0 : 30;
  const totalPrice = itemsPrice + taxPrice + deliveryCharge;
  const totalItems = cartItems.reduce((acc, i) => acc + i.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems, shopId,
      addToCart, removeFromCart, updateQty, clearCart,
      itemsPrice, taxPrice, deliveryCharge, totalPrice, totalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
