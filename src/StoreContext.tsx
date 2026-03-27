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
  getDoc,
  setDoc,
  doc, 
  handleFirestoreError, 
  OperationType,
  setPersistence,
  browserLocalPersistence
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

  // Auth Listener & User Document Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);

      if (currentUser) {
        // Ensure user document exists in Firestore
        const userRef = doc(db, "users", currentUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: currentUser.email === "perurisiddu@gmail.com" ? "admin" : "user",
              createdAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error syncing user document:", error);
        }
      }
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
    const toastId = toast.loading("Logging in...");
    try {
      await setPersistence(auth, browserLocalPersistence);
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        toast.success("Successfully logged in", { id: toastId });
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/popup-blocked') {
        toast.error("Login popup was blocked. Please allow popups in your browser or try opening the app in a new tab.", {
          id: toastId,
          duration: 6000,
        });
      } else if (error.code === 'auth/network-request-failed') {
        toast.error("Network error during login. This may be caused by an ad blocker or strict privacy settings. Please try disabling them or use a different browser.", { id: toastId });
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error("This domain is not authorized for login in Firebase. Please add the current domain to your Firebase Console authorized domains list.", {
          id: toastId,
          duration: 10000,
        });
      } else {
        toast.error(`Login failed: ${error.message || "Please try again."}`, { id: toastId });
      }
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
      // Check for existing item using productId
      const existing = cart.find(item => item.productId === product.id);
      
      if (existing) {
        await updateDoc(doc(db, cartPath, existing.id), {
          quantity: existing.quantity + 1
        });
      } else {
        await addDoc(collection(db, cartPath), {
          ...product,
          productId: product.id,
          quantity: 1,
          userId: user.uid,
          addedAt: new Date().toISOString()
        });
      }
      toast.success(`${product.title} added to cart`);
    } catch (error) {
      console.error("Add to cart failed:", error);
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
