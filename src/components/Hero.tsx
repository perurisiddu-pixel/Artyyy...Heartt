import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/seed/art-hero/1920/1080?blur=2"
          alt="Artistic background"
          className="w-full h-full object-cover opacity-40 scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-brand-black/40 to-brand-black" />
      </div>

      <div className="relative z-10 max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="inline-block text-brand-gold text-sm uppercase tracking-[0.3em] mb-6 font-medium">
            Handcrafted Masterpieces
          </span>
          <h1 className="text-5xl md:text-8xl font-serif font-bold mb-8 leading-[1.1] tracking-tight">
            Art that speaks <br />
            <span className="italic gold-text-gradient">your soul</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-beige/70 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Every stroke tells a story. Artyy..Hearttt is a space where emotions become art, 
            bringing premium, handcrafted paintings to your home.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="#collection"
              className="group relative px-10 py-4 bg-brand-gold text-brand-black font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="#about"
              className="px-10 py-4 border border-brand-beige/20 text-brand-beige font-medium hover:bg-brand-beige/5 transition-all duration-300"
            >
              Explore Collection
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-brand-beige/40">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-brand-gold to-transparent" />
      </motion.div>
    </section>
  );
}
