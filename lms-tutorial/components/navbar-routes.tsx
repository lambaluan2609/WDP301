"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Home, Search } from "lucide-react";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";
import { cn } from "@/lib/utils";

export const NavbarRoutes = () => {
  const auth = useAuth();
  const { userId } = auth;
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";
  const isDashboardPage = pathname?.startsWith("/dashboard");
  const isHomePage = pathname === "/";

  const routes = [
    {
      label: "Home",
      icon: Home,
      href: "/",
      color: "text-sky-500",
    },
    {
      label: "Browse",
      icon: Search,
      href: "/search",
      color: "text-violet-500",
    },
  ];

  return (
    <nav className="flex w-full justify-between items-center px-6 md:px-10 py-4 bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">

      {/* LOGO */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-2"
      >
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 group"
        >
          <div className="relative">
            <BookOpen className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="font-bold text-lg whitespace-nowrap bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            LMS Management System

          </span>
        </Link>
      </motion.div>

      {/* NAV LINKS */}
      <div className="hidden md:flex items-center gap-4 ml-8">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
          >
            <Button
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-x-2 font-medium transition-all duration-300 hover:scale-105",
                pathname === route.href && "bg-primary/10 hover:bg-primary/20 shadow-sm"
              )}
            >
              <route.icon className={cn("h-4 w-4", route.color)} />
              {route.label}
            </Button>
          </Link>
        ))}
      </div>


      {/* SEARCH INPUT */}
      {(isSearchPage || isDashboardPage || isHomePage) && (
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
              className="flex items-center gap-x-1 hover:bg-red-50 transition-all duration-300 hover:scale-105"
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
              className="flex items-center gap-x-1 hover:bg-green-50 transition-all duration-300 hover:scale-105 border-green-200 hover:border-green-300"
            >
              <GraduationCap className="h-4 w-4 text-green-600" />
              <span className="text-sm whitespace-nowrap">Teacher Mode</span>
            </Button>
          </Link>
        ) : null}

        {/* User button */}
        <div className="transition-transform duration-300 hover:scale-105">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
};
