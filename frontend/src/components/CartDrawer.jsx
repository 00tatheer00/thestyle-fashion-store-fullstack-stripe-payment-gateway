import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { paymentAPI } from "../services/api";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const cartItems = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        images: item.images,
        currency: item.currency,
      }));
      const { data } = await paymentAPI.createSession(cartItems);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error("Failed to start checkout. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} strokeWidth={1.5} />
                <h2 className="font-display text-xl font-medium">
                  Your Bag ({items.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:opacity-60 transition-opacity"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag
                    size={48}
                    strokeWidth={1}
                    className="text-gray-300 mb-4"
                  />
                  <p className="text-gray-500 text-lg font-light">
                    Your bag is empty
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Add items to get started
                  </p>
                </div>
              ) : (
                items.map((item, index) => (
                  <motion.div
                    key={`${item.productId}-${item.selectedSize}-${item.selectedColor}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-4"
                  >
                    <div className="w-24 h-28 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {item.images?.[0] && (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium truncate pr-2">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-gray-400 hover:text-gray-900 transition-colors flex-shrink-0"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="text-xs text-gray-400 mt-1">
                          {[item.selectedSize, item.selectedColor]
                            .filter(Boolean)
                            .join(" / ")}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity - 1)
                            }
                            className="p-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity + 1)
                            }
                            className="p-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-500">
                    {totalPrice >= 200 ? "Free" : "$12.00"}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-medium">Total</span>
                  <span className="font-display text-lg font-medium">
                    $
                    {(totalPrice >= 200
                      ? totalPrice
                      : totalPrice + 12
                    ).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="btn-primary w-full gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Checkout
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <button
                  onClick={clearCart}
                  className="btn-ghost w-full text-xs text-gray-400"
                >
                  Clear bag
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
