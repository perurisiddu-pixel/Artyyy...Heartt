import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, Save, LayoutGrid, Package, Clock, CheckCircle, Truck, User as UserIcon, Smartphone, CreditCard } from "lucide-react";
import { PRODUCTS } from "../constants";
import { Product } from "../types";
import { toast } from "sonner";
import { useStore } from "../StoreContext";
import { db, collection, onSnapshot, query, orderBy, handleFirestoreError, OperationType, deleteDoc, doc, addDoc, updateDoc } from "../firebase";
import { cn } from "../lib/utils";

export default function AdminPanel() {
  const { isAdmin, user } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"inventory" | "orders">("inventory");
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: "",
    description: "",
    price: 0,
    category: "Abstract",
    size: "",
    image: "https://picsum.photos/seed/new-art/800/1000"
  });

  // Load Products
  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "products"));
    return () => unsubscribe();
  }, [isAdmin]);

  // Load Orders
  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "orders"));
    return () => unsubscribe();
  }, [isAdmin]);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-black p-6">
        <div className="glass p-12 rounded-3xl text-center max-w-md">
          <h2 className="text-3xl font-serif font-bold mb-4">Access Denied</h2>
          <p className="text-brand-beige/60 mb-8">You do not have permission to access the admin dashboard.</p>
          <a href="/" className="px-8 py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  const handleAdd = async () => {
    if (!newProduct.title || !newProduct.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      await addDoc(collection(db, "products"), {
        ...newProduct,
        isFeatured: true,
        isSold: false,
        createdAt: new Date().toISOString()
      });
      setNewProduct({
        title: "",
        description: "",
        price: 0,
        category: "Abstract",
        size: "",
        image: "https://picsum.photos/seed/new-art/800/1000"
      });
      toast.success("Artwork published to store!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "products");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    try {
      await deleteDoc(doc(db, "products", productId));
      toast.success("Artwork removed from store");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    }
  };

  const toggleSoldStatus = async (product: Product) => {
    try {
      await updateDoc(doc(db, "products", product.id), {
        isSold: !product.isSold
      });
      toast.success(`Artwork marked as ${!product.isSold ? "Sold" : "Available"}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${product.id}`);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-brand-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-4">
            <LayoutGrid className="text-brand-gold" size={32} />
            <h1 className="text-4xl font-serif font-bold">Admin <span className="italic gold-text-gradient">Dashboard</span></h1>
          </div>

          <div className="flex bg-brand-beige/5 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("inventory")}
              className={cn(
                "px-6 py-2 rounded-lg text-xs uppercase tracking-widest font-bold transition-all",
                activeTab === "inventory" ? "bg-brand-gold text-brand-black" : "text-brand-beige/40 hover:text-brand-beige"
              )}
            >
              Inventory
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={cn(
                "px-6 py-2 rounded-lg text-xs uppercase tracking-widest font-bold transition-all",
                activeTab === "orders" ? "bg-brand-gold text-brand-black" : "text-brand-beige/40 hover:text-brand-beige"
              )}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>

        {activeTab === "inventory" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="glass p-8 rounded-2xl sticky top-32">
                <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-brand-gold" /> Add New Painting
                </h3>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    className="bg-brand-beige/5 border border-brand-beige/10 px-4 py-3 text-sm text-brand-beige focus:border-brand-gold outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Price ($)"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="bg-brand-beige/5 border border-brand-beige/10 px-4 py-3 text-sm text-brand-beige focus:border-brand-gold outline-none"
                  />
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="bg-brand-beige/5 border border-brand-beige/10 px-4 py-3 text-sm text-brand-beige focus:border-brand-gold outline-none"
                  >
                    <option value="Abstract">Abstract</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Floral">Floral</option>
                    <option value="Urban">Urban</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Size (e.g. 24x36 inches)"
                    value={newProduct.size}
                    onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                    className="bg-brand-beige/5 border border-brand-beige/10 px-4 py-3 text-sm text-brand-beige focus:border-brand-gold outline-none"
                  />
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="bg-brand-beige/5 border border-brand-beige/10 px-4 py-3 text-sm text-brand-beige focus:border-brand-gold outline-none h-24 resize-none"
                  />
                  <button
                    onClick={handleAdd}
                    className="w-full py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-all duration-300 gold-glow"
                  >
                    Publish Artwork
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              {products.map((product) => (
                <div key={product.id} className="glass p-4 rounded-xl flex items-center gap-6">
                  <img 
                    src={product.image} 
                    className={cn(
                      "w-16 h-16 rounded-lg object-cover",
                      product.isSold && "grayscale opacity-50"
                    )} 
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <h4 className="font-serif font-bold">{product.title}</h4>
                    <p className="text-xs text-brand-beige/40 uppercase tracking-widest">
                      ${product.price} • {product.category} • {product.isSold ? <span className="text-red-400">Sold</span> : <span className="text-green-400">Available</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSoldStatus(product)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all",
                        product.isSold ? "bg-green-400/10 text-green-400 hover:bg-green-400/20" : "bg-red-400/10 text-red-400 hover:bg-red-400/20"
                      )}
                    >
                      {product.isSold ? "Mark Available" : "Mark Sold"}
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-brand-beige/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.length === 0 ? (
              <div className="glass p-20 text-center opacity-40 rounded-3xl">
                <Package size={64} className="mx-auto mb-6" />
                <p className="uppercase tracking-widest text-sm">No orders received yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-8 rounded-2xl border-l-4 border-brand-gold"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-widest rounded-full">
                          {order.status}
                        </span>
                        <span className="text-[10px] text-brand-beige/40 uppercase tracking-widest flex items-center gap-1">
                          <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-brand-beige/5 rounded-full text-brand-gold">
                          <UserIcon size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-serif font-bold">{order.customerName}</h3>
                          <p className="text-sm text-brand-beige/60">{order.email} • {order.phone}</p>
                          <p className="text-sm text-brand-beige/60 mt-2 italic">{order.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 pt-6 border-t border-brand-beige/5">
                        <div className="flex items-center gap-2">
                          {order.paymentMethod === "UPI" ? (
                            <Smartphone size={16} className="text-brand-gold" />
                          ) : order.paymentMethod === "Razorpay" ? (
                            <CreditCard size={16} className="text-brand-gold" />
                          ) : (
                            <Truck size={16} className="text-brand-gold" />
                          )}
                          <span className="text-xs uppercase tracking-widest font-bold">{order.paymentMethod}</span>
                        </div>
                        <div className="text-xl font-serif font-bold text-brand-gold">Total: ${order.total}</div>
                      </div>
                    </div>

                    <div className="w-full lg:w-80 flex flex-col gap-3">
                      <p className="text-[10px] uppercase tracking-widest text-brand-beige/40 mb-2">Order Items</p>
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-brand-beige/5 rounded-lg">
                          <img 
                            src={item.image} 
                            className="w-10 h-10 rounded object-cover" 
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1">
                            <p className="text-xs font-bold truncate">{item.title}</p>
                            <p className="text-[10px] text-brand-beige/40">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
