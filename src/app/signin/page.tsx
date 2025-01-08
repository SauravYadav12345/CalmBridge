"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Error state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state before attempting sign-in
    setIsLoading(true); // Set loading to true while processing sign-in

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false); // Reset loading state
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect to emotions page after successful sign-in
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError("Sign-in failed! Please check your credentials.");
      }
      setIsLoading(false); // Reset loading state after error
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-white to-sky-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Sign In
      </h1>
      <form
        onSubmit={handleSignIn}
        className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg w-full max-w-md"
      >
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-400"
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}{" "}
      {/* Error message display */}
      <p className="mt-4 text-gray-600 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </main>
  );
}
