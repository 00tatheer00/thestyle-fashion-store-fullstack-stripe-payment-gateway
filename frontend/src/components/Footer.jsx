import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "New Arrivals", path: "/shop?filter=newArrival" },
    { label: "Best Sellers", path: "/shop?filter=bestSeller" },
    { label: "Dresses", path: "/shop?subcategory=Dresses" },
    { label: "Outerwear", path: "/shop?subcategory=Outerwear" },
    { label: "Accessories", path: "/shop?category=Accessories" },
  ],
  Help: [
    { label: "Contact Us", path: "#" },
    { label: "Shipping & Returns", path: "#" },
    { label: "Size Guide", path: "#" },
    { label: "FAQ", path: "#" },
    { label: "Track Order", path: "#" },
  ],
  About: [
    { label: "Our Story", path: "#" },
    { label: "Sustainability", path: "#" },
    { label: "Careers", path: "#" },
    { label: "Press", path: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white mt-auto">
      {/* Newsletter */}
      <div className="section-padding py-16 border-b border-white/10">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="font-display text-2xl sm:text-3xl mb-3">
            Join the community
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Be the first to know about new arrivals, exclusive offers, and style
            inspiration.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-colors"
            />
            <button className="px-6 py-3 bg-white text-gray-900 text-sm tracking-wider uppercase font-medium hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="section-padding py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="font-display text-2xl font-medium mb-6 block">
              TheStyle
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Minimal fashion for the modern woman. Timeless pieces crafted with
              intention.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center border border-white/10 hover:border-white/40 transition-colors"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[11px] tracking-[0.2em] uppercase font-medium mb-6">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="section-padding py-6 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} TheStyle. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
