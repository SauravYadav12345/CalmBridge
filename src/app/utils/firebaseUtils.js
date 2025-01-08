import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const createUserDocument = async (user) => {
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      name: user.name,
      email: user.email,
      createdAt: new Date(),
    });

    console.log("User document created!");
  } catch (error) {
    console.error("Error creating user document:", error);
  }
};
