"use client";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

import {
  UserRound,
  PanelLeft,
  Search,
  ShoppingCart,
  Package,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

interface MitraLayoutProps {
  children: ReactNode;
}

const MitraLayout = ({ children }: MitraLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "https://highking.cloud/api/partners/logout",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
    <div className="min-h-screen w-full flex">
      <aside className="fixed top-0 left-0 h-full w-[220px] border-r bg-muted/40 hidden md:flex flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image
              src="/logo_highking_fill.svg"
              alt="HighKing Logo"
              width={24}
              height={24}
            />
            <span className="mt-1">HighKing</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid grid-cols-1 gap-2 items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/mitra/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                pathname === "/mitra/dashboard"
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground transition-all hover:text-foreground hover:font-semibold"
              }`}
            >
              <UserRound className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/mitra/order"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                pathname === "/mitra/order"
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground transition-all hover:text-foreground hover:font-semibold"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="/mitra/product"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                pathname === "/mitra/product"
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground transition-all hover:text-foreground hover:font-semibold"
              }`}
            >
              <Package className="h-4 w-4" />
              Open Trip
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Dialog>
            <DialogTrigger className="w-full">
              <Button variant="destructive" className="w-full">
                Logout
              </Button>
            </DialogTrigger>
            <DialogContent className="p-4 max-w-sm">
              <DialogHeader>
                <DialogTitle>Are you sure you want to logout?</DialogTitle>
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
      </aside>
      <div className="flex flex-col flex-1 md:ml-[220px]">
        <header className="fixed bg-white z-50 top-0 left-0 right-0 flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:ml-[220px]">
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
                  href="/"
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
                  href="/mitra/dashboard"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname === "/mitra/dashboard"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <UserRound className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/mitra/order"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname === "/mitra/order"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="/mitra/product"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname === "/mitra/product"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Package className="h-5 w-5" />
                  Open Trip
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                {pathname === "/mitra/dashboard"
                  ? "Dashboard"
                  : pathname === "/mitra/order"
                  ? "Orders"
                  : pathname === "/mitra/product"
                  ? "Open Trip"
                  : "Dashboard"}
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
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 mt-14 lg:mt-[60px]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MitraLayout;
