import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PRODUCTS } from "../constants";
import ProductCard from "./ProductCard";
import { Product } from "../types";
import { db, collection, onSnapshot, query, orderBy } from "../firebase";

interface CollectionProps {
  onQuickView: (product: Product) => void;
}

export default function Collection({ onQuickView }: CollectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setProducts(fetchedProducts);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching products:", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const displayProducts = products.length > 0 ? products : PRODUCTS;
  const sortedProducts = [...displayProducts].sort((a, b) => {
    if (a.isSold && !b.isSold) return 1;
    if (!a.isSold && b.isSold) return -1;
    return 0;
  });
  const featuredProducts = sortedProducts.filter(p => p.isFeatured);

  return (
    <section id="collection" className="py-24 px-6 bg-brand-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-brand-gold text-xs uppercase tracking-[0.3em] font-medium mb-4 block"
            >
              Curated Selection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-serif font-bold leading-tight"
            >
              Featured <span className="italic gold-text-gradient">Collection</span>
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            <button className="text-sm uppercase tracking-widest text-brand-beige/60 hover:text-brand-gold transition-colors pb-1 border-b border-brand-beige/20">
              View All Artworks
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
