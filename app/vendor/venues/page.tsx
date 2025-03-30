"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash, Search, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";

// Mock data for venues
const mockVenues = [
  {
    id: 1,
    name: "Garden Paradise",
    location: "Los Angeles, CA",
    capacity: "50-200",
    price: "$3,000",
    rating: 4.8,
    reviews: 24,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Urban Loft",
    location: "New York, NY",
    capacity: "20-100",
    price: "$2,500",
    rating: 4.5,
    reviews: 18,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Lakeside Retreat",
    location: "Chicago, IL",
    capacity: "30-150",
    price: "$2,800",
    rating: 4.7,
    reviews: 22,
    status: "inactive",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  },
];

// Mock data for services
const mockServices = [
  {
    id: 1,
    name: "Premium Catering",
    category: "Catering",
    price: "$50 per person",
    rating: 4.9,
    reviews: 32,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Live Jazz Band",
    category: "Music",
    price: "$1,200",
    rating: 4.7,
    reviews: 15,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1471478331774-77fda9372f30?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Photography Package",
    category: "Photography",
    price: "$1,800",
    rating: 4.8,
    reviews: 27,
    status: "inactive",
    image:
      "https://images.unsplash.com/photo-1571624436279-b272aff752b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
  },
];

const VendorVenues: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("venues");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddVenueOpen, setIsAddVenueOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  const filteredVenues = mockVenues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = mockServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVenue = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Venue Added",
      description: "Your new venue has been successfully added.",
    });
    setIsAddVenueOpen(false);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Service Added",
      description: "Your new service has been successfully added.",
    });
    setIsAddServiceOpen(false);
  };

  const handleEditItem = (type: string, id: number) => {
    toast({
      title: `${type} Edit Requested`,
      description: `You requested to edit ${type.toLowerCase()} #${id}.`,
    });
  };

  const handleDeleteItem = (type: string, id: number) => {
    toast({
      title: `${type} Deleted`,
      description: `The ${type.toLowerCase()} has been deleted.`,
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Manage and track all your listings
        </p>
        {activeTab === "venues" ? (
          <Button onClick={() => setIsAddVenueOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Venue
          </Button>
        ) : (
          <Button onClick={() => setIsAddServiceOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Service
          </Button>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeTab}...`}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="venues" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="venues" className="space-y-4">
          {filteredVenues.length > 0 ? (
            filteredVenues.map((venue) => (
              <Card key={venue.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{venue.name}</h3>
                        <p className="text-muted-foreground">
                          {venue.location}
                        </p>
                      </div>
                      <Badge
                        variant={
                          venue.status === "active" ? "default" : "secondary"
                        }
                      >
                        {venue.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Capacity
                        </p>
                        <p className="font-medium">{venue.capacity} guests</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium">{venue.price} / event</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="font-medium">{venue.rating}</span>
                          <span className="text-muted-foreground ml-1">
                            ({venue.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditItem("Venue", venue.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteItem("Venue", venue.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No venues found.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsAddVenueOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Venue
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {service.name}
                        </h3>
                        <Badge variant="outline" className="mt-1">
                          {service.category}
                        </Badge>
                      </div>
                      <Badge
                        variant={
                          service.status === "active" ? "default" : "secondary"
                        }
                      >
                        {service.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium">{service.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="font-medium">{service.rating}</span>
                          <span className="text-muted-foreground ml-1">
                            ({service.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditItem("Service", service.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteItem("Service", service.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No services found.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsAddServiceOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Service
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Venue Dialog */}
      <Dialog open={isAddVenueOpen} onOpenChange={setIsAddVenueOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Venue</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new venue to your listings.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddVenue} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue-name">Venue Name</Label>
                <Input
                  id="venue-name"
                  placeholder="Enter venue name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue-location">Location</Label>
                <Input id="venue-location" placeholder="City, State" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue-capacity">Capacity</Label>
                <Input
                  id="venue-capacity"
                  placeholder="e.g., 50-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue-price">Price (per event)</Label>
                <Input id="venue-price" placeholder="e.g., $3,000" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue-description">Description</Label>
              <Textarea
                id="venue-description"
                placeholder="Describe your venue"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue-image">Image URL</Label>
              <Input id="venue-image" placeholder="https://..." required />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddVenueOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Venue</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Service Dialog */}
      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new service to your listings.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddService} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  placeholder="Enter service name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-category">Category</Label>
                <Input
                  id="service-category"
                  placeholder="e.g., Catering, Music"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-price">Price</Label>
                <Input
                  id="service-price"
                  placeholder="e.g., $50 per person"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-description">Description</Label>
              <Textarea
                id="service-description"
                placeholder="Describe your service"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-image">Image URL</Label>
              <Input id="service-image" placeholder="https://..." required />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddServiceOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Service</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VendorVenues;
