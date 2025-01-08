import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/firebaseConfig";
import {
  User,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import LogPage from "@/app/WeeklyLog/page";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<{
    name: string;
    email: string;
  }>({ name: "", email: "" });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfileData({ name: "", email: "" });
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-sky-500 p-4 shadow-md w-full">
      <div className="w-full max-w-screen-xl mx-auto flex justify-between items-center">
        <h1
          className="text-white text-2xl font-semibold cursor-pointer"
          onClick={() => router.push("/")}
        >
          CalmBridge
        </h1>

        {/* Desktop Navbar */}
        <div className="hidden md:flex space-x-3">
          <a
            href="/"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Home
          </a>
          <a
            href="/emotions"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Emotions
          </a>
          <a
            href="/tasks"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Tasks
          </a>
          <a
            href="/rewards"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Rewards
          </a>
          <a
            href="/objective"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Objectives
          </a>
          <a
            href="/WeeklyLog"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            WeeklyLog
          </a>
          <a
            href="/profile"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Profile
          </a>
          <a
            href="/signin"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            SignIn
          </a>
          <a
            onClick={handleLogout}
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300 cursor-pointer"
          >
            Logout
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-sky-700 text-white p-4 rounded-lg">
          <a
            href="/"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
          >
            Home
          </a>
          <a
            href="/emotions"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
          >
            Emotions
          </a>
          <a
            href="/tasks"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
          >
            Tasks
          </a>
          <a
            href="/rewards"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
          >
            Rewards
          </a>
          <a
            href="/objective"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
          >
            Objectives
          </a>
          <a
            href="/profile"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
          >
            Profile
          </a>
          <a
            href="/signin"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
          >
            SignIn
          </a>
          <a
            onClick={handleLogout}
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300 cursor-pointer"
          >
            Logout
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
