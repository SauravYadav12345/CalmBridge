"use client";
import ObjectivePage from "../objective/page";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  User,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<{
    name: string;
    email: string;
  }>({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true); // Ensures it runs on the client-side
  }, []);

  useEffect(() => {
    if (mounted) {
      const fetchOrCreateUserDocument = async (currentUser: User | null) => {
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              name: currentUser.displayName || "Default Name",
              email: currentUser.email,
              createdAt: new Date(),
            });
            setProfileData({
              name: currentUser.displayName || "Default Name",
              email: currentUser.email || "No Email",
            });
          } else {
            const data = userSnap.data();
            setProfileData({
              name: data.name || "Default Name",
              email: data.email || "No Email",
            });
          }
        }
        setLoading(false);
      };

      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          fetchOrCreateUserDocument(currentUser);
        } else {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }
  }, [mounted]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfileData({ name: "", email: "" });
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleUpdateDisplayName = async () => {
    const newName = prompt("Enter your name:");

    if (newName) {
      try {
        await updateDoc(doc(db, "users", user?.uid || ""), {
          name: newName,
        });

        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: newName,
          });
          setProfileData((prev) => ({ ...prev, name: newName }));
        }
      } catch (error) {
        console.error("Error updating display name:", error);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // Conditionally render the profile info or "Sign In" message
  const displayName = user
    ? profileData.name.slice(0, 2).toUpperCase()
    : "Sign In";

  return (
    <div className="flex flex-col items-center p-6">
      <div className="mt-0 w-full mb-5" >
        <Navbar />
      </div>
      {/* Dummy Profile Picture */}
      <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
        <span className="text-2xl font-bold text-white">{displayName}</span>
      </div>

      {/* User Information */}
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">
          {profileData.name || "Name not available"}
        </h1>
        <p className="text-gray-600">
          {profileData.email || "Email not available"}
        </p>
      </div>

      {/* Update Display Name Button */}
      {user && (
        <button
          onClick={handleUpdateDisplayName}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Update Name
        </button>
      )}

      {/* Logout Button */}
      {user && (
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Log Out
        </button>
      )}

      <div className="w-full mt-5" >
        <ObjectivePage />
      </div>

    </div>
  );
};

export default ProfilePage;
