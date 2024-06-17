"use client";
import React from "react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import axios from "axios";

const OnProcess = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.get("https://highking.cloud/api/partners/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        toast.success("Logout successful. Redirecting to login page...");
        localStorage.removeItem("token");
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        toast.error("Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Toaster position="top-center" richColors />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="w-full md:max-w-md max-w-xs md:mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black"
      >
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Verification In Process
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Your verification is still in process. Please check back periodically to see the status of your verification.
        </p>

        <div className="mt-4">
          <Button
            className="w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnProcess;
