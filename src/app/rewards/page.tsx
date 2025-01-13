"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router for redirection
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Importing arrow icons
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RewardsPage() {
  const { user } = useAuth();
  const userInitials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : "?";
  const [selectedReward, setSelectedReward] = useState<string>("");
  const router = useRouter(); // Use Next.js router to navigate programmatically

  const rewards = [
    { name: "Ice Cream", emoji: "🍦" },
    { name: "Game", emoji: "🎮" },
    { name: "Trip", emoji: "✈️" },
    { name: "Nap", emoji: "💤" },
    { name: "Movie", emoji: "🍿" },
  ];

  const handleRewardSelection = (reward: string) => {
    setSelectedReward(reward);
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleSubmit = async () => {
    if (selectedReward && user) {
      try {
        const userDocRef = doc(db, "users", user.uid); // Reference to the user document
        await updateDoc(userDocRef, {
          rewards: arrayUnion(selectedReward), // Add selected reward to Firestore
        });
        console.log("Reward successfully added to Firestore!");
        alert("Successfully Submitted!!");
        router.push("/"); // Redirect to the Objective page after submission
      } catch (error) {
        console.error("Error adding reward to Firestore: ", error);
      }
    } else {
      alert("Please Select a reward!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-sky-300 text-gray-800">
      {/* User Initials at the Top Right */}
      <div
        className="absolute top-4 right-6 bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer shadow-lg"
        onClick={handleProfileClick}
        title="Go to Profile"
      >
        {userInitials}
      </div>
      {/* Card Container */}
      <div className="bg-white shadow-md rounded-lg p-6 w-11/12 sm:w-4/5 md:w-2/3 lg:w-1/2">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Earn a Reward
        </h1>

        {/* Reward Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {rewards.map((reward) => (
            <div
              key={reward.name}
              onClick={() => handleRewardSelection(reward.name)}
              className={`cursor-pointer p-4 bg-gray-200 rounded-lg shadow transition-all duration-200 ease-in-out transform hover:scale-105 ${
                selectedReward === reward.name
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-green-400"
              }`}
            >
              <div className="text-center text-4xl">{reward.emoji}</div>
              <h3 className="text-center mt-2 text-lg font-semibold">
                {reward.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full px-4 py-2 bg-indigo-500 text-white rounded-lg shadow text-center"
        >
          Submit
        </button>
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-between items-center mt-8 w-full max-w-md">
        <Link href="/tasks">
          <FaArrowLeft
            className="text-indigo-500 hover:text-indigo-700 text-2xl cursor-pointer"
            title="Back to Tasks"
          />
        </Link>
        <Link href="/emotions">
          <FaArrowRight
            className="text-indigo-500 hover:text-indigo-700 text-2xl cursor-pointer"
            title="Go to Emotions"
          />
        </Link>
      </div>
    </div>
  );
}
