import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "./types";
import { toast } from "sonner";
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signInWithPopup, 
  googleProvider, 
  signOut, 
  User, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  handleFirestoreError, 
  OperationType 
} from "./firebase";

interface StoreContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthReady: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Cart Listener (Firestore Sync)
  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    const cartPath = `users/${user.uid}/cart`;
    const q = query(collection(db, cartPath));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as CartItem[];
      setCart(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, cartPath);
    });

    return () => unsubscribe();
  }, [user]);

  // Wishlist Sync (Local Storage)
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Successfully logged in");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.info("Logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const addToCart = async (product: Product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      login();
      return;
    }

    const cartPath = `users/${user.uid}/cart`;
    try {
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        await updateDoc(doc(db, cartPath, existing.id), {
          quantity: existing.quantity + 1
        });
      } else {
        await addDoc(collection(db, cartPath), {
          ...product,
          productId: product.id,
          quantity: 1,
          userId: user.uid
        });
      }
      toast.success(`${product.title} added to cart`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, cartPath);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    const cartPath = `users/${user.uid}/cart`;
    try {
      await deleteDoc(doc(db, cartPath, productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, cartPath);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user || quantity < 1) return;
    const cartPath = `users/${user.uid}/cart`;
    try {
      await updateDoc(doc(db, cartPath, productId), { quantity });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, cartPath);
    }
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        toast.info(`${product.title} removed from wishlist`);
        return prev.filter((item) => item.id !== product.id);
      }
      toast.success(`${product.title} added to wishlist`);
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isAdmin = user?.email === "perurisiddu@gmail.com";

  return (
    <StoreContext.Provider
      value={{
        user,
        isAdmin,
        isAuthReady,
        login,
        logout,
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
