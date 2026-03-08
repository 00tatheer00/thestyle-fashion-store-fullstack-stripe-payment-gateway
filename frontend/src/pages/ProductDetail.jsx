import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Star,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
} from "lucide-react";
import { productAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await productAPI.getBySlug(slug);
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || null);
        setSelectedColor(data.colors?.[0]?.name || null);
        setSelectedImage(0);
        setQuantity(1);

        const { data: relatedData } = await productAPI.getAll({
          category: data.category,
          limit: 4,
        });
        setRelated(
          relatedData.products.filter((p) => p.slug !== data.slug).slice(0, 4)
        );
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor);
    }
    toast.success(`${product.name} added to bag`, {
      style: { background: "#1a1a1a", color: "#fff", fontSize: "14px" },
      iconTheme: { primary: "#fff", secondary: "#1a1a1a" },
    });
  };

  if (loading) {
    return (
      <div className="pt-32 lg:pt-40 pb-20 section-padding">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded-sm" />
          <div className="space-y-6">
            <div className="h-4 bg-gray-100 rounded w-32" />
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-6 bg-gray-100 rounded w-24" />
            <div className="h-20 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 lg:pt-40 pb-20 text-center">
        <h2 className="heading-md">Product not found</h2>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          Back to Shop
        </Link>
      </div>
    );
  }

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="pt-32 lg:pt-40 pb-20">
      <div className="section-padding">
        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-gray-400 mb-8"
        >
          <Link to="/" className="hover:text-gray-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-gray-600 transition-colors">
            Shop
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">{product.name}</span>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden rounded-sm mb-3">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images?.[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {hasDiscount && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-[10px] tracking-[0.15em] uppercase font-medium">
                  Sale
                </span>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-24 overflow-hidden rounded-sm border-2 transition-all ${
                      selectedImage === i
                        ? "border-gray-900"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:py-4"
          >
            <p className="label-sm mb-3">{product.category}</p>
            <h1 className="font-display text-3xl sm:text-4xl font-medium mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-medium">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-500 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Color Selector */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">
                  Color:{" "}
                  <span className="font-normal text-gray-500">
                    {selectedColor}
                  </span>
                </p>
                <div className="flex gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? "border-gray-900 scale-110"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium">Size</p>
                  <button className="text-xs text-gray-400 underline hover:text-gray-600 transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-11 px-4 border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex gap-3 mb-8">
              <div className="flex items-center border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-5 text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 gap-2"
              >
                <ShoppingBag size={18} />
                Add to Bag
              </button>
              <button
                onClick={() => {
                  toggleItem(product);
                  toast.success(
                    isWishlisted(product) ? "Removed from wishlist" : "Added to wishlist",
                    {
                      style: { background: "#1a1a1a", color: "#fff", fontSize: "14px" },
                      iconTheme: { primary: "#fff", secondary: "#1a1a1a" },
                    }
                  );
                }}
                className={`w-12 h-12 flex items-center justify-center border transition-all ${
                  isWishlisted(product)
                    ? "border-red-300 bg-red-50 text-red-500"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <Heart
                  size={18}
                  strokeWidth={1.5}
                  className={isWishlisted(product) ? "fill-current" : ""}
                />
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t">
              {[
                { icon: Truck, text: "Free shipping on orders over $200" },
                { icon: RotateCcw, text: "Easy 30-day returns" },
                { icon: Shield, text: "Secure Stripe payment" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-gray-500">
                  <Icon size={16} strokeWidth={1.5} />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <p className="label-sm mb-2">You May Also Like</p>
              <h2 className="heading-md">Related Products</h2>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
              {related.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
