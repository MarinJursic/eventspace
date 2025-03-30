"use client";

import React, { useState } from "react";
import { Check, X, Search, Filter, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";

// --- Mock Data ---
const mockVenues = [
  {
    id: "V-123",
    name: "Sunset Beach Resort",
    owner: "Maria Garcia",
    submitted: "2023-07-15",
    email: "maria@example.com",
    capacity: 250,
    type: "Beach Resort",
    images: ["/placeholder.svg", "/placeholder.svg"],
    description:
      "A beautiful beach resort with ocean views and spacious event areas",
    price: "$3,500 - $5,200",
    location: "Miami, FL",
    status: "pending",
  },
  {
    id: "V-124",
    name: "Mountain View Manor",
    owner: "Sarah Johnson",
    submitted: "2023-07-16",
    email: "sarah@example.com",
    capacity: 180,
    type: "Estate",
    images: ["/placeholder.svg", "/placeholder.svg"],
    description: "Elegant estate nestled in the mountains with panoramic views",
    price: "$2,800 - $4,500",
    location: "Denver, CO",
    status: "pending",
  },
  {
    id: "V-125",
    name: "Urban Loft Gallery",
    owner: "James Wilson",
    submitted: "2023-07-17",
    email: "james@example.com",
    capacity: 120,
    type: "Loft",
    images: ["/placeholder.svg", "/placeholder.svg"],
    description:
      "Modern urban loft with industrial charm in the heart of downtown",
    price: "$1,800 - $3,200",
    location: "Chicago, IL",
    status: "pending",
  },
];

const mockServices = [
  {
    id: "S-456",
    name: "Elite Catering Solutions",
    owner: "David Wilson",
    submitted: "2023-07-16",
    email: "david@example.com",
    type: "Catering",
    images: ["/placeholder.svg", "/placeholder.svg"],
    description: "Premium catering services with customizable menu options",
    price: "$45 - $85 per person",
    location: "Multiple Locations",
    status: "pending",
  },
  {
    id: "S-457",
    name: "Harmony Wedding Photography",
    owner: "Emily Chen",
    submitted: "2023-07-17",
    email: "emily@example.com",
    type: "Photography",
    images: ["/placeholder.svg", "/placeholder.svg"],
    description: "Capturing your special moments with artistic flair",
    price: "$1,200 - $3,500 per event",
    location: "New York, NY",
    status: "pending",
  },
  {
    id: "S-458",
    name: "Sound & Lighting Experts",
    owner: "Michael Brown",
    submitted: "2023-07-18",
    email: "michael@example.com",
    type: "Audio/Visual",
    images: ["/placeholder.svg", "/placeholder.svg"],
    description: "Professional sound and lighting solutions for any event",
    price: "$800 - $2,500",
    location: "Los Angeles, CA",
    status: "pending",
  },
];

type DetailItemType = (typeof mockVenues)[0] | (typeof mockServices)[0];

const AdminApprovals: React.FC = () => {
  const [activeTab, setActiveTab] = useState("venues");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<DetailItemType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  // Filtering pending venues and services based on search query and status
  const filteredVenues = mockVenues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || venue.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredServices = mockServices.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || service.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (item: DetailItemType) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleApprove = (item: DetailItemType) => {
    // In a real app, make an API call here
    toast({
      title: "Approved Successfully",
      description: `${item.name} has been approved and is now live.`,
    });
    setIsDialogOpen(false);
  };

  const handleReject = (item: DetailItemType) => {
    // In a real app, make an API call here
    toast({
      title: "Item Rejected",
      description: `${item.name} has been rejected.`,
      variant: "destructive",
    });
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search venues or services..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="venues" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="venues">
          <Card>
            <CardHeader>
              <CardTitle>Pending Venues</CardTitle>
              <CardDescription>
                Review and approve new venue listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredVenues.length > 0 ? (
                <div className="space-y-6">
                  {filteredVenues.map((venue) => (
                    <div
                      key={venue.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg"
                    >
                      <div className="mb-4 md:mb-0">
                        <h3 className="font-semibold text-lg">{venue.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Owner: {venue.owner}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Submitted:{" "}
                          {new Date(venue.submitted).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Location: {venue.location}
                        </p>
                        <div className="mt-2">
                          <Badge
                            variant={
                              venue.status === "pending"
                                ? "outline"
                                : venue.status === "approved"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {venue.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(venue)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(venue)}>
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(venue)}
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No venues match your search criteria
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Pending Services</CardTitle>
              <CardDescription>
                Review and approve new service listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredServices.length > 0 ? (
                <div className="space-y-6">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg"
                    >
                      <div className="mb-4 md:mb-0">
                        <h3 className="font-semibold text-lg">
                          {service.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Owner: {service.owner}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Submitted:{" "}
                          {new Date(service.submitted).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Type: {service.type}
                        </p>
                        <div className="mt-2">
                          <Badge
                            variant={
                              service.status === "pending"
                                ? "outline"
                                : service.status === "approved"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {service.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(service)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(service)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(service)}
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No services match your search criteria
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedItem && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
              <DialogDescription>
                Review details and make a decision
              </DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Images</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedItem.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${selectedItem.name} image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  ))}
                </div>

                <h4 className="font-medium mt-4 mb-2">Owner Information</h4>
                <p className="text-sm">Name: {selectedItem.owner}</p>
                <p className="text-sm">Email: {selectedItem.email}</p>

                <h4 className="font-medium mt-4 mb-2">Location</h4>
                <p className="text-sm">{selectedItem.location}</p>

                <h4 className="font-medium mt-4 mb-2">Price Range</h4>
                <p className="text-sm">{selectedItem.price}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm">{selectedItem.description}</p>

                <h4 className="font-medium mt-4 mb-2">Type</h4>
                <p className="text-sm">{selectedItem.type}</p>

                {"capacity" in selectedItem && (
                  <>
                    <h4 className="font-medium mt-4 mb-2">Capacity</h4>
                    <p className="text-sm">{selectedItem.capacity} guests</p>
                  </>
                )}

                <h4 className="font-medium mt-4 mb-2">Submission Date</h4>
                <p className="text-sm">
                  {new Date(selectedItem.submitted).toLocaleDateString()}
                </p>

                <h4 className="font-medium mt-4 mb-2">Status</h4>
                <Badge
                  variant={
                    selectedItem.status === "pending"
                      ? "outline"
                      : selectedItem.status === "approved"
                      ? "default"
                      : "destructive"
                  }
                >
                  {selectedItem.status}
                </Badge>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(selectedItem)}
              >
                <X className="h-4 w-4 mr-1" /> Reject
              </Button>
              <Button onClick={() => handleApprove(selectedItem)}>
                <Check className="h-4 w-4 mr-1" /> Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AdminApprovals;
