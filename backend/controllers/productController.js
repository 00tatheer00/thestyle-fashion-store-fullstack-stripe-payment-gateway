const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      featured,
      newArrival,
      bestSeller,
      sort,
      page = 1,
      limit = 12,
      search,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (featured === "true") filter.featured = true;
    if (newArrival === "true") filter.newArrival = true;
    if (bestSeller === "true") filter.bestSeller = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "name") sortOption = { name: 1 };
    if (sort === "rating") sortOption = { rating: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Get product error:", error.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

exports.getCategories = async (_req, res) => {
  try {
    const categories = await Product.distinct("category");
    const subcategories = await Product.distinct("subcategory");
    res.json({ categories, subcategories });
  } catch (error) {
    console.error("Get categories error:", error.message);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
