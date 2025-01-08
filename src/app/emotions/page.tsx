"use client";

import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa"; // Import the right arrow icon
import { useAuth } from "@/context/AuthContext";

export default function EmotionsPage() {
  const { user } = useAuth(); //get username from context
  // Extract first two letters of the user's name
  const userInitials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : "?";

  const [emotion, setEmotion] = useState("");
  const router = useRouter();

  const handleEmotionClick = (selectedEmotion: string) => {
    setEmotion(selectedEmotion);
  };

  const handleNextClick = async () => {
    // Mark the function as async
    if (!user) {
      alert("User is not logged in. Please log in and try again.");
      router.push("/login");
      return;
    }
    if (emotion) {
      try {
        const userDoc = doc(db, "users", user.uid);
        await setDoc(
          userDoc,
          {
            emotions: arrayUnion({
              timestamp: new Date().toISOString(),
              emotion,
            }),
          },
          { merge: true }
        );
        router.push(`/tasks?emotion=${emotion}`);
      } catch (error) {
        console.error("Error saving emotion:", error);
        alert("Failed to save your emotion. Please try again.");
      }
    } else {
      alert("Please select an emotion before proceeding.");
    }
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  // Mapping of emotions to emojis
  const emotionEmojis: { [key: string]: string } = {
    Happy: "😊",
    Sad: "😢",
    Stressed: "😤",
    Anxious: "😟",
    Depressed: "😞",
    Neutral: "😐",
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
          How was your day Today?
        </h1>
        <div className="flex flex-col gap-4 ">
          {["Happy", "Sad", "Stressed", "Anxious", "Depressed", "Neutral"].map(
            (emotionOption) => (
              <button
                key={emotionOption}
                onClick={() => handleEmotionClick(emotionOption)}
                className={`px-4 py-2 text-lg rounded-lg shadow ${
                  emotion === emotionOption
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-green-400"
                }`}
              >
                <span className="mr-2">{emotionEmojis[emotionOption]}</span>
                {emotionOption}
              </button>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextClick}
          className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow text-center"
        >
          Next →
        </button>
      </div>

      {/* Arrow Icon for navigation */}
      <div className="mt-6 flex justify-center">
        <Link href="/tasks">
          <FaArrowRight
            className="text-blue-500 hover:text-blue-700 text-2xl cursor-pointer"
            title="Go to Tasks"
          />
        </Link>
      </div>
    </div>
  );
}
