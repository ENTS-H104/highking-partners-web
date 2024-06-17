"use client";
import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const VerifyPartner = () => {
  const [imageKtp, setImageKtp] = useState<File | null>(null);
  const [imageSelfieAndKtp, setImageSelfieAndKtp] = useState<File | null>(null);
  const [nik, setNik] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageKtp || !imageSelfieAndKtp) {
      toast.error("Please upload both KTP image and Selfie with KTP image.");
      return;
    }

    const formData = new FormData();
    formData.append("image_ktp", imageKtp);
    formData.append("image_selfie_and_ktp", imageSelfieAndKtp);
    formData.append("nik", nik);
    formData.append("name", name);

    const verifyPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          "https://highking.cloud/api/partners/verification",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          }
        );

        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(data);
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(verifyPromise, {
      loading: "Submitting verification details...",
      success: (data) => {
        setTimeout(() => {
          router.push("/mitra/onprocess");
        }, 3000);
        return "Verification details updated successfully!";
      },
      error: (err) =>
        `Failed to update verification details. ${err.message || err.message}. Please try again.`,
    });
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
        className=""
      >
        <div className="w-full md:max-w-md max-w-xs md:mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            One Step Closer!
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Please provide the following details to verify your account.
          </p>

          <form className="mt-4" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="nik">Nomor Induk Kependudukan (NIK)</Label>
              <Input
                id="nik"
                placeholder="64700903"
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Dynamic Jr."
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="image_ktp">KTP Image</Label>
              <Input
                id="image_ktp"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) =>
                  setImageKtp(e.target.files ? e.target.files[0] : null)
                }
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="image_selfie_and_ktp">Selfie with KTP Image</Label>
              <Input
                id="image_selfie_and_ktp"
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e) =>
                  setImageSelfieAndKtp(e.target.files ? e.target.files[0] : null)
                }
              />
            </LabelInputContainer>

            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Submit Verification
              <BottomGradient />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default VerifyPartner;
