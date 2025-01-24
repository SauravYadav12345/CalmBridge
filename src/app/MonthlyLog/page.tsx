"use client";

import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Import Firebase config
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

function MonthlyLog() {
  const { user } = useAuth();
  const router = useRouter();
  const [emotions, setEmotions] = useState<
    { emotion: string; timestamp: string }[]
  >([]);
  const [month, setMonth] = useState<string>("");

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  // Function to filter emotions by month
  const filterEmotionsByMonth = (emotions: any[], month: string) => {
    return emotions.filter((emotion) => {
      const emotionDate = new Date(emotion.timestamp);
      return (
        emotionDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }) === month
      );
    });
  };

  useEffect(() => {
    if (user?.uid) {
      const fetchEmotions = async () => {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const emotions = userData?.emotions || [];
          setEmotions(emotions);

          // Set the current month to display by default
          const currentMonth = new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
          setMonth(currentMonth);
        }
      };

      fetchEmotions();
    }
  }, [user]);

  const filteredEmotions = filterEmotionsByMonth(emotions, month);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-white to-sky-300 text-gray-800">
      <Navbar />
      <div className="bg-white shadow-lg mt-8 rounded-lg p-6 w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center">Monthly Emotion Log</h1>
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold">Emotions for {month}</h2>
          <ul className="mt-4 space-y-2">
            {filteredEmotions.length > 0 ? (
              filteredEmotions.map((emotion, index) => (
                <li
                  key={index}
                  className="bg-gray-100 p-3 rounded-lg shadow-sm"
                >
                  <p className="font-medium">{emotion.emotion}</p>
                  <p className="text-sm text-gray-500">
                    Recorded on:{" "}
                    {new Date(emotion.timestamp).toLocaleDateString()}
                  </p>
                </li>
              ))
            ) : (
              <p>No emotions logged for this month.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MonthlyLog;
