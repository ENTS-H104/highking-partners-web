"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/ProtectedRoute";

import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OpenTrip {
  open_trip_uuid: string;
  name: string;
  image_url: string;
  price: number;
  mountain_name: string;
  mountain_uuid: string;
  total_participants: string;
  created_at: string;
}
interface NewOpenTrip {
  mountain_uuid: string;
  partner_uid: string;
  name: string;
  description: string;
  price: string;
  min_people: string;
  max_people: string;
  policy: string;
  include: string;
  exclude: string;
  gmaps: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  image: File | null;
}

interface Mountain {
  mountain_uuid: string;
  name: string;
}

const Product = () => {
  const [openTrips, setOpenTrips] = useState<OpenTrip[]>([]);
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isFaqModalOpen, setFaqModalOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<OpenTrip | null>(null);
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  const [newSchedule, setNewSchedule] = useState({
    open_trip_uuid: "",
    day: 1,
    description: "",
  });

  const [newFaq, setNewFaq] = useState({
    open_trip_uuid: "",
    description: "",
  });

  const handleEditClick = (trip: OpenTrip) => {
    setCurrentTrip(trip);
    setNewSchedule({ ...newSchedule, open_trip_uuid: trip.open_trip_uuid });
    setScheduleModalOpen(true);
  };

  const handleAddFaqClick = (trip: OpenTrip) => {
    setCurrentTrip(trip);
    setNewFaq({ ...newFaq, open_trip_uuid: trip.open_trip_uuid });
    setFaqModalOpen(true);
  };

  const handleScheduleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleFaqQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFaqQuestion(e.target.value);
  };

  const handleFaqAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFaqAnswer(e.target.value);
  };

  const handleAddSchedule = async () => {
    try {
      const response = await axios.post(
        "https://highking.cloud/api/open-trips/schedules",
        newSchedule,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Schedule added successfully!");
      setScheduleModalOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Failed to add schedule. Please try again.");
      console.error("Failed to add schedule:", error);
    }
  };

  const handleAddFaq = async () => {
    const faqDescription = `Question: ${newFaqQuestion} \n Answer: ${newFaqAnswer}`;
    const faqData = { ...newFaq, description: faqDescription };

    try {
      const response = await axios.post(
        "https://highking.cloud/api/open-trips/faqs",
        faqData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("FAQ added successfully!");
      setFaqModalOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Failed to add FAQ. Please try again.");
      console.error("Failed to add FAQ:", error);
    }
  };

  useEffect(() => {
    const fetchMountains = async () => {
      try {
        const response = await axios.get(
          "https://highking.cloud/api/mountains",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMountains(response.data.data);
      } catch (error) {
        console.error("Failed to fetch mountains:", error);
      }
    };

    fetchMountains();
  }, []);

  const [newTrip, setNewTrip] = useState<NewOpenTrip>({
    mountain_uuid: "",
    partner_uid: "",
    name: "",
    description: "",
    price: "",
    min_people: "",
    max_people: "",
    policy: "",
    include: "",
    exclude: "",
    gmaps: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    image: null,
  });

  useEffect(() => {
    const fetchOpenTrips = async () => {
      try {
        const partnerId = await getCurrentPartnerId();
        const trips = await getMitraProfile(partnerId);
        setOpenTrips(trips);
        setNewTrip((prevTrip) => ({ ...prevTrip, partner_uid: partnerId }));
      } catch (error) {
        console.error("Failed to fetch open trips:", error);
      }
    };

    fetchOpenTrips();
  }, []);

  const [isModalOpen, setModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTrip((prevTrip) => ({ ...prevTrip, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTrip((prevTrip) => ({ ...prevTrip, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setNewTrip((prevTrip) => ({ ...prevTrip, image: file }));
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    for (const key in newTrip) {
      console.log(newTrip[key as keyof NewOpenTrip]);
      if (newTrip[key as keyof NewOpenTrip] !== null) {
        formData.append(
          key,
          newTrip[key as keyof NewOpenTrip] as string | Blob
        );
      }
    }
    try {
      const response = await axios.post(
        "https://highking.cloud/api/open-trips",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Product added successfully!");
      setModalOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Failed to add product. Please try again.");
      console.error("Failed to create open trip:", error);
    }
  };

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
                  href="/mitra/dashboard"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Home className="h-5 w-5" />
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
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
                  href="/mitra/dashboard"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
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
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
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
                <BreadcrumbPage>Product</BreadcrumbPage>
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
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="archived" className="hidden sm:flex">
                  Archived
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Active</DropdownMenuItem>
                    <DropdownMenuItem>Draft</DropdownMenuItem>
                    <DropdownMenuItem>Archived</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => setModalOpen(true)}
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Open Trip
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Add New Open Trip</DialogTitle>
                      <DialogDescription>
                        Fill out the details for the new open trip.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-4 gap-4">
                      <input
                        type="hidden"
                        name="partner_uid"
                        value={newTrip.partner_uid}
                      />
                      <div className="col-span-2">
                        <Label htmlFor="mountain_uuid">Mountain</Label>
                        <select
                          name="mountain_uuid"
                          value={newTrip.mountain_uuid}
                          onChange={handleSelectChange}
                          className="w-full border border-gray-300 rounded p-2"
                        >
                          <option value="">Select a mountain</option>
                          {mountains.map((mountain) => (
                            <option
                              key={mountain.mountain_uuid}
                              value={mountain.mountain_uuid}
                            >
                              {mountain.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          name="name"
                          placeholder="Name"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          name="description"
                          placeholder="Description"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          name="price"
                          placeholder="Price"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="min_people">Min People</Label>
                        <Input
                          name="min_people"
                          placeholder="Min People"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="max_people">Max People</Label>
                        <Input
                          name="max_people"
                          placeholder="Max People"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="policy">Policy</Label>
                        <Input
                          name="policy"
                          placeholder="Policy"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="include">Include</Label>
                        <Input
                          name="include"
                          placeholder="Include"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="exclude">Exclude</Label>
                        <Input
                          name="exclude"
                          placeholder="Exclude"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="gmaps">Google Maps Link</Label>
                        <Input
                          name="gmaps"
                          placeholder="Google Maps Link"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input
                          name="start_date"
                          type="date"
                          placeholder="Start Date"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                          name="end_date"
                          type="date"
                          placeholder="End Date"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="start_time">Start Time</Label>
                        <Input
                          name="start_time"
                          type="time"
                          placeholder="Start Time"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="end_time">End Time</Label>
                        <Input
                          name="end_time"
                          type="time"
                          placeholder="End Time"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="image">Image</Label>
                        <Input
                          name="image"
                          type="file"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddProduct}>Add Product</Button>
                      <Button
                        variant="outline"
                        onClick={() => setModalOpen(false)}
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                    Manage your products and view their sales performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {openTrips.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-20 md:py-40">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                          You have no open trip
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          You can start selling as soon as you add a open trip. <br/>Click the button at the right page to add a new open trip.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden w-[100px] sm:table-cell">
                            <span className="sr-only">Image</span>
                          </TableHead>
                          <TableHead>Open Trip Name</TableHead>
                          <TableHead>Mountain</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Price
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Total Participants
                          </TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {openTrips.map((trip) => (
                          <TableRow key={trip.open_trip_uuid}>
                            <TableCell className="hidden sm:table-cell">
                              <Image
                                alt="Product image"
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                src={trip.image_url || "/placeholder.svg"}
                                width="64"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {trip.name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {trip.mountain_name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">Active</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(trip.price)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {trip.total_participants}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuLabel>
                                    <Dialog
                                      open={isScheduleModalOpen}
                                      onOpenChange={setScheduleModalOpen}
                                    >
                                      <DialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          className="h-8 gap-1"
                                          onClick={() => handleEditClick(trip)}
                                        >
                                          Add Schedule
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-3xl">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Add Schedule
                                          </DialogTitle>
                                          <DialogDescription>
                                            Fill out the details for the new
                                            schedule.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid grid-cols-4 gap-4">
                                          <input
                                            type="hidden"
                                            name="open_trip_uuid"
                                            value={newSchedule.open_trip_uuid}
                                          />
                                          <div className="col-span-2">
                                            <Label htmlFor="day">Day</Label>
                                            <Input
                                              name="day"
                                              type="number"
                                              value={newSchedule.day}
                                              onChange={
                                                handleScheduleInputChange
                                              }
                                            />
                                          </div>
                                          <div className="col-span-4">
                                            <Label htmlFor="description">
                                              Description
                                            </Label>
                                            <Input
                                              name="description"
                                              placeholder="Description"
                                              value={newSchedule.description}
                                              onChange={
                                                handleScheduleInputChange
                                              }
                                            />
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button onClick={handleAddSchedule}>
                                            Add Schedule
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              setScheduleModalOpen(false)
                                            }
                                          >
                                            Cancel
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </DropdownMenuLabel>
                                  <DropdownMenuLabel>
                                    <Dialog
                                      open={isFaqModalOpen}
                                      onOpenChange={setFaqModalOpen}
                                    >
                                      <DialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          className="h-8 gap-1"
                                          onClick={() =>
                                            handleAddFaqClick(trip)
                                          }
                                        >
                                          Add FAQ
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-3xl">
                                        <DialogHeader>
                                          <DialogTitle>Add FAQ</DialogTitle>
                                          <DialogDescription>
                                            Fill out the details for the new
                                            FAQ.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid grid-cols-4 gap-4">
                                          <input
                                            type="hidden"
                                            name="open_trip_uuid"
                                            value={newFaq.open_trip_uuid}
                                          />
                                          <div className="col-span-4">
                                            <Label htmlFor="faqQuestion">
                                              Question
                                            </Label>
                                            <Input
                                              name="faqQuestion"
                                              placeholder="Question"
                                              value={newFaqQuestion}
                                              onChange={handleFaqQuestionChange}
                                            />
                                          </div>
                                          <div className="col-span-4">
                                            <Label htmlFor="faqAnswer">
                                              Answer
                                            </Label>
                                            <Input
                                              name="faqAnswer"
                                              placeholder="Answer"
                                              value={newFaqAnswer}
                                              onChange={handleFaqAnswerChange}
                                            />
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button onClick={handleAddFaq}>
                                            Add FAQ
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              setFaqModalOpen(false)
                                            }
                                          >
                                            Cancel
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </DropdownMenuLabel>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>{openTrips.length}</strong> products
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute(Product);

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

const getMitraProfile = async (partnerId: string) => {
  const response = await axios.get(
    `https://highking.cloud/api/open-trips/partners/${partnerId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data.data[0].open_trip_data;
};
