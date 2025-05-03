"use client";

import React, { useState } from "react";
import {
  Camera,
  Edit,
  MapPin,
  Mail,
  Phone,
  Globe,
  Star,
  Shield,
  Clock,
  Save,
  Upload,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// Form schema for profile information
const profileSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  website: z.string().url("Invalid website URL").or(z.string().length(0)),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const VendorProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Mock vendor data
  const vendorData = {
    businessName: "Elegant Events & Venues",
    description:
      "With over 15 years of experience in the event industry, Elegant Events & Venues specializes in creating memorable experiences for weddings, corporate events, and private celebrations. Our venues feature stunning architecture and beautiful gardens that provide the perfect backdrop for any occasion.",
    email: "contact@elegantevents.com",
    phone: "(555) 123-4567",
    website: "www.elegantevents.com",
    address: "123 Event Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    avatar:
      "https://images.unsplash.com/photo-1556745753-b2904692b3cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1548&q=80",
    memberSince: "January 2018",
    rating: 4.8,
    reviewCount: 156,
    responseRate: "98%",
    responseTime: "Within 2 hours",
    verifications: ["Identity", "Business License", "Insurance"],
    venues: 5,
    services: 8,
    completedBookings: 312,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: vendorData,
  });

  const onSubmit = (data: ProfileFormValues) => {
    // In a real app, save data to backend
    console.log(data);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Cover Image and Profile section */}
      <div className="relative rounded-xl overflow-hidden">
        <div className="h-64 bg-muted relative">
          <Image
            src={vendorData.coverImage}
            alt="Cover"
            fill
            className="w-full h-full object-cover"
          />
          <Button
            className="absolute top-4 right-4"
            variant="secondary"
            size="sm"
          >
            <Camera className="h-4 w-4 mr-2" />
            Change Cover
          </Button>
        </div>

        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage
                src={vendorData.avatar}
                alt={vendorData.businessName}
              />
              <AvatarFallback>
                {vendorData.businessName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
              size="icon"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-4 right-8">
          <Badge className="bg-green-500 hover:bg-green-600">
            <div className="flex items-center space-x-1">
              <Star className="fill-current text-white h-3 w-3" />
              <span>{vendorData.rating}</span>
            </div>
          </Badge>
        </div>
      </div>

      <div className="pt-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{vendorData.businessName}</h1>
            <div className="flex items-center space-x-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>
                {vendorData.city}, {vendorData.state}
              </span>
              <span>•</span>
              <span>Member since {vendorData.memberSince}</span>
            </div>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business Details</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update your business profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input id="businessName" {...register("businessName")} />
                      {errors.businessName && (
                        <p className="text-sm text-red-500">
                          {errors.businessName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register("email")} />
                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" {...register("phone")} />
                      {errors.phone && (
                        <p className="text-sm text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" {...register("website")} />
                      {errors.website && (
                        <p className="text-sm text-red-500">
                          {errors.website.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      rows={5}
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" {...register("address")} />
                    {errors.address && (
                      <p className="text-sm text-red-500">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" {...register("city")} />
                      {errors.city && (
                        <p className="text-sm text-red-500">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" {...register("state")} />
                      {errors.state && (
                        <p className="text-sm text-red-500">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input id="zipCode" {...register("zipCode")} />
                      {errors.zipCode && (
                        <p className="text-sm text-red-500">
                          {errors.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{vendorData.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span>{vendorData.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span>{vendorData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={`https://${vendorData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {vendorData.website}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>
                        {vendorData.address}, {vendorData.city},{" "}
                        {vendorData.state} {vendorData.zipCode}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Venues</span>
                      <span className="font-medium">{vendorData.venues}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Services</span>
                      <span className="font-medium">{vendorData.services}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Completed Bookings
                      </span>
                      <span className="font-medium">
                        {vendorData.completedBookings}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Member Since
                      </span>
                      <span className="font-medium">
                        {vendorData.memberSince}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="text-muted-foreground">Rating</span>
                      </div>
                      <div className="font-medium">
                        {vendorData.rating} ({vendorData.reviewCount} reviews)
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Response Time
                        </span>
                      </div>
                      <div className="font-medium">
                        {vendorData.responseTime}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Response Rate
                        </span>
                      </div>
                      <div className="font-medium">
                        {vendorData.responseRate}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Verifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {vendorData.verifications.map((verification, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Shield className="h-4 w-4 text-green-600" />
                          <span>{verification} Verified</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your regular business hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <div className="w-40">
                      <span>{day}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Switch defaultChecked={day !== "Sunday"} />
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Input
                          defaultValue={day !== "Sunday" ? "9:00 AM" : ""}
                          disabled={day === "Sunday"}
                        />
                        <Input
                          defaultValue={day !== "Sunday" ? "5:00 PM" : ""}
                          disabled={day === "Sunday"}
                        />
                      </div>
                      {day === "Sunday" && (
                        <span className="text-muted-foreground">Closed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Information</CardTitle>
              <CardDescription>Manage your tax details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / EIN</Label>
                  <Input id="taxId" type="text" value="XX-XXXXXXX" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input id="businessType" type="text" value="LLC" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxAddress">Tax Address</Label>
                <Input
                  id="taxAddress"
                  type="text"
                  value="123 Event Avenue, New York, NY 10001"
                  readOnly
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
              <CardDescription>
                Upload and manage your legal documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Business License</Label>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <span>business-license-2023.pdf</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Replace
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Insurance Certificate</Label>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <span>insurance-certificate.pdf</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Replace
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Upload New Document</Label>
                <div className="border border-dashed rounded-md p-6 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-2 bg-muted rounded-full">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop files here, or click to select files
                    </p>
                    <Button variant="outline" size="sm">
                      Select Files
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New Booking Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when a new booking is made
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Message Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for new messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Review Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when a new review is posted
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Emails</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive marketing and promotional emails
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>
                Manage your account visibility and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Account Visibility</h4>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to customers
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-red-500">Deactivate Account</h4>
                <p className="text-sm text-muted-foreground">
                  Temporarily deactivate your account. You can reactivate it
                  later.
                </p>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  Deactivate Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorProfile;
