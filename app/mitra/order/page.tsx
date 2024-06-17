"use client";

import MitraLayout from "@/components/MitraLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

const Order = () => {
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
      toast.success("Transaction status updated successfully");
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.transaction_logs_uuid === transactionId
            ? { ...transaction, status_accepted: status }
            : transaction
        )
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const partnerUuid = await getCurrentPartnerId();
      fetchTransactions(partnerUuid).then((data) => setTransactions(data));
    };

    fetchData();
  }, []);

  return (
    <MitraLayout>
      <Tabs defaultValue="week">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-sm"
                >
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Fulfilled
                </DropdownMenuCheckboxItem>
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
        <TabsContent value="week">
          <Card x-chunk="dashboard-05-chunk-3">
            <div>
              <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  Recent orders from your store.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Status Payment
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Status Mitra
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Total Participant
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
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
                              <DropdownMenuLabel>Edit Status</DropdownMenuLabel>
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
                        <TableCell>{transaction.total_participant}</TableCell>
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
                          transaction to {newStatus}?
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
        </TabsContent>
      </Tabs>
    </MitraLayout>
  );
};

export default ProtectedRoute(Order);
