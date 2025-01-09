"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore"; // Firestore imports
import { db } from "../firebaseConfig";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Error state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state before attempting sign-up
    setIsLoading(true); // Set loading to true while processing sign-up

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false); // Reset loading state
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update Firebase Authentication profile with the name
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date(),
      });

      router.push("/signin"); // Redirect to sign-in page after successful sign-up
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Sign-up failed! Please try again.");
      } else {
        setError("An unknown error occurred during sign-up.");
      }
      setIsLoading(false); // Reset loading state after error
    }
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-white to-sky-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Sign Up
      </h1>
      <form
        onSubmit={handleSignUp}
        className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Enter your name.."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:bg-gray-400"
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}{" "}
      {/* Error message display */}
    </main>
  );
}
