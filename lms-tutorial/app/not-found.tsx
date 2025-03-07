"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 text-white px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.2)_0%,_rgba(0,0,0,0)_50%)] z-0"></div>

      <div className="z-10 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-10 text-center shadow-2xl border border-white/20 w-[90%] max-w-lg">
        <h1 className="text-7xl font-extrabold tracking-wider animate-bounce">
          404
        </h1>
        <p className="text-xl mt-3 text-gray-200">
          Oops! The page is not found.
        </p>

        <div className="mt-8 flex justify-center">
          <Button
            className="bg-white text-blue-700 px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-blue-600 hover:text-white"
            onClick={() => router.push("/")}
          >
            <FaHome className="text-xl" /> Back Home
          </Button>
        </div>
      </div>
    </div>
  );
}
