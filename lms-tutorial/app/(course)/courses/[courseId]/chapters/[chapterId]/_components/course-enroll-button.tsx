"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const getChapterId = () => {
    const parts = pathname.split("/");
    return parts[parts.length - 1];
  };

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      try {
        const response = await axios.get(
          `/api/courses/${courseId}/purchase-status`
        );
        if (response.data.isPurchased) {
          setIsPurchased(true);

          const url = new URL(window.location.href);
          url.searchParams.set("reload", Date.now().toString());
          router.push(url.toString());
        }
      } catch (error) {
        console.error("Failed to check purchase status", error);
      }
    };

    checkPurchaseStatus();
  }, [courseId, router]);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(`/api/courses/${courseId}/checkout`);

      const checkoutUrl = new URL(response.data.url);
      checkoutUrl.searchParams.append("t", Date.now().toString());

      window.location.assign(checkoutUrl.toString());
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Something went wrong with the payment process");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPurchased) {
    return null;
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm"
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};
