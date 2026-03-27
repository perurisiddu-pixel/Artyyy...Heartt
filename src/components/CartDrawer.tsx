import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, CreditCard, Truck, Smartphone, CheckCircle2, Loader2 } from "lucide-react";
import { useStore } from "../StoreContext";
import { cn } from "../lib/utils";
import { db, collection, addDoc, handleFirestoreError, OperationType, deleteDoc, getDocs, query, doc } from "../firebase";
import { toast } from "sonner";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = "cart" | "details" | "payment" | "success";

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, user, clearCart } = useStore();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    address: "",
    phone: "",
    paymentMethod: "UPI" as "UPI" | "COD"
  });

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to checkout");
      return;
    }

    if (!formData.address || !formData.phone) {
      toast.error("Please fill in all details");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        userId: user.uid,
        customerName: formData.name,
        email: formData.email,
        address: formData.address,
        phone: formData.phone,
        paymentMethod: formData.paymentMethod,
        items: cart,
        total: cartTotal,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "orders"), orderData);
      
      // Clear cart in Firestore
      const cartPath = `users/${user.uid}/cart`;
      const cartSnap = await getDocs(query(collection(db, cartPath)));
      const deletePromises = cartSnap.docs.map(d => deleteDoc(doc(db, cartPath, d.id)));
      await Promise.all(deletePromises);

      setStep("success");
      toast.success("Order placed successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "orders");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep("cart");
      setFormData({
        name: user?.displayName || "",
        email: user?.email || "",
        address: "",
        phone: "",
        paymentMethod: "UPI"
      });
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 z-[110] bg-brand-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-[120] w-full max-w-md bg-brand-black border-l border-brand-beige/10 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-brand-beige/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-brand-gold" />
                <h2 className="text-xl font-serif font-bold">
                  {step === "cart" && `Your Cart (${cartCount})`}
                  {step === "details" && "Shipping Details"}
                  {step === "payment" && "Payment Method"}
                  {step === "success" && "Order Confirmed"}
                </h2>
              </div>
              <button onClick={resetAndClose} className="text-brand-beige hover:text-brand-gold transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {step === "cart" && (
                <div className="flex flex-col gap-6">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-20 opacity-40">
                      <ShoppingBag size={64} strokeWidth={1} />
                      <p className="text-sm uppercase tracking-widest">Your cart is empty</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 aspect-square bg-brand-beige/5 overflow-hidden rounded-lg">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-serif font-bold">{item.title}</h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-brand-beige/30 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-3 border border-brand-beige/10 rounded-full px-2 py-1">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-brand-beige/50 hover:text-brand-gold"><Minus size={12} /></button>
                              <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-brand-beige/50 hover:text-brand-gold"><Plus size={12} /></button>
                            </div>
                            <span className="text-sm font-medium text-brand-gold">${item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {step === "details" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-brand-beige/40">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-brand-beige/5 border border-brand-beige/10 px-4 py-3 text-sm text-brand-beige focus:border-brand-gold outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-brand-beige/40">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="bg-brand-beige/5 border border-brand-beige/10 px-4 py-3 text-sm text-brand-beige focus:border-brand-gold outline-none"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-brand-beige/40">Delivery Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="bg-brand-beige/5 border border-brand-beige/10 px-4 py-3 text-sm text-brand-beige focus:border-brand-gold outline-none h-32 resize-none"
                      placeholder="House No, Street, City, Pincode"
                    />
                  </div>
                </div>
              )}

              {step === "payment" && (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setFormData({...formData, paymentMethod: "UPI"})}
                    className={cn(
                      "flex items-center justify-between p-6 rounded-xl border transition-all duration-300",
                      formData.paymentMethod === "UPI" ? "border-brand-gold bg-brand-gold/5" : "border-brand-beige/10 hover:border-brand-beige/30"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-lg">
                        <Smartphone size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-serif font-bold">UPI Payment</p>
                        <p className="text-[10px] uppercase tracking-widest text-brand-beige/40">GPay, PhonePe, Paytm</p>
                      </div>
                    </div>
                    {formData.paymentMethod === "UPI" && <CheckCircle2 size={20} className="text-brand-gold" />}
                  </button>

                  <button
                    onClick={() => setFormData({...formData, paymentMethod: "COD"})}
                    className={cn(
                      "flex items-center justify-between p-6 rounded-xl border transition-all duration-300",
                      formData.paymentMethod === "COD" ? "border-brand-gold bg-brand-gold/5" : "border-brand-beige/10 hover:border-brand-beige/30"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-lg">
                        <Truck size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-serif font-bold">Cash on Delivery</p>
                        <p className="text-[10px] uppercase tracking-widest text-brand-beige/40">Pay when you receive</p>
                      </div>
                    </div>
                    {formData.paymentMethod === "COD" && <CheckCircle2 size={20} className="text-brand-gold" />}
                  </button>
                </div>
              )}

              {step === "success" && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-6 bg-brand-gold/10 text-brand-gold rounded-full"
                  >
                    <CheckCircle2 size={64} />
                  </motion.div>
                  <h3 className="text-2xl font-serif font-bold">Order Received!</h3>
                  <p className="text-brand-beige/60 font-light">
                    Your artistic journey has begun. We'll contact you shortly at <strong>{formData.phone}</strong> to confirm your delivery.
                  </p>
                  <button
                    onClick={resetAndClose}
                    className="mt-8 px-12 py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300"
                  >
                    Continue Exploring
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {step !== "success" && cart.length > 0 && (
              <div className="p-6 border-t border-brand-beige/10 bg-brand-beige/5 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <span className="text-brand-beige/50 uppercase tracking-widest text-xs">Total Amount</span>
                  <span className="text-2xl font-serif font-bold text-brand-gold">${cartTotal}</span>
                </div>
                
                {step === "cart" && (
                  <button
                    onClick={() => setStep("details")}
                    className="w-full py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all duration-300 gold-glow"
                  >
                    Proceed to Details <ArrowRight size={18} />
                  </button>
                )}

                {step === "details" && (
                  <div className="flex gap-4">
                    <button onClick={() => setStep("cart")} className="flex-1 py-4 border border-brand-beige/20 text-xs uppercase tracking-widest">Back</button>
                    <button
                      onClick={() => setStep("payment")}
                      disabled={!formData.address || !formData.phone}
                      className="flex-[2] py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest disabled:opacity-50"
                    >
                      Continue to Payment
                    </button>
                  </div>
                )}

                {step === "payment" && (
                  <div className="flex gap-4">
                    <button onClick={() => setStep("details")} className="flex-1 py-4 border border-brand-beige/20 text-xs uppercase tracking-widest">Back</button>
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="flex-[2] py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                      {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <><CreditCard size={18} /> Place Order</>}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
