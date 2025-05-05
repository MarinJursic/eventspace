"use client";

import React from "react";
import {
  Calendar,
  DollarSign,
  Users,
  Package,
  Clock,
  TrendingUp,
  Award,
  ArrowRight,
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// --- Mock data for dashboard ---

const earningsData = [
  { month: "Jan", amount: 9200 },
  { month: "Feb", amount: 10800 },
  { month: "Mar", amount: 8700 },
  { month: "Apr", amount: 15400 },
  { month: "May", amount: 12500 },
  { month: "Jun", amount: 16800 },
];

const bookingData = [
  { name: "Wedding", value: 45 },
  { name: "Corporate", value: 25 },
  { name: "Birthday", value: 20 },
  { name: "Other", value: 10 },
];

const COLORS = ["#4f46e5", "#0ea5e9", "#f97316", "#8b5cf6"];

const recentBookings = [
  {
    id: "BK-1234",
    customer: "John Smith",
    venue: "Garden Paradise",
    date: "2023-08-15",
    amount: "$3,500",
    status: "confirmed",
  },
  {
    id: "BK-1235",
    customer: "Emily Johnson",
    venue: "Urban Loft",
    date: "2023-08-18",
    amount: "$2,800",
    status: "pending",
  },
  {
    id: "BK-1236",
    customer: "Michael Brown",
    venue: "Lakeside Retreat",
    date: "2023-08-22",
    amount: "$4,200",
    status: "confirmed",
  },
];

const VendorDashboard: React.FC = () => {
  return (
    <>
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$58,435</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
            <Progress className="mt-2" value={75} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
            <Progress className="mt-2" value={85} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Listings
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              5 venues, 3 services
            </p>
            <Progress className="mt-2" value={60} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,324</div>
            <p className="text-xs text-muted-foreground">+7% from last month</p>
            <Progress className="mt-2" value={65} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Earnings Overview</CardTitle>
            <CardDescription>
              Your revenue for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Revenue"]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Booking Types</CardTitle>
            <CardDescription>
              Distribution of booking categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {bookingData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings & Performance Section */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest booking activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{booking.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.venue}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        booking.status === "confirmed" ? "default" : "outline"
                      }
                    >
                      {booking.status}
                    </Badge>
                    <p className="text-sm font-medium mt-1">{booking.amount}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Bookings <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">Response Rate</p>
                  <p className="text-sm font-medium">95%</p>
                </div>
                <Progress value={95} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">Customer Satisfaction</p>
                  <p className="text-sm font-medium">92%</p>
                </div>
                <Progress value={92} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">Booking Conversion Rate</p>
                  <p className="text-sm font-medium">78%</p>
                </div>
                <Progress value={78} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">Repeat Customer Rate</p>
                  <p className="text-sm font-medium">45%</p>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button variant="outline" className="w-full flex-col h-auto py-4">
                <TrendingUp className="h-6 w-6 mb-1" />
                <span>View Reports</span>
              </Button>
              <Button variant="outline" className="w-full flex-col h-auto py-4">
                <Award className="h-6 w-6 mb-1" />
                <span>Achievements</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks, Quick Stats & Notifications */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-start p-2 bg-secondary rounded-md">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Approve booking #BK-1234</p>
                    <p className="text-sm text-muted-foreground">
                      Due in 2 hours
                    </p>
                  </div>
                </div>
                <Badge>High</Badge>
              </div>

              <div className="flex justify-between items-start p-2 bg-secondary rounded-md">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Update venue photos</p>
                    <p className="text-sm text-muted-foreground">
                      Due tomorrow
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Medium</Badge>
              </div>

              <div className="flex justify-between items-start p-2 bg-secondary rounded-md">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Respond to inquiry #INQ-567</p>
                    <p className="text-sm text-muted-foreground">
                      Due in 4 hours
                    </p>
                  </div>
                </div>
                <Badge>High</Badge>
              </div>
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Tasks <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Top Performing Venue
                </p>
                <p className="text-sm font-medium">Garden Paradise</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Most Booked Service
                </p>
                <p className="text-sm font-medium">Premium Catering</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Average Booking Value
                </p>
                <p className="text-sm font-medium">$3,245</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Busiest Month</p>
                <p className="text-sm font-medium">June</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-sm font-medium">4.8/5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-3 py-1">
                <p className="font-medium">New booking request</p>
                <p className="text-sm text-muted-foreground">
                  From Sarah Miller for Urban Loft
                </p>
                <p className="text-xs text-muted-foreground">10 minutes ago</p>
              </div>

              <div className="border-l-4 border-green-500 pl-3 py-1">
                <p className="font-medium">Payment received</p>
                <p className="text-sm text-muted-foreground">
                  $2,800 for booking #BK-1234
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-3 py-1">
                <p className="font-medium">New review</p>
                <p className="text-sm text-muted-foreground">
                  5-star review for Garden Paradise
                </p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-3 py-1">
                <p className="font-medium">System update</p>
                <p className="text-sm text-muted-foreground">
                  New features available
                </p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Notifications <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VendorDashboard;
