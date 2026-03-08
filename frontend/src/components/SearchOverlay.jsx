import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-[80] flex flex-col"
        >
          <div className="flex items-center justify-end p-6">
            <button
              onClick={onClose}
              className="p-2 hover:opacity-60 transition-opacity"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center px-6">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <label className="label-sm mb-6 block text-center">
                  What are you looking for?
                </label>
                <div className="relative">
                  <Search
                    size={24}
                    strokeWidth={1.5}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-12 py-4 text-2xl sm:text-3xl font-light border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors bg-transparent"
                  />
                  {query && (
                    <button
                      type="submit"
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:opacity-60 transition-opacity"
                    >
                      <ArrowRight size={24} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-10"
              >
                <p className="label-sm mb-4">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Dresses", "Blazer", "Cashmere", "Silk", "Leather"].map(
                    (term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          navigate(
                            `/shop?search=${encodeURIComponent(term)}`
                          );
                          onClose();
                        }}
                        className="px-4 py-2 border border-gray-200 text-sm text-gray-600 rounded-full hover:border-gray-900 hover:text-gray-900 transition-all"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </motion.div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
