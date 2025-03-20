"use client";
import React from 'react';
import { FaInstagram, FaWhatsapp, FaYoutube, FaFacebook, FaTwitter } from "react-icons/fa6";
import { TbWorldWww } from "react-icons/tb";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900 border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
              LMS Platform
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering developers with comprehensive learning experiences. Master coding skills and launch your tech career with our expert-led courses.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-200">
                {/* @ts-ignore */}
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-200">
                {/* @ts-ignore */}
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-200">
                {/* @ts-ignore */}
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-200">
                {/* @ts-ignore */}
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-200 flex items-center">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-200 flex items-center">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-200 flex items-center">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-200 flex items-center">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Our Courses</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses/web-development" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-200 flex items-center">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/courses/software-development" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-200 flex items-center">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Software Development
                </Link>
              </li>
              <li>
                <Link href="/courses/apps-development" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-200 flex items-center">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Apps Development
                </Link>
              </li>
              <li>
                <Link href="/courses/e-learning" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-200 flex items-center">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  E-learning
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors text-sm font-medium">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LMS Platform. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
