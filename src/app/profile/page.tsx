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
  const [profileData, setProfileData] = useState<{ name: string; email: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrCreateUserDocument = async (currentUser: User | null) => {
      try {
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
            setProfileData(userSnap.data() as { name: string; email: string });
          }
        }
      } catch (error) {
        console.error("Error fetching/creating user document:", error);
      } finally {
        setLoading(false);
      }
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
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfileData(null);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleUpdateDisplayName = async () => {
    const newName = prompt("Enter your name (max 50 characters):");

    if (newName && newName.trim().length > 0 && newName.length <= 50) {
      try {
        await updateDoc(doc(db, "users", user?.uid || ""), { name: newName });

        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: newName });
          setProfileData((prev) => (prev ? { ...prev, name: newName } : null));
        }
      } catch (error) {
        console.error("Error updating display name:", error);
      }
    } else {
      alert("Please enter a valid name.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }

  const displayName = user ? profileData?.name?.slice(0, 2).toUpperCase() : "SI";

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-white to-sky-300">
      <div className="w-full mb-5">
        <Navbar />
      </div>

      <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
        <span className="text-2xl font-bold text-white">{displayName}</span>
      </div>

      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">
          {profileData?.name || "Name not available"}
        </h1>
        <p className="text-gray-600">
          {profileData?.email || "Email not available"}
        </p>
      </div>

      {user && (
        <>
          <button
            onClick={handleUpdateDisplayName}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Name
          </button>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Log Out
          </button>
        </>
      )}

      <div className="w-full mt-5">
        <ObjectivePage />
      </div>
    </div>
  );
};

export default ProfilePage;
