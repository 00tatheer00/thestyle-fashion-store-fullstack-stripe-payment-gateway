import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react";
import { paymentAPI } from "../services/api";
import { useCart } from "../context/CartContext";

export default function Success() {
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const { data } = await paymentAPI.getSession(sessionId);
        setSession(data);
        clearCart();
      } catch (err) {
        console.error("Failed to fetch session:", err);
        setError("Unable to verify payment. Please check your email for confirmation.");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 lg:pt-40 pb-20 min-h-screen">
      <div className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle size={40} className="text-green-500" />
          </motion.div>

          <h1 className="heading-lg mb-4">Thank You!</h1>
          <p className="text-gray-500 text-lg font-light mb-10">
            Your order has been placed successfully
          </p>

          {error ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-4 rounded mb-8">
              {error}
            </div>
          ) : session ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 rounded-sm p-8 text-left space-y-6 mb-10"
            >
              <div className="flex items-center gap-3 pb-4 border-b">
                <Package size={20} strokeWidth={1.5} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Order ID
                  </p>
                  <p className="text-sm font-mono font-medium text-gray-700 mt-0.5">
                    {session.sessionId?.slice(-12)?.toUpperCase()}
                  </p>
                </div>
              </div>

              {session.customerEmail && (
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Mail size={20} strokeWidth={1.5} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Confirmation sent to
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-0.5">
                      {session.customerEmail}
                    </p>
                  </div>
                </div>
              )}

              {session.lineItems?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                    Items
                  </p>
                  <div className="space-y-2">
                    {session.lineItems.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {item.name}{" "}
                          {item.quantity > 1 && (
                            <span className="text-gray-400">
                              x{item.quantity}
                            </span>
                          )}
                        </span>
                        <span className="font-medium">
                          ${item.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                <span className="font-medium">Total Paid</span>
                <span className="font-display text-xl font-medium">
                  ${session.totalAmount?.toFixed(2)}{" "}
                  <span className="text-xs text-gray-400 uppercase">
                    {session.currency}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-sm text-green-600 font-medium capitalize">
                  {session.paymentStatus}
                </p>
              </div>
            </motion.div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-primary gap-2">
              Continue Shopping
              <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn-outline">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
