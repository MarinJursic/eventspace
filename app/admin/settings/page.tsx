"use client";

import React from "react";
import { Save, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";

const AdminSettings: React.FC = () => {
  const { toast } = useToast();

  const handleSaveGeneralSettings = () => {
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    });
  };

  const handleSaveEmailSettings = () => {
    toast({
      title: "Email Settings Saved",
      description: "Email configuration has been updated successfully.",
    });
  };

  const handleSavePaymentSettings = () => {
    toast({
      title: "Payment Settings Saved",
      description: "Payment configuration has been updated successfully.",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache Cleared",
      description: "System cache has been successfully cleared.",
    });
  };

  return (
    <Tabs defaultValue="general">
      <TabsList className="mb-6">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
        <TabsTrigger value="system">System</TabsTrigger>
      </TabsList>

      {/* General Settings */}
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage platform-wide settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" defaultValue="EventSpace" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-url">Site URL</Label>
              <Input
                id="site-url"
                defaultValue="https://eventspace.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                defaultValue="contact@eventspace.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-phone">Support Phone</Label>
              <Input id="support-phone" defaultValue="+1 (555) 123-4567" />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <Switch id="maintenance-mode" />
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, the site will display a maintenance message to all
                non-admin users.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="registration-open">
                  Allow New Registrations
                </Label>
                <Switch id="registration-open" defaultChecked />
              </div>
              <p className="text-sm text-muted-foreground">
                When disabled, new users cannot register for accounts.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveGeneralSettings}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Email Settings */}
      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
            <CardDescription>
              Configure email settings and templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" defaultValue="smtp.example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" defaultValue="587" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-username">SMTP Username</Label>
              <Input
                id="smtp-username"
                defaultValue="notification@eventspace.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input
                id="smtp-password"
                type="password"
                defaultValue="********"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="welcome-email">Welcome Email Template</Label>
              <Textarea
                id="welcome-email"
                rows={4}
                defaultValue="Welcome to EventSpace! We're excited to have you join our platform..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-confirm-email">
                Booking Confirmation Template
              </Label>
              <Textarea
                id="booking-confirm-email"
                rows={4}
                defaultValue="Your booking has been confirmed! Here are the details of your reservation..."
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="send-welcome">Send Welcome Emails</Label>
                <Switch id="send-welcome" defaultChecked />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveEmailSettings}>
              <Save className="mr-2 h-4 w-4" /> Save Email Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Payment Settings */}
      <TabsContent value="payment">
        <Card>
          <CardHeader>
            <CardTitle>Payment Configuration</CardTitle>
            <CardDescription>
              Configure payment methods and commission rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="commission-rate">
                Platform Commission Rate (%)
              </Label>
              <Input
                id="commission-rate"
                defaultValue="10"
                type="number"
                min="0"
                max="100"
              />
              <p className="text-sm text-muted-foreground">
                Percentage of each transaction that goes to the platform.
              </p>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Gateways</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stripe-enabled">Stripe</Label>
                  <Switch id="stripe-enabled" defaultChecked />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-public-key">Stripe Public Key</Label>
                    <Input id="stripe-public-key" defaultValue="pk_test_..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret-key">Stripe Secret Key</Label>
                    <Input
                      id="stripe-secret-key"
                      defaultValue="sk_test_..."
                      type="password"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="paypal-enabled">PayPal</Label>
                  <Switch id="paypal-enabled" defaultChecked />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypal-client-id">PayPal Client ID</Label>
                    <Input id="paypal-client-id" defaultValue="client_id_..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paypal-secret">PayPal Secret</Label>
                    <Input
                      id="paypal-secret"
                      defaultValue="client_secret_..."
                      type="password"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="test-mode">Test Mode</Label>
                <Switch id="test-mode" defaultChecked />
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, payments will be processed in test mode. No real
                charges will be made.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSavePaymentSettings}>
              <Save className="mr-2 h-4 w-4" /> Save Payment Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* System Settings */}
      <TabsContent value="system">
        <Card>
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>
              Manage system operations and maintenance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Clear System Cache</Label>
              <p className="text-sm text-muted-foreground">
                Clearing the cache can help resolve certain issues and improve
                performance.
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={handleClearCache}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Clear Cache
              </Button>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Database Information</Label>
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between py-1">
                  <span className="text-sm font-medium">Database Size:</span>
                  <span className="text-sm">243 MB</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm font-medium">Last Backup:</span>
                  <span className="text-sm">Today, 3:45 AM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm font-medium">Total Records:</span>
                  <span className="text-sm">24,519</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>System Logs</Label>
              <div className="bg-muted p-4 rounded-md h-40 overflow-y-auto">
                <pre className="text-xs">
                  {`[2023-07-28 15:30:22] System maintenance started
[2023-07-28 15:30:24] Checking database integrity
[2023-07-28 15:30:26] Database check completed successfully
[2023-07-28 15:30:28] Starting cache refresh
[2023-07-28 15:30:35] Cache refresh completed
[2023-07-28 15:30:38] System maintenance completed
[2023-07-27 03:45:10] Automatic backup completed
[2023-07-26 08:12:45] User authentication system updated`}
                </pre>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Page
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminSettings;
