"use client";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import ProtectedRouteAdmin from "@/components/ProtectedRouteAdmin";
import axios from "axios";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { PencilIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

import {
  getCurrentUser,
  logout,
  updateProfile,
  updateProfileImage,
} from "@/services/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface User {
  user_uid: string;
  verified_status_uuid: string;
  role: string;
  email: string;
  username: string;
  image_url: string;
  phone_number: string;
  domicile_address: string;
  created_at: string;
  updated_at: string;
}

const getCurrentPartnerId = async () => {
  const response = await axios.get(
    "https://highking.cloud/api/partners/get-current-user",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data.data[0].partner_uid;
};

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editData, setEditData] = useState({
    username: "",
    phone_number: "",
    domicile_address: "",
  });
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSaveImage = () => {
    if (user && imageFile) {
      updateProfileImage(imageFile)
        .then((response) => {
          toast.success("Profile picture updated successfully!");
          setUser({ ...user, image_url: response.data.data.image_url });
        })
        .catch((error) => {
          toast.error("Profile picture update failed. Please try again.");
          console.error("Profile picture update failed:", error);
        });
    }
  };

  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        const userData = response.data.data[0];
        setUser(userData);
        setEditData({
          username: userData.username,
          phone_number: userData.phone_number,
          domicile_address: userData.domicile_address,
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleLogout = () => {
    logout()
      .then(() => {
        toast.success("Logout successful. Redirecting to login page...");
        localStorage.removeItem("token");
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (user) {
      const savePromise = updateProfile(editData);
      toast.promise(savePromise, {
        loading: "Updating profile...",
        success: "Profile updated successfully!",
        error: (err) => `Profile update failed. ${err.message}`,
      });
      savePromise
        .then((response) => {
          const updatedData = response.data.data;
          setUser({
            ...user,
            username: updatedData.username,
            phone_number: updatedData.phone_number,
            domicile_address: updatedData.domicile_address,
          });
          setIsEditing(false);
        })
        .catch((error) => {
          console.error("Profile update failed:", error);
        });
    }
  };

  if (!user) return (<AdminLayout><></></AdminLayout>);

  return (
    <AdminLayout>
      <div className="grid gap-4 md:gap-8">
        <Card
          x-chunk="dashboard-01-chunk-5"
          className="flex flex-col justify-between"
        >
          <CardHeader>
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <img src={user?.image_url || "/placeholder.svg"} />
                </Avatar>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 rounded-full py-2 px-3"
                    >
                      <PencilIcon className="h-4 w-4 hover:scale-110 transition-all" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-4 max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Edit Profile Picture</DialogTitle>
                      <DialogDescription>
                        Select a new profile picture to upload.
                      </DialogDescription>
                    </DialogHeader>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <DialogClose asChild>
                      <Button onClick={handleSaveImage}>Save</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{user.username}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Username
                  </label>
                  <Input
                    value={editData.username}
                    onChange={(e) =>
                      setEditData({ ...editData, username: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Phone
                  </label>
                  <Input
                    value={editData.phone_number}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        phone_number: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Address
                  </label>
                  <Input
                    value={editData.domicile_address}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        domicile_address: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p>{user.phone_number}</p>
                </div>
                <div className="grid gap-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Address
                  </p>
                  <p>{user.domicile_address}</p>
                </div>
                <div className="grid gap-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created At
                  </p>
                  <p>{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {isEditing ? (
              <Button className="ml-auto" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <div className="flex flex-row items-center gap-2 ml-auto">
                <Button className="ml-auto" onClick={handleEdit}>
                  Edit
                </Button>
                <Dialog>
                  <DialogTrigger>
                    <Button variant="destructive" className="ml-auto">
                      Logout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-4 max-w-sm">
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure you want to logout?
                      </DialogTitle>
                      <DialogDescription>
                        You will be redirected to the login page.
                      </DialogDescription>
                      <Button variant="destructive" onClick={handleLogout}>
                        Logout
                      </Button>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ProtectedRouteAdmin(Dashboard);
