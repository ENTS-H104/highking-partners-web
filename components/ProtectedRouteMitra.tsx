import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import axios from "axios";

const ProtectedRouteMitra = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

      const fetchCurrentUser = async () => {
        try {
          const response = await axios.get(
            "https://highking.cloud/api/partners/get-current-user",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data.data[0]);
          const user = response.data.data[0];

          if(user.role === "admin") {
            toast.error("What are you doing here? Go create your own mitra account!");
            setTimeout(() => {
              router.replace("/admin/dashboard");
            }, 2000);
            return;
          }

          if (user.role !== "mitra") {
            toast.error("You must be a partner to access this page");
            setTimeout(() => {
              router.replace("/auth/login");
            }, 2000);
            return;
          }

          if (user.verification_data[0].verified_status === "onprocess") {
            toast.error("Your verification is still on process");
            router.replace("/mitra/onprocess");
            return;
          }

          if (user.verification_data[0].verified_status === "disabled") {
            toast.error("Please verify your account first");
            setTimeout(() => {
              router.replace("/mitra/verify");
            }, 1500);
            return;
          }

          if (user.verification_data[0].verified_status === "rejected") {
            toast.error(
              "Your last verification has been rejected, please verify your account again"
            );
            setTimeout(() => {
              router.replace("/mitra/rejected");
            }, 1500);
            return;
          }

          setIsAuthenticated(true);
        } catch (error) {
          console.log(error);
          toast.error("You must be logged in to access this page");
          setTimeout(() => {
            router.replace("/auth/login");
          }, 2000);
        }
      };

      if (!token || token === "undefined") {
        toast.error("You must be logged in to access this page");
        setTimeout(() => {
          router.replace("/auth/login");
        }, 2000);
      } else {
        fetchCurrentUser();
      }
    }, [router]);

    if (!isAuthenticated) {
      return (
        <div>
          <Toaster richColors position="top-center" />
        </div>
      );
    }

    return (
      <div>
        <Toaster richColors position="top-center" />
        <WrappedComponent {...props} />
      </div>
    );
  };

  return Wrapper;
};

export default ProtectedRouteMitra;
