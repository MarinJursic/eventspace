"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/useToast";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { signOut, useSession } from "next-auth/react";

const Settings: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "(555) 123-4567",
    bio: "Event enthusiast and planner for corporate gatherings and celebrations.",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    bookingUpdates: true,
    promotions: false,
    newVenues: true,
    serviceUpdates: true,
    emailSummary: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Protection against unauthenticated access
  if (!session?.user) {
    router.push("/");
    toast({
      title: "Authentication required",
      description: "Please log in to access your settings",
      variant: "destructive",
    });
    return null;
  }

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (
    setting: keyof typeof notificationSettings
  ) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully",
    });
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved",
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    });

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      toast({
        title: "Account deleted",
        description:
          "Your account has been deleted. You will be redirected to the homepage.",
      });
      setTimeout(() => {
        signOut({ redirect: false });
        router.push("/");
      }, 2000);
    }
  };

  return (
    <AnimatedSection animation="fade-in">
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your profile information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={profileData.bio}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Address Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={profileData.city}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={profileData.state}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP/Postal Code</Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={profileData.zip}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={profileData.country}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveNotifications} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="bookingUpdates"
                      className="flex flex-col space-y-1 items-start"
                    >
                      <span>Booking Updates</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Receive notifications about your booking status changes
                      </span>
                    </Label>
                    <Switch
                      id="bookingUpdates"
                      defaultChecked={notificationSettings.bookingUpdates}
                      onCheckedChange={() =>
                        handleNotificationChange("bookingUpdates")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="promotions"
                      className="flex flex-col space-y-1 items-start"
                    >
                      <span>Promotions &amp; Offers</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Receive special offers and promotional discounts
                      </span>
                    </Label>
                    <Switch
                      id="promotions"
                      defaultChecked={notificationSettings.promotions}
                      onCheckedChange={() =>
                        handleNotificationChange("promotions")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="newVenues"
                      className="flex flex-col space-y-1 items-start"
                    >
                      <span>New Venues</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Be notified when new venues join our platform
                      </span>
                    </Label>
                    <Switch
                      id="newVenues"
                      defaultChecked={notificationSettings.newVenues}
                      onCheckedChange={() =>
                        handleNotificationChange("newVenues")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="serviceUpdates"
                      className="flex flex-col space-y-1 items-start"
                    >
                      <span>Service Updates</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Get notified about changes to services you&apos;ve
                        booked
                      </span>
                    </Label>
                    <Switch
                      id="serviceUpdates"
                      defaultChecked={notificationSettings.serviceUpdates}
                      onCheckedChange={() =>
                        handleNotificationChange("serviceUpdates")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="emailSummary"
                      className="flex flex-col space-y-1 items-start"
                    >
                      <span>Weekly Email Summary</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Receive a weekly digest of your activity and
                        recommendations
                      </span>
                    </Label>
                    <Switch
                      id="emailSummary"
                      defaultChecked={notificationSettings.emailSummary}
                      onCheckedChange={() =>
                        handleNotificationChange("emailSummary")
                      }
                    />
                  </div>
                </div>

                <Button type="submit">Save Preferences</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <Button type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Protect your account with 2FA
                    </p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage your currently active sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Current Browser</h4>
                    <p className="text-sm text-muted-foreground">
                      Chrome on Windows • Active now
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Current
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Mobile App</h4>
                    <p className="text-sm text-muted-foreground">
                      iPhone 13 • Last active 2 days ago
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Revoke
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control how your information is used
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="profileVisibility"
                      className="flex flex-col space-y-1 items-start"
                    >
                      <span>Profile Visibility</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Allow vendors to see your profile information
                      </span>
                    </Label>
                    <Switch id="profileVisibility" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="dataCollect"
                      className="flex flex-col space-y-1 items-start"
                    >
                      <span>Data Collection</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Allow us to collect usage data to improve our services
                      </span>
                    </Label>
                    <Switch id="dataCollect" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label
                      htmlFor="thirdParty"
                      className="flex flex-col space-y-1 items-start"
                    >
                      <span>Third-Party Marketing</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Allow trusted partners to send you relevant offers
                      </span>
                    </Label>
                    <Switch id="thirdParty" />
                  </div>
                </div>

                <div className="mt-6">
                  <Button>Save Privacy Settings</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Control your personal data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Export Your Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of your personal data and booking history
                  </p>
                  <Button variant="outline">Request Export</Button>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <h4 className="font-medium text-destructive">
                    Delete Account
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AnimatedSection>
  );
};

export default Settings;
