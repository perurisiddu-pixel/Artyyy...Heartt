import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Sparkles } from "lucide-react";

export default function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenDiscount");
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenDiscount", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass rounded-2xl overflow-hidden flex flex-col md:flex-row"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 text-brand-beige/40 hover:text-brand-beige transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-full md:w-1/2 aspect-square md:aspect-auto">
              <img
                src="https://picsum.photos/seed/discount/600/800"
                alt="Exclusive Offer"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center gap-6">
              <div className="flex items-center gap-2 text-brand-gold">
                <Sparkles size={16} />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Exclusive Offer</span>
              </div>
              
              <h2 className="text-3xl font-serif font-bold leading-tight">
                Unlock <span className="italic gold-text-gradient">15% Off</span> <br />
                Your First Piece
              </h2>
              
              <p className="text-brand-beige/60 text-sm font-light leading-relaxed">
                Join our circle of art lovers and receive exclusive updates on new collections 
                and private events.
              </p>

              <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-beige/30" size={16} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-brand-beige/5 border border-brand-beige/10 pl-10 pr-4 py-3 text-sm text-brand-beige focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-all duration-300 gold-glow"
                >
                  Claim My Discount
                </button>
              </form>
              
              <button
                onClick={handleClose}
                className="text-[10px] uppercase tracking-widest text-brand-beige/30 hover:text-brand-beige transition-colors"
              >
                No thanks, I'll pay full price
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
