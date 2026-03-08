import { createContext, useContext, useReducer } from "react";

const WishlistContext = createContext();

const STORAGE_KEY = "thestyle_wishlist";

const loadWishlist = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveWishlist = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

function wishlistReducer(state, action) {
  let newState;
  switch (action.type) {
    case "TOGGLE": {
      const id = action.payload.slug || action.payload._id;
      const exists = state.some((item) => (item.slug || item._id) === id);
      newState = exists
        ? state.filter((item) => (item.slug || item._id) !== id)
        : [...state, action.payload];
      break;
    }
    case "REMOVE":
      newState = state.filter(
        (item) => (item.slug || item._id) !== action.payload
      );
      break;
    case "CLEAR":
      newState = [];
      break;
    default:
      return state;
  }
  saveWishlist(newState);
  return newState;
}

export function WishlistProvider({ children }) {
  const [items, dispatch] = useReducer(wishlistReducer, [], loadWishlist);

  const toggleItem = (product) =>
    dispatch({ type: "TOGGLE", payload: product });

  const removeItem = (id) =>
    dispatch({ type: "REMOVE", payload: id });

  const clearWishlist = () =>
    dispatch({ type: "CLEAR" });

  const isWishlisted = (product) => {
    const id = product?.slug || product?._id;
    return items.some((item) => (item.slug || item._id) === id);
  };

  return (
    <WishlistContext.Provider
      value={{ items, toggleItem, removeItem, clearWishlist, isWishlisted, totalItems: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
