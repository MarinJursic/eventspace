"use client";

import React, { useState } from "react";
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
import {
  Calendar as CalendarIcon,
  Download,
  Filter,
  DollarSign,
  ArrowUp,
  ArrowDown,
  CreditCard,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Mock Data ---

const monthlyEarnings = [
  { name: "Jan", amount: 4000 },
  { name: "Feb", amount: 5400 },
  { name: "Mar", amount: 6800 },
  { name: "Apr", amount: 8200 },
  { name: "May", amount: 7800 },
  { name: "Jun", amount: 9500 },
  { name: "Jul", amount: 11200 },
  { name: "Aug", amount: 10800 },
  { name: "Sep", amount: 9200 },
  { name: "Oct", amount: 8500 },
  { name: "Nov", amount: 7800 },
  { name: "Dec", amount: 9800 },
];

const earningsBySource = [
  { name: "Venue Rentals", value: 65 },
  { name: "Catering Services", value: 15 },
  { name: "Photography", value: 10 },
  { name: "Other Services", value: 10 },
];

const COLORS = ["#3182CE", "#63B3ED", "#90CDF4", "#BEE3F8"];

const transactions = [
  {
    id: "1",
    date: "2023-07-28",
    description: "Booking #23948",
    amount: 1250,
    status: "completed",
  },
  {
    id: "2",
    date: "2023-07-15",
    description: "Booking #23835",
    amount: 985,
    status: "completed",
  },
  {
    id: "3",
    date: "2023-07-10",
    description: "Service Add-on #4483",
    amount: 350,
    status: "completed",
  },
  {
    id: "4",
    date: "2023-07-05",
    description: "Booking #23781",
    amount: 1450,
    status: "completed",
  },
  {
    id: "5",
    date: "2023-07-01",
    description: "Booking #23720",
    amount: 1100,
    status: "completed",
  },
];

const VendorEarnings: React.FC = () => {
  // For the date filter (using react-day-picker)
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 6, 1),
    to: new Date(2023, 6, 31),
  });

  return (
    <div className="space-y-8">
      {/* Date filter and export controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$95,400.00</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <ArrowUp className="h-4 w-4 mr-1" />
              12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available for Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$7,842.50</div>
            <div className="text-sm text-muted-foreground mt-1">
              Next payout: Aug 1, 2023
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <ArrowUp className="h-4 w-4 mr-1" />
              8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Booking Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$768.50</div>
            <div className="flex items-center text-sm text-red-500 mt-1">
              <ArrowDown className="h-4 w-4 mr-1" />
              2.3% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Earnings</CardTitle>
            <CardDescription>
              Your earnings over the past 12 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyEarnings}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Amount"]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar dataKey="amount" fill="#3182CE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Source</CardTitle>
            <CardDescription>Breakdown of your revenue streams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={earningsBySource}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {earningsBySource.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 flex-wrap justify-center">
                {earningsBySource.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions and Payout section */}
      <Tabs defaultValue="transactions">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payout Settings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="transactions" className="space-y-4">
          <div className="bg-background rounded-md border">
            <div className="p-4 flex items-center justify-between">
              <h3 className="font-medium">Recent Transactions</h3>
              <div className="flex gap-2">
                <Input placeholder="Search transactions..." className="w-64" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                      Description
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t">
                      <td className="px-4 py-3 text-sm">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        ${transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : "outline"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" className="text-sm">
                View All Transactions
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout Methods</CardTitle>
              <CardDescription>
                Manage how you receive your payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-medium">Bank Account (Primary)</h4>
                    <p className="text-sm text-muted-foreground">
                      Chase Bank ••••4589
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
              <Button variant="outline" className="w-full">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payout Schedule</CardTitle>
              <CardDescription>
                Configure when you receive your earnings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Current Schedule</label>
                <Select defaultValue="weekly">
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily (Weekdays)</SelectItem>
                    <SelectItem value="weekly">
                      Weekly (Every Monday)
                    </SelectItem>
                    <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">
                      Monthly (1st of Month)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Minimum Payout Amount
                </label>
                <div className="flex space-x-2">
                  <div className="relative">
                    <DollarSign className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input defaultValue="50" className="pl-8" />
                  </div>
                  <Button type="submit">Save</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Payouts will be processed only when your balance exceeds this
                  amount
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Information</CardTitle>
              <CardDescription>Manage your tax documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md flex items-center justify-between">
                <div>
                  <h4 className="font-medium">W-9 Form</h4>
                  <p className="text-sm text-muted-foreground">
                    Last updated: Jan 15, 2023
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
              <div className="p-4 border rounded-md flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Tax Identification Number</h4>
                  <p className="text-sm text-muted-foreground">••••7890</p>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorEarnings;
