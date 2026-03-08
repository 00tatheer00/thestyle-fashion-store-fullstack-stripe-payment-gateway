import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Outerwear",
    subtitle: "Elevated layers",
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80",
    link: "/shop?subcategory=Outerwear",
    span: "col-span-2 row-span-2",
  },
  {
    title: "Dresses",
    subtitle: "Effortless elegance",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    link: "/shop?subcategory=Dresses",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Accessories",
    subtitle: "Finishing touches",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    link: "/shop?category=Accessories",
    span: "col-span-1 row-span-1",
  },
];

export default function FeaturedGrid() {
  return (
    <section className="section-padding py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="label-sm mb-3">Curated For You</p>
        <h2 className="heading-lg">Shop by Category</h2>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 auto-rows-[250px] lg:auto-rows-[300px]">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className={cat.span}
          >
            <Link
              to={cat.link}
              className="group relative block w-full h-full overflow-hidden rounded-sm"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mb-1">
                  {cat.subtitle}
                </p>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl lg:text-2xl text-white font-medium">
                    {cat.title}
                  </h3>
                  <ArrowRight
                    size={18}
                    className="text-white transition-transform group-hover:translate-x-2"
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
