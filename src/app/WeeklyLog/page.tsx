"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";

export default function LogPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [logData, setLogData] = useState<
    {
      date: string;
      emotion: string;
      tasks: { task: string; status: string }[]; // Tasks specific to each emotion
    }[]
  >([]);

  useEffect(() => {
    if (loading) return; // Return early if still loading

    const fetchLogData = async () => {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Extract emotions and tasks
          const emotions: { timestamp: string; emotion: string }[] =
            userData?.emotions || [];
          const completedTasks: string[] = userData?.completedTasks || [];
          const allTasks: string[] = userData?.tasks || [];

          // Filter emotions for the last 7 days
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          const filteredEmotions = emotions
            .filter((entry) => new Date(entry.timestamp) >= sevenDaysAgo)
            .map((entry) => ({
              date: format(new Date(entry.timestamp), "yyyy-MM-dd"),
              emotion: entry.emotion,
            }));

          // Build log data with tasks per emotion
          const logs = filteredEmotions.map((entry) => {
            const emotionTasks = allTasks.map((task) => ({
              task,
              status: completedTasks.includes(task) ? "Completed" : "Pending",
            }));

            return {
              date: entry.date,
              emotion: entry.emotion,
              tasks: emotionTasks, // tasks for the specific emotion
            };
          });

          setLogData(logs);
        }
      } else {
        alert("You must be logged in to view the log.");
        router.push("/signin");
      }
    };

    fetchLogData();
  }, [user, router, loading]); // Ensuring `user`, `loading`, and `router` are in the dependency array

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-white to-sky-300 text-gray-800">
      <Navbar />
      <h1 className="text-3xl font-bold my-6">Your Weekly Log</h1>
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        {logData.length > 0 ? (
          logData.map((log, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-bold text-blue-600 mb-2">
                {log.date} - {log.emotion}
              </h2>
              <ul className="space-y-2">
                {log.tasks.map((task, taskIndex) => (
                  <li
                    key={taskIndex}
                    className={`p-4 rounded-lg shadow-sm ${
                      task.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span className="font-medium">{task.task}</span>
                    <span className="ml-4 text-sm">({task.status})</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            No data available for the last 7 days.
          </p>
        )}
      </div>
    </div>
  );
}
