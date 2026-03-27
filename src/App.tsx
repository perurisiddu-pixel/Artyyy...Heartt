import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { StoreProvider } from "./StoreContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Collection from "./components/Collection";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import ArtConsultant from "./components/ArtConsultant";
import Footer from "./components/Footer";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import DiscountPopup from "./components/DiscountPopup";
import AdminPanel from "./components/AdminPanel";
import { Product } from "./types";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, ShieldCheck, Heart } from "lucide-react";

function HomePage({ onQuickView }: { onQuickView: (p: Product) => void }) {
  return (
    <main>
      <Hero />
      <Collection onQuickView={onQuickView} />
      <About />
      <ArtConsultant />
      
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gold/5 opacity-50" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-12 md:p-20 rounded-3xl border-brand-gold/20"
          >
            <Sparkles className="text-brand-gold mx-auto mb-8" size={40} />
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight">
              Own a piece of <br />
              <span className="italic gold-text-gradient">art today</span>
            </h2>
            <p className="text-lg text-brand-beige/60 mb-12 max-w-xl mx-auto font-light leading-relaxed">
              Experience the emotional resonance of handcrafted art in your own home. 
              Each piece is a unique journey of expression.
            </p>
            <a
              href="#collection"
              className="inline-flex items-center gap-3 px-12 py-5 bg-brand-gold text-brand-black font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300 gold-glow"
            >
              Shop the Collection <ArrowRight size={20} />
            </a>
            
            <div className="flex flex-wrap justify-center gap-8 mt-16 opacity-40">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                <ShieldCheck size={16} /> Secure Checkout
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                <Heart size={16} /> Made with Love
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                <Sparkles size={16} /> Unique Pieces
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Testimonials />
    </main>
  );
}

function AppContent() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-brand-black text-brand-beige selection:bg-brand-gold selection:text-brand-black">
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: "#0D0D0D",
              border: "1px solid rgba(201, 169, 110, 0.2)",
              color: "#F5E6DA",
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
        
        <Navbar onOpenCart={() => setIsCartOpen(true)} />
        
        <Routes>
          <Route path="/" element={<HomePage onQuickView={setSelectedProduct} />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>

        <Footer />

        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />
        <DiscountPopup />
      </div>
    </Router>
  );
}

import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}
