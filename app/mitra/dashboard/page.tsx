"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  DollarSign,
  Users,
  CreditCard,
  Home,
  Package,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  UserRound,
  PencilIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getCurrentUser,
  logout,
  updateProfile,
  updateProfileImage,
} from "@/services/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

import axios from "axios";

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

interface Transaction {
  transaction_logs_uuid: string;
  user_uid: string;
  open_trip_uuid: string;
  status_payment: string | null;
  status_accepted: string;
  total_participant: number;
  amount_paid: number;
  payment_gateway_name: string;
  token: string | null;
}

const statusColorClasses = {
  PENDING: "bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold",
  CANCELED: "bg-red-200 hover:bg-red-300 text-red-800 font-bold",
  ACCEPTED: "bg-green-200 hover:bg-green-300 text-green-800 font-bold",
};

const fetchTransactions = async (
  partnerUuid: string
): Promise<Transaction[]> => {
  try {
    const response = await axios.get(
      `https://highking.cloud/api/transaction/get-transaction-partneruuid/${partnerUuid}`
    );
    return response.data.data as Transaction[];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

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
      updateProfileImage(user.partner_uid, imageFile)
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
      const savePromise = updateProfile(user.partner_uid, editData);
      toast.promise(savePromise, {
        loading: "Updating profile...",
        success: "Profile updated successfully!",
        error: (err) => `Profile update failed. ${err.message}`,
      });
      savePromise
        .then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          setIsEditing(false);
        })
        .catch((error) => {
          console.error("Profile update failed:", error);
        });
    }
  };

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [newStatus, setNewStatus] = useState<string | null>(null);

  const updateTransactionStatus = async (
    transactionId: string,
    status: string
  ) => {
    try {
      const response = await axios.post(
        "https://highking.cloud/api/transaction/update-status-accepted",
        {
          id: transactionId,
          status: status,
        }
      );
      toast.success("Transaction status updated successfully");
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.transaction_logs_uuid === transactionId
            ? { ...transaction, status_accepted: status }
            : transaction
        )
      );
    } catch (error) {
      toast.error("Error updating transaction status");
      console.error("Error updating transaction status:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const partnerUuid = await getCurrentPartnerId();
      fetchTransactions(partnerUuid).then((data) => setTransactions(data));
    };

    fetchData();
  }, []);

  if (!user) return <div></div>;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Image
              src="/logo_highking_stroke.svg"
              alt="HighKing Logo"
              width={20}
              height={20}
              className="h-4 w-4 transition-all group-hover:scale-110 text-white"
            />
            <span className="sr-only">HighKing</span>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <UserRound className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/mitra/order"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Orders</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Orders</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/mitra/product"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Package className="h-5 w-5" />
                  <span className="sr-only">Products</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Products</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Image
                    src="/logo_highking_stroke.svg"
                    alt="HighKing Logo"
                    width={20}
                    height={20}
                    className="transition-all group-hover:scale-110"
                  />
                  <span className="sr-only">HighKing</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <UserRound className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/mitra/order"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="/mitra/product"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild> */}
          {/* <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src="/placeholder.svg"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button> */}
          {/* </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
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
            <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
              <div>
                <CardHeader className="flex flex-row items-center">
                  <div className="grid gap-2">
                    <CardTitle>Last Orders</CardTitle>
                    <CardDescription>
                      Recent transactions from your store.
                    </CardDescription>
                  </div>
                  <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="/mitra/order">
                      View All
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Amount
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Status Payment
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Total Participant
                        </TableHead>
                        <TableHead className="">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.slice(0, 5).map((transaction) => (
                        <TableRow key={transaction.transaction_logs_uuid}>
                          <TableCell>
                            <div className="font-medium">
                              {transaction.transaction_logs_uuid}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            Rp {transaction.amount_paid.toLocaleString()}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="outline">
                              {transaction.status_payment || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.total_participant}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={`scale-75 -ml-4 rounded-full ${
                                    statusColorClasses[
                                      transaction.status_accepted
                                    ] || "bg-gray-500 hover:bg-gray-600"
                                  }`}
                                >
                                  {transaction.status_accepted}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>
                                  Edit Status
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                  onSelect={() => {
                                    setSelectedTransaction(transaction);
                                    setNewStatus("ACCEPTED");
                                  }}
                                >
                                  ACCEPTED
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                  onSelect={() => {
                                    setSelectedTransaction(transaction);
                                    setNewStatus("CANCELED");
                                  }}
                                >
                                  CANCELED
                                </DropdownMenuCheckboxItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {selectedTransaction && (
                    <Dialog
                      open={!!selectedTransaction}
                      onOpenChange={() => setSelectedTransaction(null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline">Confirm Update</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Confirm Status Update</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to update the status of this
                            transaction to "{newStatus}"?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            onClick={() => {
                              if (selectedTransaction && newStatus) {
                                updateTransactionStatus(
                                  selectedTransaction.transaction_logs_uuid,
                                  newStatus
                                );
                                setSelectedTransaction(null); // Close dialog after updating
                              }
                            }}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedTransaction(null)}
                          >
                            Cancel
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute(Dashboard);
