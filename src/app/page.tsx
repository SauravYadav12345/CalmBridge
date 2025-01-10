"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
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
            className="text-lg font-semibold text-blue-600 hover:bg-sky-300 hover:rounded-md hover:px-2 hover:py-1"
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
      <p className="text-base sm:text-lg mb-8 text-center px-4 text-lime-600 font-bold">
        Take actionable steps to obtain a positive Impact on your Mental Health.
      </p>

      <button
        onClick={handleButtonClick}
        disabled={loading}
        className={`${
          loading ? "bg-gray-400" : "bg-sky-600 hover:bg-sky-700"
        } mb-6 px-4 py-2 rounded-md text-sm sm:text-base text-white w-full sm:w-auto`}
      >
        {loading ? "Loading..." : "Start Living Again"}
      </button>

      {/* Key Features Section */}
      <section className="mt-10 w-full text-center">
        <h2 className="text-3xl font-bold text-sky-600 mb-6">
          Why Choose CalmBridge?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-extrabold text-sky-500 mb-2">
              Emotion Tracking
            </h3>
            <p className="text-gray-600">
              Log and visualize your daily emotions to better understand
              yourself. also can track Weekly or Monthly Emotions in the log
              history to better Improve yourself.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-extrabold text-sky-500 mb-2">
              Personalized Insights
            </h3>
            <p className="text-gray-600">
              Get actionable advice/tasks based on your emotion patterns and
              once completion of the task's can earn a Reward.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-extrabold text-sky-500 mb-2">
              Streaks & Rewards
            </h3>
            <p className="text-gray-600">
              Build healthy habits and improve your lifestyle to earn rewards
              for staying consistent and maintain your daily streak consistently
              to know yourself better.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mt-16 w-full text-center">
        <h2 className="text-3xl font-bold text-sky-600 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left sm:text-center max-w-6xl mx-auto ">
          <div className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-sky-500">Step 1</h3>
            <p className="mt-2 text-gray-700">
              Create your profile by signing up and setting personal
              preferences. This helps us customize strategies for your mental
              wellness.
            </p>
          </div>
          <div className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-sky-500">Step 2</h3>
            <p className="mt-2 text-gray-700">
              Log your emotions daily using our intuitive tracker. Gain insights
              into patterns and triggers for a deeper understanding of your
              mental health.
            </p>
          </div>
          <div className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-sky-500">Step 3</h3>
            <p className="mt-2 text-gray-700">
              Can track your Daily Objective, WeeklyLog & MonthlyLog to Achieve
              mental clarity through actionable tasks, mindfulness exercises,
              and personalized insights. Stay motivated with rewards and
              streaks.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mt-16 w-full text-center bg-gradient-to-br from-white to-sky-300 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-sky-600 mb-8">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Sarah M."
                className="w-12 h-12 rounded-full shadow"
              />
              <div className="ml-3">
                <h4 className="text-lg font-semibold text-gray-800">
                  Sarah M.
                </h4>
                <p className="text-sm text-gray-500">Mental Health Advocate</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "CalmBridge has completely transformed my mental health journey.
              Highly recommended!"
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <img
                src="https://randomuser.me/api/portraits/men/72.jpg"
                alt="James L."
                className="w-12 h-12 rounded-full shadow"
              />
              <div className="ml-3">
                <h4 className="text-lg font-semibold text-gray-800">
                  James L.
                </h4>
                <p className="text-sm text-gray-500">Software Engineer</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "I feel more in control of my emotions thanks to CalmBridge."
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <img
                src="https://randomuser.me/api/portraits/women/90.jpg"
                alt="Emily R."
                className="w-12 h-12 rounded-full shadow"
              />
              <div className="ml-3">
                <h4 className="text-lg font-semibold text-gray-800">
                  Emily R.
                </h4>
                <p className="text-sm text-gray-500">Student</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "The personalized insights and tracking features are simply
              amazing. Thank you, CalmBridge!"
            </p>
          </div>

          {/* Testimonial 4 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="Michael B."
                className="w-12 h-12 rounded-full shadow"
              />
              <div className="ml-3">
                <h4 className="text-lg font-semibold text-gray-800">
                  Michael B.
                </h4>
                <p className="text-sm text-gray-500">Freelancer</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "I’ve noticed a huge positive change in my mindset. CalmBridge is
              a lifesaver!"
            </p>
          </div>

          {/* Testimonial 5 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <img
                src="https://randomuser.me/api/portraits/women/36.jpg"
                alt="Olivia K."
                className="w-12 h-12 rounded-full shadow"
              />
              <div className="ml-3">
                <h4 className="text-lg font-semibold text-gray-800">
                  Olivia K.
                </h4>
                <p className="text-sm text-gray-500">Content Creator</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "The streaks and rewards system keeps me motivated every day.
              Great app!"
            </p>
          </div>

          {/* Testimonial 6 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <img
                src="https://randomuser.me/api/portraits/men/33.jpg"
                alt="Ryan T."
                className="w-12 h-12 rounded-full shadow"
              />
              <div className="ml-3">
                <h4 className="text-lg font-semibold text-gray-800">Ryan T.</h4>
                <p className="text-sm text-gray-500">Entrepreneur</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "A perfect blend of simplicity and functionality. Highly impressed
              with CalmBridge."
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 w-full bg-gray-700 text-white py-6">
        <div className="max-w-4xl mx-auto text-center px-4">
          {/* Branding */}
          <h4 className="text-lg font-semibold text-sky-400">CalmBridge</h4>
          <p className="text-sm text-gray-300 mt-2">
            Your companion for stress management, emotional well-being, and
            personal growth.
          </p>

          {/* Links */}
          <div className="flex justify-center space-x-6 mt-4">
            <a href="/about" className="text-gray-300 hover:text-sky-400">
              About
            </a>
            <a href="/privacy" className="text-gray-300 hover:text-sky-400">
              Privacy
            </a>
            <a href="/terms" className="text-gray-300 hover:text-sky-400">
              Terms
            </a>
            <a href="/contact" className="text-gray-300 hover:text-sky-400">
              Contact
            </a>
          </div>

          {/* Social Media */}
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-sky-400"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-sky-400"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-sky-400"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-sky-400"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>

          {/* Bottom Note */}
          <p className="text-xs text-gray-400 mt-4">
            &copy; 2025 CalmBridge. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
