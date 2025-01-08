"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Handle button click to navigate based on authentication
  const handleButtonClick = () => {
    setLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/emotions");
      } else {
        router.push("/signin");
      }
      setLoading(false);
    });
  };

  // Fetch user's name when authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "User"); // Set the user's display name or default to "User"
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-sky-300 text-gray-800 px-4 sm:px-6">
      <Navbar />
      {/* Profile Button */}
      <div className="w-full flex justify-end px-4 py-3 mt-3">
        {userName ? (
          <button
            onClick={() => router.push("/profile")}
            className="text-lg  font-semibold text-blue-600 hover:bg-sky-300 hover:rounded-md hover:px-2 hover:py-1"
          >
            {userName}
          </button>
        ) : (
          <a
            href="/signin"
            className="text-lg text-blue-600 font-semibold hover:text-blue-800"
          >
            Sign In
          </a>
        )}
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center px-2">
        Welcome to{" "}
        <span className="text-4xl sm:text-5xl font-bold text-sky-500">
          CalmBridge
        </span>
      </h1>
      <p className="text-base sm:text-lg mb-8 text-center px-4 text-gray-600 font-bold">
        Manage your Stress, Anxiety, & Depression with ease. We will help you
        feel life again from a new perspective.
      </p>
      <p className="text-base sm:text-lg mb-8 text-center px-4 text-yellow-500 font-bold ">
        Take actionable steps to obtain a positive Impact on your Mental Health.
      </p>

      <div>
        <button
          onClick={handleButtonClick}
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-sky-600 hover:bg-sky-700"
          } mb-6 px-4 py-2 rounded-md text-sm sm:text-base text-white w-full sm:w-auto`}
        >
          {loading ? "Loading..." : "Start Living Again"}
        </button>
      </div>

      {/* <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
        <a
          href="/signin"
          className="px-4 py-2 bg-white text-blue-600 rounded-lg shadow hover:shadow-md hover:bg-gray-100 text-center"
        >
          Sign In
        </a>
        <a
          href="/signup"
          className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow hover:shadow-md hover:bg-blue-800 text-center"
        >
          Sign Up
        </a>
      </div> */}

      <div className="mt-8">
        <Image
          src="https://plus.unsplash.com/premium_vector-1723130555423-89a41d83f3dd?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="CalmBridge Illustration"
          width={300}
          height={150}
          className="rounded-lg shadow-md w-full max-w-xs sm:max-w-md"
        />
      </div>

      {/* Wavy SVG */}
      <div className=" bottom-0 w-full">
        <svg
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            fill="#87CEEB"
            fillOpacity="0.6"
            d="M0,224L30,213.3C60,203,120,181,180,186.7C240,192,300,224,360,234.7C420,245,480,235,540,213.3C600,192,660,160,720,160C780,160,840,192,900,213.3C960,235,1020,245,1080,224C1140,203,1200,149,1260,117.3C1320,85,1380,75,1410,69.3L1440,64L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          ></path>
        </svg>
      </div>
    </main>
  );
}
