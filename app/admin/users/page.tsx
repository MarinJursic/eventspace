/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Search,
  Edit,
  Trash,
  Shield,
  User,
  UserCog,
  Mail,
  UserPlus,
  Ban,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/useToast";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// --- Mock data for users ---
const mockUsers = [
  {
    id: "U-1001",
    name: "John Smith",
    email: "john@example.com",
    accountType: "customer",
    status: "active",
    joined: "2023-05-12",
    lastLogin: "2023-07-25",
    bookings: 8,
    totalSpent: "$3,450",
  },
  {
    id: "U-1002",
    name: "Maria Garcia",
    email: "maria@example.com",
    accountType: "vendor",
    status: "active",
    joined: "2023-04-18",
    lastLogin: "2023-07-26",
    listings: 3,
    totalEarned: "$12,850",
  },
  {
    id: "U-1003",
    name: "David Wilson",
    email: "david@example.com",
    accountType: "vendor",
    status: "active",
    joined: "2023-03-24",
    lastLogin: "2023-07-24",
    listings: 5,
    totalEarned: "$9,235",
  },
  {
    id: "U-1004",
    name: "Emily Johnson",
    email: "emily@example.com",
    accountType: "customer",
    status: "inactive",
    joined: "2023-05-30",
    lastLogin: "2023-06-15",
    bookings: 2,
    totalSpent: "$1,120",
  },
  {
    id: "U-1005",
    name: "Admin User",
    email: "admin@eventspace.com",
    accountType: "admin",
    status: "active",
    joined: "2023-01-01",
    lastLogin: "2023-07-26",
    role: "Administrator",
  },
];

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    accountType: "customer",
    status: "active",
  });

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || user.accountType === activeTab;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesTab && matchesStatus;
  });

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleBanUser = (user: any) => {
    setSelectedUser(user);
    setIsBanDialogOpen(true);
  };

  const confirmBanUser = () => {
    toast({
      title: selectedUser.status === "active" ? "User Banned" : "User Unbanned",
      description: `${selectedUser.name}'s account has been ${
        selectedUser.status === "active" ? "banned" : "unbanned"
      }.`,
      variant: selectedUser.status === "active" ? "destructive" : "default",
    });
    setIsBanDialogOpen(false);
  };

  const handleSaveUser = () => {
    toast({
      title: "User Updated",
      description: `${selectedUser.name}'s information has been updated.`,
    });
    setIsEditDialogOpen(false);
  };

  const confirmDeleteUser = () => {
    toast({
      title: "User Deleted",
      description: `${selectedUser.name}'s account has been deleted.`,
      variant: "destructive",
    });
    setIsDeleteDialogOpen(false);
  };

  const handleAddUser = () => {
    toast({
      title: "User Added",
      description: `${newUser.name} has been added as a ${newUser.accountType}.`,
    });
    setIsAddUserDialogOpen(false);
    setNewUser({
      name: "",
      email: "",
      accountType: "customer",
      status: "active",
    });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
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

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="customer">Customers</TabsTrigger>
          <TabsTrigger value="vendor">Vendors</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>User List</CardTitle>
              <CardDescription>
                Manage all users on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">
                          User
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Account Type
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Joined
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Last Login
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="capitalize">
                              {user.accountType === "admin" ? (
                                <Shield className="mr-1 h-3 w-3" />
                              ) : user.accountType === "vendor" ? (
                                <UserCog className="mr-1 h-3 w-3" />
                              ) : (
                                <User className="mr-1 h-3 w-3" />
                              )}
                              {user.accountType}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                user.status === "active" ? "default" : "outline"
                              }
                            >
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(user.joined).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <a href={`mailto:${user.email}`}>
                                  <Mail className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleBanUser(user)}
                                className={
                                  user.status === "inactive"
                                    ? "text-yellow-500"
                                    : "text-orange-500"
                                }
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(user)}
                                className="text-destructive"
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
                    No users match your search criteria
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Full Name</Label>
                <Input
                  id="new-name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="Enter user's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="Enter user's email address"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-account-type">Account Type</Label>
              <Select
                value={newUser.accountType}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, accountType: value })
                }
              >
                <SelectTrigger id="new-account-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-status">Status</Label>
              <Select
                value={newUser.status}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, status: value })
                }
              >
                <SelectTrigger id="new-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban User Dialog */}
      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.status === "active" ? "Ban User" : "Unban User"}
            </DialogTitle>
          </DialogHeader>
          <p>
            {selectedUser?.status === "active"
              ? `Are you sure you want to ban ${selectedUser?.name}? They will no longer be able to access the platform.`
              : `Are you sure you want to unban ${selectedUser?.name}? They will regain access to the platform.`}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBanDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmBanUser}
              variant={
                selectedUser?.status === "active" ? "destructive" : "default"
              }
            >
              {selectedUser?.status === "active" ? "Ban User" : "Unban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={selectedUser.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={selectedUser.email} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="account-type">Account Type</Label>
                  <Select defaultValue={selectedUser.accountType}>
                    <SelectTrigger id="account-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={selectedUser.status}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {selectedUser.accountType === "admin" && (
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="approve-venues" defaultChecked />
                      <label
                        htmlFor="approve-venues"
                        className="text-sm font-medium"
                      >
                        Approve Venues
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="approve-services" defaultChecked />
                      <label
                        htmlFor="approve-services"
                        className="text-sm font-medium"
                      >
                        Approve Services
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="manage-users" defaultChecked />
                      <label
                        htmlFor="manage-users"
                        className="text-sm font-medium"
                      >
                        Manage Users
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="view-reports" defaultChecked />
                      <label
                        htmlFor="view-reports"
                        className="text-sm font-medium"
                      >
                        View Reports
                      </label>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="notes">Admin Notes</Label>
                <Input id="notes" placeholder="Add notes about this user" />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}&apos;s
              account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban/Unban User Dialog */}
      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.status === "active" ? "Ban User" : "Unban User"}
            </DialogTitle>
          </DialogHeader>
          <p>
            {selectedUser?.status === "active"
              ? `Are you sure you want to ban ${selectedUser?.name}? They will no longer be able to access the platform.`
              : `Are you sure you want to unban ${selectedUser?.name}? They will regain access to the platform.`}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBanDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmBanUser}
              variant={
                selectedUser?.status === "active" ? "destructive" : "default"
              }
            >
              {selectedUser?.status === "active" ? "Ban User" : "Unban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUsers;
