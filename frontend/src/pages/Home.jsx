import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { productAPI } from "../services/api";
import HeroSection from "../components/HeroSection";
import FeaturedGrid from "../components/FeaturedGrid";
import Marquee from "../components/Marquee";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          productAPI.getAll({ featured: true, limit: 4 }),
          productAPI.getAll({ newArrival: true, limit: 4 }),
        ]);
        setFeatured(featuredRes.data.products);
        setNewArrivals(newRes.data.products);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <HeroSection />
      <Marquee />

      {/* Featured Products */}
      <section className="section-padding py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="label-sm mb-3">Handpicked</p>
            <h2 className="heading-lg">Featured Collection</h2>
          </div>
          <Link
            to="/shop?featured=true"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
          >
            View All
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100 rounded-sm mb-4" />
                <div className="h-3 bg-gray-100 rounded w-16 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {featured.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}

        <Link
          to="/shop?featured=true"
          className="sm:hidden flex items-center justify-center gap-2 mt-8 text-sm font-medium text-gray-600"
        >
          View All <ArrowRight size={16} />
        </Link>
      </section>

      {/* Banner */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
          alt="Collection banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 section-padding w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/60 mb-4">
              Limited Edition
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-medium mb-6 italic">
              The Essentials Edit
            </h2>
            <p className="text-white/70 text-lg font-light max-w-lg mx-auto mb-8">
              A curated capsule of must-have pieces designed to mix, match, and
              transcend seasons.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-gray-900 text-sm tracking-wider uppercase font-medium hover:bg-gray-100 transition-all duration-300"
            >
              Discover Now
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <FeaturedGrid />

      {/* New Arrivals */}
      <section className="section-padding py-20 bg-brand-50/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="label-sm mb-3">Just Landed</p>
            <h2 className="heading-lg">New Arrivals</h2>
          </div>
          <Link
            to="/shop?filter=newArrival"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
          >
            View All
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {!loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {newArrivals.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Trust Badges */}
      <section className="section-padding py-16 border-t">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Free Shipping", desc: "On orders over $200" },
            { title: "Easy Returns", desc: "30-day return policy" },
            { title: "Secure Payment", desc: "Stripe-powered checkout" },
            { title: "Premium Quality", desc: "Crafted with care" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <h4 className="text-sm font-medium mb-1">{item.title}</h4>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
