import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ArrowRight } from "lucide-react";

export default function Cancel() {
  return (
    <div className="pt-32 lg:pt-40 pb-20 min-h-screen">
      <div className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <XCircle size={40} className="text-gray-400" />
          </motion.div>

          <h1 className="heading-lg mb-4">Order Cancelled</h1>
          <p className="text-gray-500 text-lg font-light mb-4">
            Your checkout was cancelled. No payment was processed.
          </p>
          <p className="text-gray-400 text-sm mb-10">
            Your items are still in your bag if you&apos;d like to complete
            your purchase.
          </p>

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
