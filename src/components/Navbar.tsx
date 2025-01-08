import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebaseConfig";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Close the menu after selecting a link or logging out
  const handleMenuClose = () => setIsMenuOpen(false);

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
          <Link
            href="/"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="/emotions"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Emotions
          </Link>
          <Link
            href="/tasks"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Tasks
          </Link>
          <Link
            href="/rewards"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Rewards
          </Link>
          <Link
            href="/objective"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Objectives
          </Link>
          <Link
            href="/WeeklyLog"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            WeeklyLog
          </Link>
          <Link
            href="/profile"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Profile
          </Link>
          <Link
            href="/signin"
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            SignIn
          </Link>
          <button
            onClick={handleLogout}
            className="text-white hover:bg-sky-400 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Logout
          </button>
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
          <Link
            href="/"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
            onClick={handleMenuClose}
          >
            Home
          </Link>
          <Link
            href="/emotions"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
            onClick={handleMenuClose}
          >
            Emotions
          </Link>
          <Link
            href="/tasks"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
            onClick={handleMenuClose}
          >
            Tasks
          </Link>
          <Link
            href="/rewards"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
            onClick={handleMenuClose}
          >
            Rewards
          </Link>
          <Link
            href="/objective"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
            onClick={handleMenuClose}
          >
            Objectives
          </Link>
          <Link
            href="/WeeklyLog"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
            onClick={handleMenuClose}
          >
            WeeklyLog
          </Link>
          <Link
            href="/profile"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
            onClick={handleMenuClose}
          >
            Profile
          </Link>
          <Link
            href="/signin"
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
            onClick={handleMenuClose}
          >
            SignIn
          </Link>
          <button
            onClick={() => {
              handleLogout();
              handleMenuClose();
            }}
            className="block px-4 py-2 text-lg hover:bg-sky-600 rounded-md transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
