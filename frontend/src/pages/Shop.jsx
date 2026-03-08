import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { productAPI } from "../services/api";
import ProductGrid from "../components/ProductGrid";

const sortOptions = [
  { label: "Newest", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const currentSort = searchParams.get("sort") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentSubcategory = searchParams.get("subcategory") || "";
  const currentFilter = searchParams.get("filter") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    productAPI.getCategories().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
          sort: currentSort,
        };
        if (currentCategory) params.category = currentCategory;
        if (currentSubcategory) params.subcategory = currentSubcategory;
        if (currentSearch) params.search = currentSearch;
        if (currentFilter === "newArrival") params.newArrival = true;
        if (currentFilter === "bestSeller") params.bestSeller = true;
        if (currentFilter === "featured" || searchParams.get("featured"))
          params.featured = true;

        const { data } = await productAPI.getAll(params);
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  const hasActiveFilters =
    currentCategory || currentSubcategory || currentFilter || currentSearch;

  const pageTitle = () => {
    if (currentSearch) return `Search: "${currentSearch}"`;
    if (currentFilter === "newArrival") return "New Arrivals";
    if (currentFilter === "bestSeller") return "Best Sellers";
    if (currentCategory) return currentCategory;
    if (currentSubcategory) return currentSubcategory;
    return "All Products";
  };

  return (
    <div className="pt-32 lg:pt-40 pb-20">
      <div className="section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="label-sm mb-2">Collection</p>
          <div className="flex items-end justify-between">
            <h1 className="heading-lg">{pageTitle()}</h1>
            <p className="text-sm text-gray-400">{total} products</p>
          </div>
        </motion.div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sort by:{" "}
              {sortOptions.find((o) => o.value === currentSort)?.label ||
                "Newest"}
              <ChevronDown
                size={14}
                className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 bg-white border border-gray-100 shadow-lg rounded-sm py-2 min-w-[200px] z-20"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        updateParam("sort", opt.value);
                        setSortOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        currentSort === opt.value
                          ? "text-gray-900 font-medium bg-gray-50"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Filter Bar */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b">
                <div>
                  <p className="label-sm mb-3">Category</p>
                  <div className="space-y-2">
                    {categories?.categories?.map((cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          updateParam(
                            "category",
                            currentCategory === cat ? "" : cat
                          )
                        }
                        className={`block text-sm transition-colors ${
                          currentCategory === cat
                            ? "text-gray-900 font-medium"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="label-sm mb-3">Type</p>
                  <div className="space-y-2">
                    {categories?.subcategories?.map((sub) => (
                      <button
                        key={sub}
                        onClick={() =>
                          updateParam(
                            "subcategory",
                            currentSubcategory === sub ? "" : sub
                          )
                        }
                        className={`block text-sm transition-colors ${
                          currentSubcategory === sub
                            ? "text-gray-900 font-medium"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="label-sm mb-3">Collection</p>
                  <div className="space-y-2">
                    {[
                      { label: "New Arrivals", value: "newArrival" },
                      { label: "Best Sellers", value: "bestSeller" },
                    ].map((f) => (
                      <button
                        key={f.value}
                        onClick={() =>
                          updateParam(
                            "filter",
                            currentFilter === f.value ? "" : f.value
                          )
                        }
                        className={`block text-sm transition-colors ${
                          currentFilter === f.value
                            ? "text-gray-900 font-medium"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                {hasActiveFilters && (
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <X size={14} />
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-8">
            {currentCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-xs font-medium rounded-full">
                {currentCategory}
                <button onClick={() => updateParam("category", "")}>
                  <X size={12} />
                </button>
              </span>
            )}
            {currentSubcategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-xs font-medium rounded-full">
                {currentSubcategory}
                <button onClick={() => updateParam("subcategory", "")}>
                  <X size={12} />
                </button>
              </span>
            )}
            {currentFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-xs font-medium rounded-full">
                {currentFilter === "newArrival"
                  ? "New Arrivals"
                  : "Best Sellers"}
                <button onClick={() => updateParam("filter", "")}>
                  <X size={12} />
                </button>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-xs font-medium rounded-full">
                &quot;{currentSearch}&quot;
                <button onClick={() => updateParam("search", "")}>
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}
