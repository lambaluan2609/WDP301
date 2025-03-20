"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, GraduationCap } from "lucide-react";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";

export const NavbarRoutes = () => {
  const auth = useAuth();
  const { userId } = auth;
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <nav className="flex w-full justify-between items-center px-6 md:px-10 py-4 ">
      {/* LOGO */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-2"
      >
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition"
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg whitespace-nowrap">
            LMS System
          </span>
        </Link>
      </motion.div>

      {/* SEARCH INPUT */}
      {isSearchPage && (
        <div className="hidden md:block w-[300px] ml-8">
          <SearchInput />
        </div>
      )}

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-x-4 ml-8">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button
              size="sm"
              variant="ghost"
              className="flex items-center gap-x-1 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              <span className="text-sm whitespace-nowrap">Exit</span>
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-x-1 hover:bg-green-50"
            >
              <GraduationCap className="h-4 w-4 text-green-600" />
              <span className="text-sm whitespace-nowrap">Teacher Mode</span>
            </Button>
          </Link>
        ) : null}

        {/* User button */}
        <div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
};
