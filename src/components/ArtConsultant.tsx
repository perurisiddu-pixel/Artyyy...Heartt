import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import { Upload, Sparkles, X, Loader2, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";

export default function ArtConsultant() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeSpace = async () => {
    if (!image) return;
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = image.split(",")[1];
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: "image/jpeg",
                },
              },
              {
                text: "You are an expert interior designer and art consultant for the brand 'Artyy..Hearttt'. Analyze this room and suggest what kind of paintings (abstract, landscape, floral, etc.), color palettes (gold, beige, dark, vibrant), and sizes would best suit this space. Be poetic, professional, and inspiring. Mention how Artyy..Hearttt pieces can elevate the emotional resonance of this specific room.",
              },
            ],
          },
        ],
      });

      setAnalysis(response.text);
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysis("I'm sorry, I couldn't analyze your space right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="consultant" className="py-24 px-6 bg-brand-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-gold text-xs uppercase tracking-[0.3em] font-medium"
          >
            AI Art Consultant
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif font-bold mt-4"
          >
            Visualize Art in <span className="italic gold-text-gradient">Your Space</span>
          </motion.h2>
          <p className="text-brand-beige/60 mt-6 max-w-2xl mx-auto font-light">
            Upload a photo of your room, and our AI consultant will recommend the perfect 
            Artyy..Hearttt masterpiece to elevate your environment.
          </p>
        </div>

        <div className="glass p-8 md:p-12 rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col gap-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative aspect-video rounded-xl border-2 border-dashed border-brand-beige/20 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-brand-gold/50 group overflow-hidden",
                  image ? "border-none" : "bg-brand-beige/5"
                )}
              >
                {image ? (
                  <>
                    <img src={image} alt="Your space" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-brand-beige text-sm uppercase tracking-widest font-medium">Change Photo</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(null);
                        setAnalysis(null);
                      }}
                      className="absolute top-4 right-4 p-2 bg-brand-black/60 text-brand-beige rounded-full hover:bg-brand-black transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-brand-beige/40 group-hover:text-brand-gold transition-colors">
                    <Upload size={48} strokeWidth={1} />
                    <p className="text-sm uppercase tracking-widest font-medium">Upload Room Photo</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <button
                onClick={analyzeSpace}
                disabled={!image || isLoading}
                className={cn(
                  "w-full py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300",
                  (!image || isLoading) ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] gold-glow"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} /> Get Recommendations
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 text-brand-gold">
                <ImageIcon size={20} />
                <h3 className="text-xl font-serif font-bold">Consultant's Insight</h3>
              </div>
              
              <div className="min-h-[200px] text-brand-beige/80 font-light leading-relaxed prose prose-invert prose-brand prose-sm max-w-none">
                {analysis ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-brand-beige/20 text-center gap-4 py-12 border border-brand-beige/5 rounded-xl">
                    <Sparkles size={32} strokeWidth={1} />
                    <p>Upload a photo to receive personalized art recommendations.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
