import { motion } from "framer-motion";

export default function Marquee({
  items = ["Free Shipping Over $200", "New Arrivals Weekly", "Sustainably Crafted", "Easy Returns", "Premium Quality"],
  speed = 25,
}) {
  const duplicated = [...items, ...items];

  return (
    <div className="overflow-hidden bg-brand-50 py-3 border-y border-brand-100">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {duplicated.map((item, i) => (
          <span
            key={i}
            className="text-[11px] tracking-[0.25em] uppercase text-brand-600 font-medium mx-10"
          >
            {item}
            <span className="ml-10 text-brand-300">&mdash;</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
