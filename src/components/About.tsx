import { motion } from "motion/react";

export default function About() {
  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] lg:aspect-square"
        >
          <img
            src="https://picsum.photos/seed/artist/1000/1200"
            alt="The Artist"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute -bottom-8 -right-8 w-48 h-48 border border-brand-gold/30 hidden md:block" />
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-brand-gold/10 hidden md:block" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8"
        >
          <span className="text-brand-gold text-xs uppercase tracking-[0.3em] font-medium">
            The Story Behind
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
            Every stroke tells <br />
            <span className="italic gold-text-gradient">a story</span>
          </h2>
          <p className="text-lg text-brand-beige/70 font-light leading-relaxed">
            Artyy..Hearttt is more than just a gallery. It is a space where emotions become art, 
            and where the silent whispers of the soul find their voice on canvas. 
            Founded with a passion for authenticity and premium craftsmanship.
          </p>
          <p className="text-lg text-brand-beige/70 font-light leading-relaxed">
            Each piece is meticulously handcrafted, blending traditional techniques with modern 
            sensibilities. We believe that art should not just decorate a room, but inspire 
            the people within it.
          </p>
          
          <div className="grid grid-cols-2 gap-8 mt-4">
            <div>
              <h4 className="text-2xl font-serif font-bold text-brand-gold mb-2">100%</h4>
              <p className="text-xs uppercase tracking-widest text-brand-beige/50">Handmade</p>
            </div>
            <div>
              <h4 className="text-2xl font-serif font-bold text-brand-gold mb-2">Unique</h4>
              <p className="text-xs uppercase tracking-widest text-brand-beige/50">One-of-a-kind</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
