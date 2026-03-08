import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem } = useCart();

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes?.[0], product.colors?.[0]?.name);
    toast.success(`${product.name} added to bag`, {
      style: {
        background: "#1a1a1a",
        color: "#fff",
        fontSize: "14px",
      },
      iconTheme: { primary: "#fff", secondary: "#1a1a1a" },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-sm mb-4">
          {!imageLoaded && <div className="absolute inset-0 skeleton" />}
          <motion.img
            src={product.images?.[hovered && product.images.length > 1 ? 1 : 0]}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${hovered ? "scale-105" : "scale-100"}`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.newArrival && (
              <span className="px-2.5 py-1 bg-white text-[10px] tracking-[0.15em] uppercase font-medium">
                New
              </span>
            )}
            {hasDiscount && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] tracking-[0.15em] uppercase font-medium">
                -{discountPercent}%
              </span>
            )}
            {product.bestSeller && !product.newArrival && (
              <span className="px-2.5 py-1 bg-gray-900 text-white text-[10px] tracking-[0.15em] uppercase font-medium">
                Bestseller
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-3 right-3 flex gap-2"
          >
            <button
              onClick={handleQuickAdd}
              className="flex-1 flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm py-3 text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              <ShoppingBag size={14} />
              Quick Add
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-11 h-11 flex items-center justify-center bg-white/95 backdrop-blur-sm hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              <Heart size={16} strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <p className="text-[11px] tracking-[0.15em] uppercase text-gray-400">
            {product.category}
          </p>
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          {/* Color Swatches */}
          {product.colors?.length > 0 && (
            <div className="flex gap-1.5 pt-1">
              {product.colors.map((color) => (
                <span
                  key={color.hex}
                  title={color.name}
                  className="w-3.5 h-3.5 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
