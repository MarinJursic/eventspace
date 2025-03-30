"use client";

import React, { useState } from "react";
import { Search, Edit, Trash, Package, Plus } from "lucide-react";
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

const mockServices = [
  {
    id: "S-456",
    name: "Elite Catering Solutions",
    owner: "David Wilson",
    type: "Catering",
    priceRange: "$45 - $85 per person",
    location: "Multiple Locations",
    status: "active",
    featured: true,
  },
  {
    id: "S-457",
    name: "Harmony Wedding Photography",
    owner: "Emily Chen",
    type: "Photography",
    priceRange: "$1,200 - $3,500 per event",
    location: "New York, NY",
    status: "active",
    featured: false,
  },
  {
    id: "S-458",
    name: "Sound & Lighting Experts",
    owner: "Michael Brown",
    type: "Audio/Visual",
    priceRange: "$800 - $2,500",
    location: "Los Angeles, CA",
    status: "active",
    featured: true,
  },
  {
    id: "S-459",
    name: "Floral Design Studio",
    owner: "Jennifer Lee",
    type: "Floral Design",
    priceRange: "$500 - $2,000",
    location: "Chicago, IL",
    status: "inactive",
    featured: false,
  },
  {
    id: "S-460",
    name: "Premier DJ Services",
    owner: "Kevin Taylor",
    type: "Entertainment",
    priceRange: "$750 - $1,500 per event",
    location: "Miami, FL",
    status: "active",
    featured: false,
  },
];

const AdminServices: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const { toast } = useToast();
  const [services, setServices] = useState(mockServices);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteService = (service: any) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteService = () => {
    // For demonstration, we remove the service from the list
    setServices(services.filter((s) => s.id !== selectedService.id));
    toast({
      title: "Service Deleted",
      description: `${selectedService.name} has been deleted.`,
      variant: "destructive",
    });
    setIsDeleteDialogOpen(false);
  };

  const toggleFeatured = (service: any) => {
    // For demonstration, show a toast notification.
    toast({
      title: service.featured ? "Removed from Featured" : "Added to Featured",
      description: `${service.name} has been ${
        service.featured ? "removed from" : "added to"
      } featured services.`,
    });
    // In a real implementation, update the service's featured property.
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services by name, owner, or type..."
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
            <CardTitle>Services</CardTitle>
            <CardDescription>
              Manage all services on the platform
            </CardDescription>
          </div>
          <Button
            className="mt-4 md:mt-0"
            onClick={() => router.push("/admin/services/new")}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Service
          </Button>
        </CardHeader>
        <CardContent>
          {filteredServices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Service</th>
                    <th className="text-left py-3 px-4 font-medium">Owner</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Price Range
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Featured
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {service.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{service.owner}</td>
                      <td className="py-3 px-4">{service.type}</td>
                      <td className="py-3 px-4">{service.priceRange}</td>
                      <td className="py-3 px-4">{service.location}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            service.status === "active" ? "default" : "outline"
                          }
                        >
                          {service.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Switch
                          checked={service.featured}
                          onCheckedChange={() => toggleFeatured(service)}
                          aria-label={
                            service.featured ? "Featured" : "Not Featured"
                          }
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(`/admin/services/edit/${service.id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteService(service)}
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
                No services match your search criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedService && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Service</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete "{selectedService.name}"? This
              action cannot be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteService}>
                Delete Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AdminServices;
