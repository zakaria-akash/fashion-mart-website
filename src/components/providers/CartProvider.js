"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";

const CartContext = createContext(null);

/**
 * CartProvider Component
 * Manages the global shopping cart state using React Context API.
 * Handles persistence via localStorage for both guest and authenticated users.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { showToast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("fashion_mart_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("fashion_mart_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  /**
   * Adds a product to the cart or increases quantity if it already exists.
   */
  const addToCart = (product, quantity = 1, selectedSize = "M", selectedColor = "Black") => {
    let isNew = false;
    
    setItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) =>
          item.id === product.id && item.size === selectedSize && item.color === selectedColor
      );

      if (existingItemIndex > -1) {
        const nextItems = [...prev];
        nextItems[existingItemIndex].quantity += quantity;
        return nextItems;
      }

      isNew = true;
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity,
          size: selectedSize,
          color: selectedColor,
        },
      ];
    });

    // Side effects (toasts) moved outside the state update callback
    if (isNew) {
      showToast(`${product.title} added to cart`, { label: "Success" });
    } else {
      showToast(`Increased quantity of ${product.title}`, { label: "Cart Updated" });
    }
    
    setIsDrawerOpen(true);
  };

  /**
   * Updates the quantity of a specific item in the cart.
   */
  const updateQuantity = (id, size, color, delta) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id && item.size === size && item.color === color) {
            const nextQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  /**
   * Removes an item entirely from the cart.
   */
  const removeFromCart = (id, size, color) => {
    setItems((prev) => prev.filter((item) => !(item.id === id && item.size === size && item.color === color)));
    showToast("Item removed from cart", { tone: "error", label: "Removed" });
  };

  /**
   * Clears all items from the cart.
   */
  const clearCart = () => {
    setItems([]);
  };

  /**
   * Calculations for totals.
   */
  const cartCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const cartTotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      isDrawerOpen,
      setIsDrawerOpen,
    }),
    [items, cartCount, cartTotal, isDrawerOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Custom hook to access the cart context.
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
