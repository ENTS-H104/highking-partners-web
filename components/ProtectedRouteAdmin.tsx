import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import axios from "axios";

const ProtectedRouteAdmin = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
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

          const user = response.data.data[0];

          if (user.role !== "admin") {
            toast.error("You must be an admin to access this page");
            setTimeout(() => {
              router.replace("/mitra/dashboard");
            }, 2500);
            return;
          }

          setIsAuthenticated(true);
        } catch (error) {
          toast.error("You must be logged in to access this page");
          setTimeout(() => {
            router.replace("/auth/login");
          }, 2500);
        }
      };

      if (!token || token === "undefined") {
        toast.error("You must be logged in to access this page");
        setTimeout(() => {
          router.replace("/auth/login");
        }, 2500);
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

export default ProtectedRouteAdmin;
