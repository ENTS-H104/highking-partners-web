"use client";

import AdminLayout from "@/components/AdminLayout";
import ProtectedRouteAdmin from "@/components/ProtectedRouteAdmin";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, ListFilter } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const statusColorClasses = {
  onprocess: "bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold",
  rejected: "bg-red-200 hover:bg-red-300 text-red-800 font-bold",
  accepted: "bg-green-200 hover:bg-green-300 text-green-800 font-bold",
  disabled: "bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold",
};

const rejectionMessages = [
  "KTP yang diunggah tidak valid. Pastikan Anda mengunggah KTP yang asli dan masih berlaku.",
  "Selfie dengan KTP tidak sesuai. Pastikan wajah Anda terlihat jelas dan sesuai dengan foto KTP yang diunggah.",
  "Wajah tidak sesuai dengan KTP yang diunggah. Pastikan wajah Anda sesuai dengan foto KTP yang diunggah.",
  "Gambar KTP yang diunggah tidak jelas. Silakan unggah gambar KTP yang lebih jelas dan mudah terbaca.",
  "Data yang Anda kirimkan tidak lengkap. Mohon lengkapi semua informasi yang diperlukan sebelum mengirim ulang.",
  "Informasi yang diberikan tidak sesuai dengan data yang ada. Pastikan semua informasi yang Anda berikan akurat dan benar.",
];

interface VerificationData {
  nik: string;
  name: string;
  verified_status_uuid: string;
  image_ktp: string;
  image_selfie_and_ktp: string;
  verified_status: string;
}

interface Partner {
  partner_uid: string;
  username: string;
  email: string;
  image_url: string;
  verification_data: VerificationData[];
}

const Verify = () => {
  const [onprocessData, setOnprocessData] = useState<Partner[]>([]);
  const [acceptedData, setAcceptedData] = useState<Partner[]>([]);
  const [rejectedData, setRejectedData] = useState<Partner[]>([]);
  const [disabledData, setDisabledData] = useState<Partner[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<VerificationData | null>(null);
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectionMessage, setRejectionMessage] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("onprocess");

  const fetchVerification = async (status: string) => {
    try {
      const response = await axios.get(`https://highking.cloud/api/partners/admin?status=${status}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching ${status} verification data`, error);
      return [];
    }
  };

  const fetchAllData = async () => {
    const onprocess = await fetchVerification("onprocess");
    const accepted = await fetchVerification("accepted");
    const rejected = await fetchVerification("rejected");
    const disabled = await fetchVerification("disabled");

    setOnprocessData(onprocess);
    setAcceptedData(accepted);
    setRejectedData(rejected);
    setDisabledData(disabled);
  };

  const updateVerificationStatus = async (verified_status_uuid: string, status: string, message: string) => {
    try {
      await axios.put("https://highking.cloud/api/partners/admin", {
        verified_status_uuid,
        verified_status: status,
        message,
      });
      toast.success("Verification status updated successfully");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to update verification status");
      console.error("Error updating verification status", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getCurrentData = () => {
    switch (selectedTab) {
      case "accepted":
        return acceptedData;
      case "rejected":
        return rejectedData;
      case "disabled":
        return disabledData;
      default:
        return onprocessData;
    }
  };

  const filteredData = getCurrentData();

  return (
    <AdminLayout>
      <Tabs defaultValue="onprocess" onValueChange={(value) => setSelectedTab(value)}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="onprocess">Onprocess</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="disabled">Disabled</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Fulfilled</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </div>
        </div>
        <TabsContent value="onprocess">
          <VerificationTable data={filteredData} setSelectedImage={setSelectedImage} setSelectedVerification={setSelectedVerification} setNewStatus={setNewStatus} setRejectionMessage={setRejectionMessage} />
        </TabsContent>
        <TabsContent value="accepted">
          <VerificationTable data={filteredData} setSelectedImage={setSelectedImage} setSelectedVerification={setSelectedVerification} setNewStatus={setNewStatus} setRejectionMessage={setRejectionMessage} />
        </TabsContent>
        <TabsContent value="rejected">
          <VerificationTable data={filteredData} setSelectedImage={setSelectedImage} setSelectedVerification={setSelectedVerification} setNewStatus={setNewStatus} setRejectionMessage={setRejectionMessage} />
        </TabsContent>
        <TabsContent value="disabled">
          <VerificationTable data={filteredData} setSelectedImage={setSelectedImage} setSelectedVerification={setSelectedVerification} setNewStatus={setNewStatus} setRejectionMessage={setRejectionMessage} />
        </TabsContent>
      </Tabs>

      {selectedVerification && (
        <Dialog open={!!selectedVerification} onOpenChange={() => setSelectedVerification(null)}>
          <DialogTrigger asChild>
            <Button variant="outline">Confirm Update</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Status Update</DialogTitle>
              <DialogDescription>
                {newStatus === "accepted" ? (
                  <>Are you sure you want to update the status of this verification to {newStatus}?</>
                ) : (
                  <>
                    <p>Are you sure you want to update the status of this verification to {newStatus}?</p>
                    <label htmlFor="rejectionMessage" className="block mt-4">
                      Reason for Rejection:
                    </label>
                    <select id="rejectionMessage" value={rejectionMessage} onChange={(e) => setRejectionMessage(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md">
                      {rejectionMessages.map((message) => (
                        <option key={message} value={message}>
                          {message}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => {
                  if (selectedVerification && newStatus) {
                    const message = newStatus === "accepted" ? "Verifikasi data kamu telah disetujui admin" : rejectionMessage;
                    updateVerificationStatus(selectedVerification.verified_status_uuid, newStatus, message);
                    setSelectedVerification(null);
                  }
                }}
              >
                Confirm
              </Button>
              <Button variant="outline" onClick={() => setSelectedVerification(null)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogTrigger asChild>
            <div />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]">
            <img src={selectedImage} alt="Selected" className="w-full max-w h-auto" />
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

const VerificationTable = ({ data, setSelectedImage, setSelectedVerification, setNewStatus, setRejectionMessage }: any) => {
  return (
    <Card x-chunk="dashboard-05-chunk-3">
      <div>
        <CardHeader className="px-7">
          <CardTitle>Verify Partners</CardTitle>
          <CardDescription>List of partners that need to be verified</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Profile</TableHead>
                <TableHead>NIK</TableHead>
                <TableHead>Nama KTP</TableHead>
                <TableHead>KTP</TableHead>
                <TableHead className="hidden sm:table-cell">Selfie KTP</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((verification: Partner) => (
                <TableRow key={verification.partner_uid}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img src={verification.image_url} alt="User Profile" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="font-medium">{verification.username}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">{verification.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{verification.verification_data[0].nik}</TableCell>
                  <TableCell>{verification.verification_data[0].name}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <img
                      src={verification.verification_data[0].image_ktp}
                      alt="KTP"
                      className="w-16 h-16 object-cover cursor-pointer rounded-md"
                      onClick={() => setSelectedImage(verification.verification_data[0].image_ktp)}
                    />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <img
                      src={verification.verification_data[0].image_selfie_and_ktp}
                      alt="Selfie with KTP"
                      className="w-16 h-16 object-cover cursor-pointer rounded-md"
                      onClick={() => setSelectedImage(verification.verification_data[0].image_selfie_and_ktp)}
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className={`scale-75 -ml-4 rounded-full uppercase ${
                            statusColorClasses[verification.verification_data[0].verified_status] || "bg-gray-500 hover:bg-gray-600"
                          }`}
                        >
                          {verification.verification_data[0].verified_status}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Edit Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          onSelect={() => {
                            setSelectedVerification(verification.verification_data[0]);
                            setNewStatus("accepted");
                            setRejectionMessage("");
                          }}
                        >
                          ACCEPTED
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          onSelect={() => {
                            setSelectedVerification(verification.verification_data[0]);
                            setNewStatus("rejected");
                            setRejectionMessage(rejectionMessages[0]);
                          }}
                        >
                          REJECTED
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProtectedRouteAdmin(Verify);
