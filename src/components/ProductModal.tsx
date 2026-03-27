import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Heart, Check, ShieldCheck, Palette, Sparkles } from "lucide-react";
import { Product } from "../types";
import { useStore } from "../StoreContext";
import { cn } from "../lib/utils";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  
  if (!product) return null;
  const isWishlisted = isInWishlist(product.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl glass rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 bg-brand-black/60 text-brand-beige rounded-full hover:bg-brand-black transition-colors"
          >
            <X size={20} />
          </button>

          <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative">
            <img
              src={product.image}
              alt={product.title}
              className={cn(
                "w-full h-full object-cover",
                product.isSold && "grayscale opacity-50"
              )}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            {product.isSold && (
              <div className="absolute inset-0 flex items-center justify-center bg-brand-black/40">
                <span className="px-8 py-3 bg-brand-black text-brand-gold border border-brand-gold text-xs uppercase tracking-widest font-bold">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col gap-8">
            <div>
              <span className="text-brand-gold text-xs uppercase tracking-[0.3em] font-medium mb-4 block">
                {product.category}
              </span>
              <h2 className="text-4xl font-serif font-bold mb-4">{product.title}</h2>
              <div className="flex items-center gap-4">
                <p className="text-2xl text-brand-gold font-medium">${product.price}</p>
                {!product.isSold && (
                  <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] uppercase tracking-widest font-bold rounded-full">
                    Only 1 piece available
                  </span>
                )}
              </div>
            </div>

            <p className="text-brand-beige/70 font-light leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-6 py-6 border-y border-brand-beige/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold">
                  <Check size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-beige/40">Size</p>
                  <p className="text-sm font-medium">{product.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold">
                  <Palette size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-beige/40">Medium</p>
                  <p className="text-sm font-medium">Oil on Canvas</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.isSold}
                  className={cn(
                    "flex-1 py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300",
                    product.isSold 
                      ? "bg-brand-beige/10 text-brand-beige/30 cursor-not-allowed" 
                      : "bg-brand-gold text-brand-black hover:scale-[1.02] gold-glow"
                  )}
                >
                  <ShoppingBag size={20} /> {product.isSold ? "Sold Out" : "Add to Cart"}
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={cn(
                    "p-4 border border-brand-beige/20 rounded-lg transition-all duration-300",
                    isWishlisted ? "bg-brand-gold text-brand-black border-brand-gold" : "text-brand-beige hover:bg-brand-beige/5"
                  )}
                >
                  <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-4 opacity-50">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest">
                  <ShieldCheck size={14} /> Secure Payment
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest">
                  <Sparkles size={14} /> 100% Handmade
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
