"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/app/firebaseConfig"; // Firebase configuration
import { onAuthStateChanged, User } from "firebase/auth"; // Firebase authentication
import { useRouter } from "next/navigation";

// Create a Context for Auth
const AuthContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  return useContext(AuthContext); // Custom hook to access auth context
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed: ", currentUser);
      setUser(currentUser);
      setLoading(false); // Set loading to false after auth state is determined
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin"); // Redirect only if user is not authenticated and loading is complete
    }
  }, [loading, user, router]);
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
