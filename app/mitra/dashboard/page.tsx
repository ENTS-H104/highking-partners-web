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
import { getCurrentUser, logout, updateProfile } from "@/services/api";
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

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    phone_number: "",
    domicile_address: "",
  });
  const router = useRouter();

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
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
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
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card x-chunk="dashboard-01-chunk-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card
              x-chunk="dashboard-01-chunk-5"
              className="flex flex-col justify-between"
            >
              <CardHeader>
                <div className="flex flex-col items-center gap-6">
                  <Avatar className="w-32 h-32">
                    <img
                      src={user.image_url || "/placeholder.svg"}
                      alt={user.username}
                    />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                  </Avatar>
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
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>
                    Recent transactions from your store.
                  </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                  <Link href="#">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden xl:table-column">
                        Type
                      </TableHead>
                      <TableHead className="hidden xl:table-column">
                        Status
                      </TableHead>
                      <TableHead className="hidden xl:table-column">
                        Date
                      </TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Liam Johnson</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          liam@example.com
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-column">
                        Sale
                      </TableCell>
                      <TableCell className="hidden xl:table-column">
                        <Badge className="text-xs" variant="outline">
                          Approved
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                        2023-06-23
                      </TableCell>
                      <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Olivia Smith</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          olivia@example.com
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-column">
                        Refund
                      </TableCell>
                      <TableCell className="hidden xl:table-column">
                        <Badge className="text-xs" variant="outline">
                          Declined
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                        2023-06-24
                      </TableCell>
                      <TableCell className="text-right">$150.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Noah Williams</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          noah@example.com
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-column">
                        Subscription
                      </TableCell>
                      <TableCell className="hidden xl:table-column">
                        <Badge className="text-xs" variant="outline">
                          Approved
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                        2023-06-25
                      </TableCell>
                      <TableCell className="text-right">$350.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Emma Brown</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          emma@example.com
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-column">
                        Sale
                      </TableCell>
                      <TableCell className="hidden xl:table-column">
                        <Badge className="text-xs" variant="outline">
                          Approved
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                        2023-06-26
                      </TableCell>
                      <TableCell className="text-right">$450.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Liam Johnson</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          liam@example.com
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-column">
                        Sale
                      </TableCell>
                      <TableCell className="hidden xl:table-column">
                        <Badge className="text-xs" variant="outline">
                          Approved
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                        2023-06-27
                      </TableCell>
                      <TableCell className="text-right">$550.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute(Dashboard);
