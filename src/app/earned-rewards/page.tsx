"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/app/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

interface Reward {
  reward: string;
  timestamp?: Date; // Firestore timestamp format
}

export default function EarnedReward() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<{ reward: string; timestamp?: Date }[]>([]);

  useEffect(() => {
    if (user?.uid) {
      const fetchRewards = async () => {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const rewardsArray = userData?.rewards || []; // Get rewards (array of strings)

          // Map over rewards to add timestamp (if any)
          const rewards = rewardsArray.map((reward: string) => ({
            reward,
            timestamp: new Date(), // You can add a custom timestamp logic here if available
          }));

          console.log("Fetched Rewards:", rewards);
          setRewards(rewards);
        }
      };

      fetchRewards();
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-white to-green-300 text-gray-800">
      <Navbar />
      <div className="bg-white shadow-lg mt-8 rounded-lg p-6 w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center">Earned Rewards</h1>
        <div className="mt-4 text-center">
          {rewards.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {rewards.map((reward, index) => (
                <li key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm">
                  <p className="font-medium">{reward.reward}</p>
                  <p className="text-sm text-gray-500">
                    {reward.timestamp
                      ? `Earned on: ${reward.timestamp.toLocaleDateString()}`
                      : "Earned on: Unknown Date"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No rewards earned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}