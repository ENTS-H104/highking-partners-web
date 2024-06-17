"use client";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Rejected = () => {
  const router = useRouter();
  const [rejectionMessage, setRejectionMessage] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("https://highking.cloud/api/partners/get-current-user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          const userData = response.data.data[0];
          const verificationData = userData.verification_data[0];

          if (verificationData.verified_status === "rejected") {
            setRejectionMessage(verificationData.message || "Your verification was rejected for an unspecified reason.");
          }
        } else {
          toast.error("Failed to fetch user details. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details. Please try again.");
      }
    };

    fetchUserDetails();
  }, []);

  const handleRetryVerification = () => {
    router.push("/mitra/verify");
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
          Verification Rejected
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Your verification was rejected for the following reason:
        </p>
        <p className="text-red-600 text-sm max-w-sm mt-2 dark:text-red-400">
          {rejectionMessage}
        </p>

        <div className="mt-4">
          <Button
            className="w-full"
            onClick={handleRetryVerification}
          >
            Verifikasi Ulang
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Rejected;
