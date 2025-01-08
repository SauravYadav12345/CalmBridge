"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

function TasksContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [emotion, setEmotion] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const userInitials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : "?";

  const tasksByEmotion: {
    [key: string]: { task: string; duration: number }[];
  } = {
    Happy: [
      { task: "Celebrate your achievements", duration: 10 },
      { task: "Spend time with loved ones", duration: 20 },
    ],
    Sad: [
      { task: "Journal your thoughts", duration: 15 },
      { task: "Watch your favorite movie", duration: 90 },
    ],
    Stressed: [
      { task: "Take deep breaths", duration: 5 },
      { task: "Go for a walk", duration: 15 },
    ],
    Anxious: [
      { task: "Try meditation", duration: 10 },
      { task: "Listen to calming music", duration: 30 },
    ],
    Depressed: [
      { task: "Seek support from a friend", duration: 20 },
      { task: "Practice gratitude", duration: 10 },
    ],
    Neutral: [
      { task: "Organize your space", duration: 30 },
      { task: "Set goals for the week", duration: 45 },
    ],
  };

  const tasks = useMemo(() => {
    return emotion
      ? tasksByEmotion[emotion] || [{ task: "No specific tasks.", duration: 0 }]
      : [{ task: "No specific tasks.", duration: 0 }];
  }, [emotion]);

  const taskEmojis: { [key: string]: string } = {
    "Celebrate your achievements": "🎉",
    "Spend time with loved ones": "❤️",
    "Journal your thoughts": "📖",
    "Watch your favorite movie": "🍿",
    "Take deep breaths": "🌬️",
    "Go for a walk": "🚶‍♂️",
    "Try meditation": "🧘‍♂️",
    "Listen to calming music": "🎶",
    "Seek support from a friend": "🤝",
    "Practice gratitude": "🙏",
    "Organize your space": "🧹",
    "Set goals for the week": "📅",
    "No specific tasks.": "❓",
  };

  useEffect(() => {
    const emotionFromParams = searchParams.get("emotion");
    setEmotion(emotionFromParams);

    if (user?.uid) {
      const fetchCompletedTasks = async () => {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCompletedTasks(userData?.completedTasks || []);

          if (!userData?.tasks || userData?.tasks.length === 0) {
            await updateDoc(userRef, {
              tasks: arrayUnion(...tasks.map((task) => task.task)),
            });
          }
        }
      };

      fetchCompletedTasks();
    }
  }, [user, tasks, searchParams]);

  const saveTaskCompletion = async (task: string) => {
    if (user?.uid) {
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          tasks: arrayRemove(task),
          completedTasks: arrayUnion(task),
        });
        setCompletedTasks((prev) => [...prev, task]);
        alert(`Task "${task}" completed successfully!`);
      } catch (error) {
        alert("Failed to save the task. Please try again.");
      }
    } else {
      alert("You must be logged in to complete tasks.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mx-4 md:mx-auto relative">
      <div
        className="absolute top-4 right-6 bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
        onClick={() => router.push("/profile")}
        title="Go to Profile"
      >
        {userInitials}
      </div>
      <h1 className="text-3xl font-bold text-center">Your Tasks</h1>

      {emotion && (
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold">
            Based on your emotion:{" "}
            <span className="text-green-500 font-extrabold">{emotion}</span>
          </h2>
          <ul className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold">Pending Tasks</h3>
            {tasks.map(
              (taskObj, index) =>
                !completedTasks.includes(taskObj.task) && (
                  <li
                    key={index}
                    className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm"
                  >
                    <span className="text-2xl">
                      {taskEmojis[taskObj.task] || "❓"}
                    </span>
                    <div>
                      <p className="font-medium">{taskObj.task}</p>
                      <p className="text-sm text-gray-500">
                        Duration: {taskObj.duration} mins
                      </p>
                      <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={() => saveTaskCompletion(taskObj.task)}
                      >
                        Mark as Complete
                      </button>
                    </div>
                  </li>
                )
            )}
          </ul>

          <ul className="mt-6 space-y-2">
            <h3 className="text-lg font-semibold">Completed Tasks</h3>
            {completedTasks.map((task, index) => (
              <li
                key={index}
                className="flex items-center gap-3 bg-green-100 p-3 rounded-lg shadow-sm"
              >
                <span className="text-2xl">{taskEmojis[task] || "❓"}</span>
                <p className="font-medium">{task}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex justify-center items-center w-full px-8">
        <Link href="/rewards">
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Next → Go to Rewards
          </button>
        </Link>
      </div>

      <div className="flex justify-between mt-4 w-full px-8">
        <Link href="/emotions">
          <FaArrowLeft
            className="text-blue-500 hover:text-blue-700 text-2xl cursor-pointer"
            title="Back to Emotions"
          />
        </Link>
        <Link href="/rewards">
          <FaArrowRight
            className="text-blue-500 hover:text-blue-700 text-2xl cursor-pointer"
            title="Go to Rewards"
          />
        </Link>
      </div>
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div>Loading tasks...</div>}>
      <TasksContent />
    </Suspense>
  );
}
