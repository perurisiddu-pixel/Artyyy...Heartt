import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Heart, Menu, X, User, LogOut, LogIn, LayoutGrid } from "lucide-react";
import { useStore } from "../StoreContext";
import { cn } from "../lib/utils";

interface NavbarProps {
  onOpenCart: () => void;
}

export default function Navbar({ onOpenCart }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, wishlist, user, login, logout, isAdmin } = useStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Collection", href: "#collection" },
    { name: "About", href: "#about" },
    { name: "Consultant", href: "#consultant" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
        isScrolled ? "glass py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button 
            className="lg:hidden text-brand-beige"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <a href="/" className="text-2xl font-serif font-bold tracking-tighter gold-text-gradient">
            Artyy..Hearttt
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm uppercase tracking-widest text-brand-beige/70 hover:text-brand-gold transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-brand-beige hover:text-brand-gold transition-colors">
            <Heart size={22} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>
          
          <button 
            onClick={onOpenCart}
            className="relative text-brand-beige hover:text-brand-gold transition-colors"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-8 h-8 rounded-full border border-brand-gold/20" />
                <span className="text-xs font-medium text-brand-beige/70">{user.displayName}</span>
              </div>
              <button 
                onClick={logout}
                className="text-brand-beige/40 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
              {isAdmin && (
                <a 
                  href="/admin" 
                  className="hidden md:flex items-center gap-2 px-4 py-2 border border-brand-gold/30 text-brand-gold text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-black transition-all"
                >
                  <LayoutGrid size={14} /> Manage Store
                </a>
              )}
            </div>
          ) : (
            <button 
              onClick={login}
              className="flex items-center gap-2 text-brand-beige hover:text-brand-gold transition-colors"
            >
              <LogIn size={20} />
              <span className="hidden sm:inline text-xs uppercase tracking-widest font-bold">Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-brand-black flex flex-col p-8"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-brand-beige">
                <X size={32} />
              </button>
            </div>
            
            <div className="flex flex-col gap-8 mt-12">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-serif text-brand-beige hover:text-brand-gold transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
