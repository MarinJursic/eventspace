"use client";

import React from "react";
import {
  Users,
  Building,
  Package,
  Calendar,
  FileText,
  BarChart,
  Settings,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// --- Mock data for admin dashboard ---
const userStats = [
  { month: "Jan", customers: 42, vendors: 12 },
  { month: "Feb", customers: 58, vendors: 15 },
  { month: "Mar", customers: 75, vendors: 21 },
  { month: "Apr", customers: 92, vendors: 28 },
  { month: "May", customers: 116, vendors: 32 },
  { month: "Jun", customers: 140, vendors: 38 },
];

const revenueData = [
  { month: "Jan", revenue: 13500 },
  { month: "Feb", revenue: 17800 },
  { month: "Mar", revenue: 15200 },
  { month: "Apr", revenue: 21400 },
  { month: "May", revenue: 25800 },
  { month: "Jun", revenue: 31200 },
];

const pendingItems = [
  {
    id: "V-123",
    type: "venue",
    name: "Sunset Beach Resort",
    owner: "Maria Garcia",
    submitted: "2023-07-15",
    status: "pending",
  },
  {
    id: "S-456",
    type: "service",
    name: "Elite Catering Solutions",
    owner: "David Wilson",
    submitted: "2023-07-16",
    status: "pending",
  },
  {
    id: "V-789",
    type: "venue",
    name: "Mountain View Manor",
    owner: "Sarah Johnson",
    submitted: "2023-07-17",
    status: "pending",
  },
];

const AdminDashboard: React.FC = () => {
  return (
    <>
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,856</div>
            <p className="text-xs text-muted-foreground">
              1,452 customers, 404 vendors
            </p>
            <Progress className="mt-2" value={75} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Venues
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              +24 pending approval
            </p>
            <Progress className="mt-2" value={85} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Services
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">158</div>
            <p className="text-xs text-muted-foreground">
              +18 pending approval
            </p>
            <Progress className="mt-2" value={60} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,784</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
            <Progress className="mt-2" value={65} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New users registered over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={userStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="customers" name="Customers" fill="#4f46e5" />
                  <Bar dataKey="vendors" name="Vendors" fill="#0ea5e9" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Platform revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(value) => [`$${value}`, "Revenue"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4f46e5"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Items and System Status */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Items Pending Approval</CardTitle>
            <CardDescription>
              Venues and services waiting for review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.type === "venue" ? "Venue" : "Service"} by{" "}
                      {item.owner}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(item.submitted).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" asChild>
              <a href="/admin/approvals">View All Pending Items</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Overall system health and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">Server Uptime</p>
                  <p className="text-sm font-medium">99.98%</p>
                </div>
                <Progress value={99.98} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">Average Response Time</p>
                  <p className="text-sm font-medium">245ms</p>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">Database Performance</p>
                  <p className="text-sm font-medium">92%</p>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">Daily Active Users</p>
                  <p className="text-sm font-medium">654</p>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center p-3 bg-green-100 rounded-md text-green-800">
                <div className="mr-3">
                  <Badge
                    variant="outline"
                    className="bg-green-200 text-green-800 hover:bg-green-200"
                  >
                    Operational
                  </Badge>
                </div>
                <p className="text-sm">All systems operating normally</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats, Recent Activity, and Issues */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-3 py-1">
                <p className="font-medium">New venue approved</p>
                <p className="text-sm text-muted-foreground">
                  Garden Paradise by Robert Smith
                </p>
                <p className="text-xs text-muted-foreground">10 minutes ago</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-3 py-1">
                <p className="font-medium">Service rejected</p>
                <p className="text-sm text-muted-foreground">
                  Incomplete information provided
                </p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-3 py-1">
                <p className="font-medium">New admin user added</p>
                <p className="text-sm text-muted-foreground">
                  Sarah Johnson joined as moderator
                </p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-3 py-1">
                <p className="font-medium">System maintenance completed</p>
                <p className="text-sm text-muted-foreground">
                  Database optimization
                </p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col"
                asChild
              >
                <a href="/admin/approvals">
                  <FileText className="h-5 w-5 mb-1" />
                  <span>Review Listings</span>
                </a>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col"
                asChild
              >
                <a href="/admin/users">
                  <Users className="h-5 w-5 mb-1" />
                  <span>Manage Users</span>
                </a>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col"
                asChild
              >
                <a href="/admin/reports">
                  <BarChart className="h-5 w-5 mb-1" />
                  <span>View Reports</span>
                </a>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col"
                asChild
              >
                <a href="/admin/settings">
                  <Settings className="h-5 w-5 mb-1" />
                  <span>Site Settings</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-md text-red-800">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">Payment Processing Error</p>
                  <p className="text-sm">3 failed transactions today</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-md text-yellow-800">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">User Reports</p>
                  <p className="text-sm">5 new reports need review</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-2" asChild>
                <a href="/admin/issues">View All Issues</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
