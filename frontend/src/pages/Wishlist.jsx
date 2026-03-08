import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function Wishlist() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (product) => {
    addItem(product, product.sizes?.[0], product.colors?.[0]?.name);
    toast.success(`${product.name} added to bag`, {
      style: { background: "#1a1a1a", color: "#fff", fontSize: "14px" },
      iconTheme: { primary: "#fff", secondary: "#1a1a1a" },
    });
  };

  return (
    <div className="pt-32 lg:pt-40 pb-20 min-h-screen">
      <div className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="label-sm mb-2">Your Collection</p>
          <div className="flex items-end justify-between">
            <h1 className="heading-lg">Wishlist</h1>
            {items.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-24"
          >
            <Heart
              size={56}
              strokeWidth={1}
              className="text-gray-200 mx-auto mb-6"
            />
            <h2 className="font-display text-2xl font-medium mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Save items you love to come back to them later.
            </p>
            <Link to="/shop" className="btn-primary gap-2 inline-flex">
              Start Shopping
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product, i) => (
              <motion.div
                key={product.slug || product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group border border-gray-100 rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link
                  to={`/product/${product.slug}`}
                  className="block relative aspect-[3/4] bg-gray-50 overflow-hidden"
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeItem(product.slug || product._id);
                      toast.success("Removed from wishlist", {
                        style: { background: "#1a1a1a", color: "#fff", fontSize: "14px" },
                        iconTheme: { primary: "#fff", secondary: "#1a1a1a" },
                      });
                    }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white transition-all shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </Link>
                <div className="p-4">
                  <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 mb-1">
                    {product.category}
                  </p>
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1.5 mb-4">
                    <span className="text-sm font-medium">
                      ${product.price?.toFixed(2)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through">
                        ${product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-gray-800 transition-colors"
                  >
                    <ShoppingBag size={14} />
                    Add to Bag
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
