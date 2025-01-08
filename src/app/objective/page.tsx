"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "@/context/AuthContext"; // Assuming you have an auth context

export default function ObjectivePage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUserTasks = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Fetched User Data:", userData); // Debug log

            setTasks(userData?.tasks || []);
            setCompletedTasks(userData?.completedTasks || []);
          }
        } catch (error) {
          console.error("Error fetching tasks:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserTasks();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleTaskDone = async (task: string) => {
    if (!user) {
      alert("User is not logged in.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        tasks: arrayRemove(task),
        completedTasks: arrayUnion(task),
      });

      setTasks((prevTasks) => prevTasks.filter((t) => t !== task));
      setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, task]);

      console.log(`Task "${task}" marked as done.`);
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
  };

  const handleTaskCancel = async (task: string) => {
    if (!user) {
      alert("User is not logged in.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        tasks: arrayRemove(task),
        canceledTasks: arrayUnion(task),
      });

      setTasks((prevTasks) => prevTasks.filter((t) => t !== task));

      console.log(`Task "${task}" canceled.`);
    } catch (error) {
      console.error("Error canceling task:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-sky-300 text-gray-800">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3 lg:w-1/2">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Today's Objective
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading tasks...</p>
        ) : (
          <>
            {/* Pending Tasks */}
            {tasks.length === 0 ? (
              <p className="mt-5 mb-6 text-center font-bold text-gray-600">
                No pending tasks
              </p>
            ) : (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-700 text-center">
                  Pending Tasks
                </h2>
                <div className="flex flex-col items-center gap-4 mt-4">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 w-full justify-between"
                    >
                      <p className="text-yellow-600">• {task}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTaskDone(task)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-lg"
                        >
                          I'm Done
                        </button>
                        <button
                          onClick={() => handleTaskCancel(task)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length === 0 ? (
              <p className="mt-5 text-center font-bold text-gray-600">
                No completed tasks
              </p>
            ) : (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-700 text-center">
                  Completed Tasks
                </h2>
                <div className="flex flex-col items-center gap-4 mt-4">
                  {completedTasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 w-full justify-between"
                    >
                      <p className="text-yellow-600">• {task}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Go to Home Page  */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
