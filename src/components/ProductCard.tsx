import { motion } from "motion/react";
import { Heart, ShoppingBag, Plus, ZoomIn } from "lucide-react";
import { Product } from "../types";
import { useStore } from "../StoreContext";
import { cn } from "../lib/utils";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const isWishlisted = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative flex flex-col gap-4"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-black/20">
        <img
          src={product.image}
          alt={product.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
            product.isSold && "grayscale opacity-50"
          )}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Overlay Actions */}
        {!product.isSold && (
          <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            <button
              onClick={() => onQuickView(product)}
              className="p-3 bg-brand-beige text-brand-black rounded-full hover:bg-brand-gold transition-colors"
              title="Quick View"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={() => addToCart(product)}
              className="p-3 bg-brand-beige text-brand-black rounded-full hover:bg-brand-gold transition-colors"
              title="Add to Cart"
            >
              <ShoppingBag size={20} />
            </button>
          </div>
        )}

        {product.isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-black/40">
            <span className="px-6 py-2 bg-brand-black text-brand-gold border border-brand-gold text-[10px] uppercase tracking-widest font-bold">
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full transition-all duration-300",
            isWishlisted ? "bg-brand-gold text-brand-black" : "bg-brand-black/40 text-brand-beige hover:bg-brand-black/60"
          )}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Category Tag */}
        <div className="absolute top-4 left-4 px-3 py-1 glass text-[10px] uppercase tracking-widest text-brand-beige/80">
          {product.category}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-serif font-medium text-brand-beige group-hover:text-brand-gold transition-colors">
            {product.title}
          </h3>
          <span className="text-brand-gold font-medium">${product.price}</span>
        </div>
        <p className="text-xs text-brand-beige/50 uppercase tracking-widest">{product.size}</p>
        {!product.isSold && (
          <p className="text-[10px] text-brand-gold uppercase tracking-widest font-medium mt-1">
            Only 1 piece available
          </p>
        )}
      </div>
      
      <button
        onClick={() => addToCart(product)}
        disabled={product.isSold}
        className={cn(
          "mt-2 w-full py-3 border border-brand-beige/10 text-xs uppercase tracking-widest font-medium transition-all duration-300 flex items-center justify-center gap-2",
          product.isSold 
            ? "opacity-50 cursor-not-allowed" 
            : "hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold"
        )}
      >
        {product.isSold ? "Sold Out" : <><Plus size={14} /> Add to Cart</>}
      </button>
    </motion.div>
  );
}
