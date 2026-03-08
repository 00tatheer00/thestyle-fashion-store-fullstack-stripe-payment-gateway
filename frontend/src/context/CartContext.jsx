import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const STORAGE_KEY = "thestyle_cart";

const loadCart = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

function cartReducer(state, action) {
  let newState;
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.selectedSize === action.payload.selectedSize &&
          item.selectedColor === action.payload.selectedColor
      );
      if (existing) {
        newState = state.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        newState = [...state, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }
      break;
    }
    case "REMOVE_ITEM":
      newState = state.filter((_, i) => i !== action.payload);
      break;
    case "UPDATE_QUANTITY":
      newState = state.map((item, i) =>
        i === action.payload.index
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
      break;
    case "CLEAR_CART":
      newState = [];
      break;
    default:
      return state;
  }
  saveCart(newState);
  return newState;
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  const addItem = (product, selectedSize, selectedColor) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: product._id || product.slug,
        name: product.name,
        price: product.price,
        images: product.images,
        currency: product.currency || "usd",
        selectedSize,
        selectedColor,
        quantity: 1,
      },
    });
  };

  const removeItem = (index) => dispatch({ type: "REMOVE_ITEM", payload: index });

  const updateQuantity = (index, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { index, quantity } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
