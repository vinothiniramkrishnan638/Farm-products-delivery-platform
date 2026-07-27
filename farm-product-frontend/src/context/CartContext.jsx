import { createContext, useContext, useState, useEffect } from "react";
import { getCartItems, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeCartItem as apiRemoveCartItem } from "../api/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { customer } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!customer) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await getCartItems();
      setCartItems(res.data);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [customer]);

  const addToCart = async (productId, quantity = 1) => {
    await apiAddToCart(productId, quantity);
    await loadCart();
  };

  const updateQuantity = async (cartId, quantity) => {
    await apiUpdateCartItem(cartId, quantity);
    setCartItems((prev) =>
      prev.map((item) => (item.cart_id === cartId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = async (cartId) => {
    await apiRemoveCartItem(cartId);
    setCartItems((prev) => prev.filter((item) => item.cart_id !== cartId));
  };

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        loadCart,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cartItems: [],
      cartCount: 0,
      loading: false,
      loadCart: () => {},
      addToCart: () => {},
      updateQuantity: () => {},
      removeFromCart: () => {},
    };
  }
  return context;
};
