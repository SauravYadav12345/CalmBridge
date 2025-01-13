import { setDoc, doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const createUserDocument = async (user) => {
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // User exists, add new reward with Firestore Timestamp
      await updateDoc(userRef, {
        rewards: [
          ...userDoc.data().rewards, // Existing rewards
          {
            reward: "Welcome Reward", // New reward
            timestamp: Timestamp.now(), // Use Firestore Timestamp
          },
        ],
      });
    } else {
      // User does not exist, create a new user document
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        createdAt: new Date(),
        rewards: [
          {
            reward: "Welcome Reward", // Initial reward
            timestamp: Timestamp.now(), // Add Firestore Timestamp
          },
        ],
      });
    }

    console.log("User document created/updated!");
  } catch (error) {
    console.error("Error creating/updating user document:", error);
  }
};
