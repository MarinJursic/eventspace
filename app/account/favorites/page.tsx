"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  ChevronRight,
  MapPin,
  Search,
  Trash,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/useToast";
import AnimatedSection from "@/components/ui/AnimatedSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import {venues} from "@/lib/mockVenues"

// Mock favorites data
const mockVenueFavorites = venues;

const mockServiceFavorites = [
  {
    id: "s1",
    name: "Premium Catering",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    provider: "Gourmet Events Co.",
    type: "Catering",
    priceRange: "$$$",
    rating: 4.7,
    savedDate: "2023-06-28",
  },
  {
    id: "s2",
    name: "Professional Photography",
    image:
      "https://images.unsplash.com/photo-1581699493864-468d40662e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    provider: "Capture Moments",
    type: "Photography",
    priceRange: "$$",
    rating: 4.9,
    savedDate: "2023-05-30",
  },
];

const Favorites: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [venueFavorites, setVenueFavorites] = useState(mockVenueFavorites);
  const [serviceFavorites, setServiceFavorites] =
    useState(mockServiceFavorites);

  if (!session?.user) {
    router.push("/");
    toast({
      title: "Authentication required",
      description: "Please log in to view your favorites",
      variant: "destructive",
    });
    return null;
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredVenues = venueFavorites.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (venue.type && venue.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredServices = mockServiceFavorites.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeVenueFavorite = (id: string) => {
    setVenueFavorites((prev) => prev.filter((venue) => venue.id !== id));
    toast({
      title: "Removed from favorites",
      description: "Venue has been removed from your favorites",
    });
  };

  const removeServiceFavorite = (id: string) => {
    setServiceFavorites((prev) => prev.filter((service) => service.id !== id));
    toast({
      title: "Removed from favorites",
      description: "Service has been removed from your favorites",
    });
  };

  return (
    <>
      <AnimatedSection animation="fade-in">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-in" delay={100}>
        <Tabs defaultValue="venues" className="space-y-6">
          <TabsList>
            <TabsTrigger value="venues">
              Venues ({venueFavorites.length})
            </TabsTrigger>
            <TabsTrigger value="services">
              Services ({serviceFavorites.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="venues">
            <div className="space-y-6">
              {filteredVenues.length > 0 ? (
                filteredVenues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    onRemove={() => removeVenueFavorite(venue.id)}
                    onView={() => router.push(`/venues/${venue.id}`)}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    No favorite venues yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start adding venues to your favorites
                  </p>
                  <Button onClick={() => router.push("/venues")}>
                    Browse Venues
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="space-y-6">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onRemove={() => removeServiceFavorite(service.id)}
                    onView={() => router.push(`/services/${service.id}`)}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    No favorite services yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start adding services to your favorites
                  </p>
                  <Button onClick={() => router.push("/services")}>
                    Browse Services
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </AnimatedSection>
    </>
  );
};

interface VenueCardProps {
  venue: (typeof mockVenueFavorites)[0];
  onRemove: () => void;
  onView: () => void;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, onRemove, onView }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 h-48 md:h-auto">
            <img
              src={venue.images[0]}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {venue.location}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{venue.type}</Badge>
                  <Badge variant="outline">Up to {venue.capacity} guests</Badge>
                  <Badge variant="outline">{venue.pricePerDay}</Badge>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-1">
                    {venue.rating}
                  </span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(venue.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">
                    Saved on {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={onRemove}
                    className="text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={onView} className="w-auto">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ServiceCardProps {
  service: (typeof mockServiceFavorites)[0];
  onRemove: () => void;
  onView: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onRemove,
  onView,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 h-48 md:h-auto">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  By {service.provider}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{service.type}</Badge>
                  <Badge variant="outline">{service.priceRange}</Badge>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-1">
                    {service.rating}
                  </span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(service.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">
                    Saved on {new Date(service.savedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={onRemove}
                    className="text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={onView} className="w-auto">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Favorites;
