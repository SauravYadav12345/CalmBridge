"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state before attempting sign-up
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/signin"); // Redirect to sign-in page after successful sign-up
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Sign-up failed! Please try again.");
    }
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <form
        onSubmit={handleSignUp}
        className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg"
      >
        <input
          type="text"
          placeholder="Enter your name.."
          className="px-4 py-2 border rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          Sign Up
        </button>
      </form>
      {error && <p className="mt-4 text-red-600">{error}</p>}{" "}
      {/* Error message display */}
    </main>
  );
}
