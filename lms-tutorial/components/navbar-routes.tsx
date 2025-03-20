"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen } from "lucide-react";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";

const NavbarMenu = [
  { id: 1, title: "Home", path: "/" },
  { id: 2, title: "Course", path: "/search" },
  { id: 3, title: "About Us", path: "/not-found" },
  { id: 4, title: "Our Team", path: "/not-found" },
  { id: 5, title: "Contact Us", path: "/not-found" },
];

export const NavbarRoutes = () => {
  const auth = useAuth();
  const { userId } = auth;

  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <nav className="flex w-full justify-between items-center px-6 md:px-10 py-4 bg-white shadow-sm border-b">
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
           LMS Management System
          </span>
        </Link>
      </motion.div>

      {/* NAV LINKS */}
      <div className="hidden md:flex items-center gap-6 ml-8">
        {NavbarMenu.map((menu) => (
          <Link
            key={menu.id}
            href={menu.path}
            className="relative inline-block py-2 px-3 text-gray-700 group transition"
          >
            <span className="transition-colors duration-300 group-hover:text-cyan-500">
              {menu.title}
            </span>
            {/* Dot underneath on hover */}
            <div className="w-2 h-2 bg-cyan-500 absolute rounded-full left-1/2 -translate-x-1/2 top-8 hidden group-hover:block transition" />
          </Link>
        ))}
      </div>

      {/* SEARCH INPUT */}
      {isSearchPage && (
        <div className="hidden md:block w-[300px] ml-8">
          <SearchInput/>
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
              <span className="text-sm whitespace-nowrap">Exit Teacher Mode</span>
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-x-1 hover:bg-green-50"
            >
              <BookOpen className="h-4 w-4 text-green-600" />
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
