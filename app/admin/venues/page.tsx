/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Search, Edit, Trash, Building, Plus } from "lucide-react";
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
import { useToast } from "@/hooks/useToast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

const mockVenues = [
  {
    id: "V-123",
    name: "Sunset Beach Resort",
    owner: "Maria Garcia",
    location: "Miami, FL",
    capacity: 250,
    priceRange: "$3,500 - $5,200",
    status: "active",
    featured: true,
  },
  {
    id: "V-124",
    name: "Mountain View Manor",
    owner: "Sarah Johnson",
    location: "Denver, CO",
    capacity: 180,
    priceRange: "$2,800 - $4,500",
    status: "active",
    featured: false,
  },
  {
    id: "V-125",
    name: "Urban Loft Gallery",
    owner: "James Wilson",
    location: "Chicago, IL",
    capacity: 120,
    priceRange: "$1,800 - $3,200",
    status: "inactive",
    featured: false,
  },
  {
    id: "V-126",
    name: "Lakeside Pavilion",
    owner: "Robert Brown",
    location: "Minneapolis, MN",
    capacity: 200,
    priceRange: "$2,200 - $3,800",
    status: "active",
    featured: true,
  },
  {
    id: "V-127",
    name: "Grand Ballroom Hotel",
    owner: "Lisa Murphy",
    location: "New York, NY",
    capacity: 350,
    priceRange: "$4,500 - $7,800",
    status: "active",
    featured: false,
  },
];

const AdminVenues: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const { toast } = useToast();
  const [venues, setVenues] = useState(mockVenues);

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || venue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteVenue = (venue: any) => {
    setSelectedVenue(venue);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteVenue = () => {
    setVenues(venues.filter((v) => v.id !== selectedVenue.id));
    toast({
      title: "Venue Deleted",
      description: `${selectedVenue.name} has been deleted.`,
      variant: "destructive",
    });
    setIsDeleteDialogOpen(false);
  };

  const toggleFeatured = (id: string) => {
    setVenues(
      venues.map((venue) => {
        if (venue.id === id) {
          const newFeatured = !venue.featured;
          toast({
            title: newFeatured ? "Added to Featured" : "Removed from Featured",
            description: `${venue.name} has been ${
              newFeatured ? "added to" : "removed from"
            } featured venues.`,
          });
          return { ...venue, featured: newFeatured };
        }
        return venue;
      })
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search venues by name, owner, or location..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Venues</CardTitle>
            <CardDescription>Manage all venues on the platform</CardDescription>
          </div>
          <Button
            className="mt-4 md:mt-0"
            onClick={() => router.push("/admin/venues/new")}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Venue
          </Button>
        </CardHeader>
        <CardContent>
          {filteredVenues.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Venue</th>
                    <th className="text-left py-3 px-4 font-medium">Owner</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Capacity
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Price Range
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Featured
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVenues.map((venue) => (
                    <tr key={venue.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                            <Building className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{venue.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {venue.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{venue.owner}</td>
                      <td className="py-3 px-4">{venue.location}</td>
                      <td className="py-3 px-4">{venue.capacity}</td>
                      <td className="py-3 px-4">{venue.priceRange}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            venue.status === "active" ? "default" : "outline"
                          }
                        >
                          {venue.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Switch
                          checked={venue.featured}
                          onCheckedChange={() => toggleFeatured(venue.id)}
                          aria-label={
                            venue.featured ? "Featured" : "Not Featured"
                          }
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(`/admin/venues/edit/${venue.id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteVenue(venue)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {selectedVenue && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Venue</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete &quot;{selectedVenue.name}&quot;?
              This action cannot be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteVenue}>
                Delete Venue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AdminVenues;
