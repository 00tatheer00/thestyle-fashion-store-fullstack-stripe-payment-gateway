import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, Heart, User } from "lucide-react";
import { useCart } from "../context/CartContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "New Arrivals", path: "/shop?filter=newArrival" },
  { label: "Best Sellers", path: "/shop?filter=bestSeller" },
];

export default function Navbar({ onCartOpen, onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm"
            : "bg-white"
        }`}
      >
        {/* Announcement Bar */}
        <div className="bg-gray-900 text-white text-center py-2">
          <p className="text-[11px] tracking-[0.25em] uppercase font-light">
            Free shipping on orders over $200 &mdash; New collection available now
          </p>
        </div>

        <div className="section-padding">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left — Mobile Menu + Search */}
            <div className="flex items-center gap-4 w-1/3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-1 hover:opacity-60 transition-opacity"
                aria-label="Open menu"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
              <button
                onClick={onSearchOpen}
                className="p-1 hover:opacity-60 transition-opacity hidden sm:block"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Center — Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="font-display text-2xl lg:text-3xl font-medium tracking-tight">
                TheStyle
              </h1>
            </Link>

            {/* Right — Icons */}
            <div className="flex items-center justify-end gap-4 w-1/3">
              <button
                onClick={onSearchOpen}
                className="p-1 hover:opacity-60 transition-opacity sm:hidden"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
              <Link
                to="/wishlist"
                className="p-1 hover:opacity-60 transition-opacity hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.5} />
              </Link>
              <Link
                to="/account"
                className="p-1 hover:opacity-60 transition-opacity hidden sm:block"
                aria-label="Account"
              >
                <User size={20} strokeWidth={1.5} />
              </Link>
              <button
                onClick={onCartOpen}
                className="relative p-1 hover:opacity-60 transition-opacity"
                aria-label="Cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-gray-900 text-white text-[10px] rounded-full flex items-center justify-center font-medium"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center justify-center gap-10 pb-4 -mt-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-[13px] tracking-[0.15em] uppercase font-medium text-gray-600 hover:text-gray-900 transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gray-900 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-[70] shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="font-display text-xl font-medium">Menu</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 hover:opacity-60 transition-opacity"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="p-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={link.path}
                      className="block py-3 text-lg font-light text-gray-800 hover:text-gray-900 hover:pl-2 transition-all border-b border-gray-100"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
