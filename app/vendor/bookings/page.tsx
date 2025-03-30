"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// --- Mock data for bookings ---
const mockBookings = [
  {
    id: "BK-1234",
    customerName: "John Smith",
    customerEmail: "john.smith@example.com",
    customerPhone: "(555) 123-4567",
    venue: "Garden Paradise",
    date: "2023-08-15",
    time: "14:00 - 22:00",
    guests: 150,
    amount: "$3,500",
    status: "confirmed",
    notes: "Customer requested extra lighting setup",
    services: ["Premium Catering", "DJ Services"],
  },
  {
    id: "BK-1235",
    customerName: "Emily Johnson",
    customerEmail: "emily.j@example.com",
    customerPhone: "(555) 987-6543",
    venue: "Urban Loft",
    date: "2023-08-18",
    time: "18:00 - 23:00",
    guests: 80,
    amount: "$2,800",
    status: "pending",
    notes: "First-time customer, corporate event",
    services: ["Basic Catering"],
  },
  {
    id: "BK-1236",
    customerName: "Michael Brown",
    customerEmail: "michael.b@example.com",
    customerPhone: "(555) 456-7890",
    venue: "Lakeside Retreat",
    date: "2023-08-22",
    time: "12:00 - 18:00",
    guests: 120,
    amount: "$4,200",
    status: "confirmed",
    notes: "",
    services: ["Premium Catering", "Photography Package", "Live Band"],
  },
  {
    id: "BK-1237",
    customerName: "Sarah Williams",
    customerEmail: "sarah.w@example.com",
    customerPhone: "(555) 234-5678",
    venue: "Garden Paradise",
    date: "2023-08-25",
    time: "15:00 - 21:00",
    guests: 100,
    amount: "$3,200",
    status: "cancelled",
    notes: "Cancelled due to scheduling conflict",
    services: ["Premium Catering"],
  },
  {
    id: "BK-1238",
    customerName: "David Lee",
    customerEmail: "david.l@example.com",
    customerPhone: "(555) 876-5432",
    venue: "Urban Loft",
    date: "2023-09-01",
    time: "17:00 - 23:00",
    guests: 60,
    amount: "$2,400",
    status: "confirmed",
    notes: "Birthday celebration",
    services: ["Basic Catering", "DJ Services"],
  },
];

type BookingStatus = "confirmed" | "pending" | "cancelled";

const VendorBookings: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<
    (typeof mockBookings)[0] | null
  >(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    toast({
      title: "Status Updated",
      description: `Booking ${bookingId} status changed to ${newStatus}.`,
    });
  };

  const handleViewBooking = (booking: (typeof mockBookings)[0]) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const handleExportData = () => {
    toast({
      title: "Export Initiated",
      description:
        "Booking data export has started. You'll receive a download link shortly.",
    });
  };

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBooking) {
      toast({
        title: "Response Sent",
        description: `Your response to booking ${selectedBooking.id} has been sent.`,
      });
      setIsResponseModalOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            Pending
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <p className="text-muted-foreground">
          Manage and track all your venue and service bookings
        </p>
        <Button onClick={handleExportData}>
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bookings by ID, customer, or venue..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">
                    Booking ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Venue/Service
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Guests</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{booking.id}</td>
                      <td className="py-3 px-4">{booking.customerName}</td>
                      <td className="py-3 px-4">{booking.venue}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {booking.time}
                        </div>
                      </td>
                      <td className="py-3 px-4">{booking.guests}</td>
                      <td className="py-3 px-4">{booking.amount}</td>
                      <td className="py-3 px-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewBooking(booking)}
                            >
                              View Details
                            </DropdownMenuItem>
                            {booking.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(booking.id, "confirmed")
                                  }
                                >
                                  <Check className="mr-2 h-4 w-4 text-green-500" />{" "}
                                  Confirm Booking
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(booking.id, "cancelled")
                                  }
                                >
                                  <X className="mr-2 h-4 w-4 text-red-500" />{" "}
                                  Decline Booking
                                </DropdownMenuItem>
                              </>
                            )}
                            {booking.status !== "cancelled" && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setIsResponseModalOpen(true);
                                }}
                              >
                                Send Message
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No bookings found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Booking Details - {selectedBooking.id}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <DialogDescription className="text-sm font-medium text-muted-foreground">
                    Customer
                  </DialogDescription>
                  <p className="font-medium">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <DialogDescription className="text-sm font-medium text-muted-foreground">
                    Status
                  </DialogDescription>
                  <div className="mt-1">
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <DialogDescription className="text-sm font-medium text-muted-foreground">
                    Email
                  </DialogDescription>
                  <p>{selectedBooking.customerEmail}</p>
                </div>
                <div>
                  <DialogDescription className="text-sm font-medium text-muted-foreground">
                    Phone
                  </DialogDescription>
                  <p>{selectedBooking.customerPhone}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <DialogDescription className="text-sm font-medium text-muted-foreground">
                  Venue
                </DialogDescription>
                <p className="font-medium">{selectedBooking.venue}</p>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <DialogDescription className="text-sm font-medium text-muted-foreground">
                      Date
                    </DialogDescription>
                    <p>
                      {new Date(selectedBooking.date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <DialogDescription className="text-sm font-medium text-muted-foreground">
                      Time
                    </DialogDescription>
                    <p>{selectedBooking.time}</p>
                  </div>
                  <div>
                    <DialogDescription className="text-sm font-medium text-muted-foreground">
                      Guests
                    </DialogDescription>
                    <p>{selectedBooking.guests}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <DialogDescription className="text-sm font-medium text-muted-foreground">
                  Services
                </DialogDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedBooking.services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <DialogDescription className="text-sm font-medium text-muted-foreground">
                  Amount
                </DialogDescription>
                <p className="text-xl font-bold">{selectedBooking.amount}</p>
              </div>

              {selectedBooking.notes && (
                <div className="border-t pt-4">
                  <DialogDescription className="text-sm font-medium text-muted-foreground">
                    Notes
                  </DialogDescription>
                  <p className="mt-1">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              {selectedBooking.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "cancelled");
                      setIsViewModalOpen(false);
                    }}
                  >
                    <X className="mr-2 h-4 w-4 text-red-500" /> Decline
                  </Button>
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "confirmed");
                      setIsViewModalOpen(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4 text-green-500" /> Confirm
                  </Button>
                </>
              )}
              <Button
                variant="secondary"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Send Response Modal */}
      {selectedBooking && (
        <Dialog
          open={isResponseModalOpen}
          onOpenChange={setIsResponseModalOpen}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Send Message to Customer</DialogTitle>
              <DialogDescription>
                Sending message to {selectedBooking.customerName} regarding
                booking {selectedBooking.id}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendResponse}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    defaultValue={`Re: Your booking at ${selectedBooking.venue}`}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Type your message here..."
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsResponseModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Send Message</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default VendorBookings;
