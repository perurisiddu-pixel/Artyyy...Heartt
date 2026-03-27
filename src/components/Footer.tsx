import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-black border-t border-brand-beige/5 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <div className="flex flex-col gap-8">
          <a href="/" className="text-3xl font-serif font-bold tracking-tighter gold-text-gradient">
            Artyy..Hearttt
          </a>
          <p className="text-brand-beige/50 font-light leading-relaxed">
            Bringing the silent whispers of the soul to life on canvas. 
            Premium, handcrafted art for modern spaces.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-brand-beige/40 hover:text-brand-gold transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-brand-beige/40 hover:text-brand-gold transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-brand-beige/40 hover:text-brand-gold transition-colors">
              <Facebook size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-brand-beige font-serif font-bold mb-8 uppercase tracking-widest text-sm">Navigation</h4>
          <ul className="flex flex-col gap-4">
            <li><a href="#" className="text-brand-beige/50 hover:text-brand-gold transition-colors text-sm">Home</a></li>
            <li><a href="#collection" className="text-brand-beige/50 hover:text-brand-gold transition-colors text-sm">Collection</a></li>
            <li><a href="#about" className="text-brand-beige/50 hover:text-brand-gold transition-colors text-sm">About Story</a></li>
            <li><a href="#consultant" className="text-brand-beige/50 hover:text-brand-gold transition-colors text-sm">AI Consultant</a></li>
            <li><a href="/admin" className="text-brand-beige/50 hover:text-brand-gold transition-colors text-sm">Admin Panel</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-brand-beige font-serif font-bold mb-8 uppercase tracking-widest text-sm">Contact</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-3 text-brand-beige/50 text-sm">
              <Mail size={16} className="text-brand-gold" />
              hello@artyyhearttt.com
            </li>
            <li className="flex items-center gap-3 text-brand-beige/50 text-sm">
              <Phone size={16} className="text-brand-gold" />
              +1 (234) 567-890
            </li>
            <li className="flex items-center gap-3 text-brand-beige/50 text-sm">
              <MapPin size={16} className="text-brand-gold" />
              Art District, Milan, Italy
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-brand-beige font-serif font-bold mb-8 uppercase tracking-widest text-sm">Newsletter</h4>
          <p className="text-brand-beige/50 text-sm mb-6 leading-relaxed">
            Subscribe to receive updates on new collections and exclusive offers.
          </p>
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-brand-beige/5 border border-brand-beige/10 px-4 py-3 text-sm text-brand-beige focus:outline-none focus:border-brand-gold transition-colors"
            />
            <button className="bg-brand-gold text-brand-black py-3 text-xs uppercase tracking-widest font-bold hover:scale-[1.02] transition-all duration-300">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-brand-beige/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-brand-beige/30 text-[10px] uppercase tracking-widest">
          © 2026 Artyy..Hearttt. All rights reserved.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-brand-beige/30 hover:text-brand-gold transition-colors text-[10px] uppercase tracking-widest">Privacy Policy</a>
          <a href="#" className="text-brand-beige/30 hover:text-brand-gold transition-colors text-[10px] uppercase tracking-widest">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
