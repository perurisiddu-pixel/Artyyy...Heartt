import { motion } from "motion/react";
import { TESTIMONIALS } from "../constants";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-brand-black/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-gold text-xs uppercase tracking-[0.3em] font-medium"
          >
            Voices of Art Lovers
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif font-bold mt-4"
          >
            Trust in <span className="italic gold-text-gradient">Every Stroke</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass p-10 flex flex-col gap-6 relative"
            >
              <Quote className="absolute top-6 right-6 text-brand-gold/10" size={48} />
              
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="#C9A96E" className="text-brand-gold" />
                ))}
              </div>
              
              <p className="text-lg text-brand-beige/80 font-light leading-relaxed italic">
                "{testimonial.text}"
              </p>
              
              <div className="mt-auto">
                <h4 className="text-brand-beige font-serif font-bold">{testimonial.name}</h4>
                <p className="text-[10px] uppercase tracking-widest text-brand-beige/40">Verified Collector</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
