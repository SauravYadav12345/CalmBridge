"use client";

import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const emotionOptions = ["Happy", "Sad", "Stressed", "Anxious", "Depressed", "Neutral"];
const emotionEmojis: Record<string, string> = {
  Happy: "😊",
  Sad: "😢",
  Stressed: "😤",
  Anxious: "😟",
  Depressed: "😞",
  Neutral: "😐",
};

export default function EmotionsPage() {
  const { user } = useAuth();
  const userInitials = user?.displayName?.slice(0, 2).toUpperCase() || "?";

  const [emotion, setEmotion] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmotionClick = (selectedEmotion: string) => setEmotion(selectedEmotion);

  const handleNextClick = async () => {
    if (!user) return router.push("/login");
    if (!emotion) return alert("Please select an emotion before proceeding.");

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-sky-300 text-gray-800">
      <div
        className="absolute top-4 right-6 bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer shadow-lg"
        onClick={() => router.push("/profile")}
        title="Go to Profile"
      >
        {userInitials}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 w-11/12 sm:w-4/5 md:w-2/3 lg:w-1/2">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          How was your day Today?
        </h1>
        <div className="flex flex-col gap-4">
          {emotionOptions.map((emotionOption) => (
            <button
              key={emotionOption}
              onClick={() => handleEmotionClick(emotionOption)}
              aria-label={`Select emotion: ${emotionOption}`}
              className={`px-4 py-2 text-lg rounded-lg shadow ${
                emotion === emotionOption
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-green-400"
              }`}
            >
              <span className="mr-2">{emotionEmojis[emotionOption]}</span>
              {emotionOption}
            </button>
          ))}
        </div>
        <button
          onClick={handleNextClick}
          disabled={isLoading}
          className={`mt-6 w-full px-4 py-2 rounded-lg shadow text-center ${
            isLoading ? "bg-gray-400" : "bg-blue-500 text-white"
          }`}
        >
          {isLoading ? "Saving..." : "Next →"}
        </button>
      </div>
    </div>
  );
}
