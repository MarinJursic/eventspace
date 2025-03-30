"use client";

import React, { useState } from "react";
import {
  Search,
  Send,
  Paperclip,
  MoreHorizontal,
  User,
  Calendar,
  Info,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

// --- Mock data for conversations ---
const conversations = [
  {
    id: "1",
    user: {
      name: "James Wilson",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
      email: "james.wilson@example.com",
      phone: "(555) 123-7890",
    },
    lastMessage:
      "Hi, I'm interested in booking your venue for my wedding next summer.",
    lastMessageTime: "2023-07-28T14:30:00",
    unread: true,
    booking: {
      id: "23948",
      venue: "Garden Paradise",
      date: "2024-06-15",
      status: "inquiry",
    },
  },
  {
    id: "2",
    user: {
      name: "Sophia Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      email: "sophia.r@example.com",
      phone: "(555) 987-6543",
    },
    lastMessage:
      "I have a question about the catering options for my corporate event.",
    lastMessageTime: "2023-07-27T09:15:00",
    unread: false,
    booking: {
      id: "23835",
      venue: "Urban Studio",
      date: "2023-09-22",
      status: "confirmed",
    },
  },
  {
    id: "3",
    user: {
      name: "Alex Johnson",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
      email: "alex.j@example.com",
      phone: "(555) 234-5678",
    },
    lastMessage: "Can I get a quote for additional decorations for my event?",
    lastMessageTime: "2023-07-26T16:45:00",
    unread: false,
    booking: {
      id: "23781",
      venue: "Mountain Retreat",
      date: "2023-10-05",
      status: "confirmed",
    },
  },
  {
    id: "4",
    user: {
      name: "Emma Davis",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80",
      email: "emma.d@example.com",
      phone: "(555) 345-6789",
    },
    lastMessage:
      "I'd like to reschedule our appointment to discuss the wedding details.",
    lastMessageTime: "2023-07-25T11:20:00",
    unread: false,
    booking: {
      id: "23720",
      venue: "Sunset Terrace",
      date: "2023-11-12",
      status: "confirmed",
    },
  },
];

// --- Mock message thread ---
const messageThread = [
  {
    id: "m1",
    sender: "user",
    content:
      "Hi, I'm interested in booking your venue for my wedding next summer. Do you have availability on June 15th, 2024?",
    timestamp: "2023-07-28T14:30:00",
  },
  {
    id: "m2",
    sender: "vendor",
    content:
      "Hello James! Thank you for your interest in our venue. I'm checking our calendar for June 15th, 2024. Could you let me know approximately how many guests you're expecting?",
    timestamp: "2023-07-28T14:35:00",
  },
  {
    id: "m3",
    sender: "user",
    content:
      "We're planning for about 120 guests. We're also interested in your catering services if those are available.",
    timestamp: "2023-07-28T14:40:00",
  },
  {
    id: "m4",
    sender: "vendor",
    content:
      "Great! I'm happy to confirm that June 15th, 2024 is available. We can definitely accommodate 120 guests and provide catering services. Would you like me to send over our wedding packages and catering menu options?",
    timestamp: "2023-07-28T14:45:00",
  },
  {
    id: "m5",
    sender: "user",
    content:
      "That would be perfect. Could you also include information about any additional services you offer, like decorations or photography?",
    timestamp: "2023-07-28T14:50:00",
  },
];

const VendorMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  );
  const [messageInput, setMessageInput] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return isToday
      ? date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    // In a real app, you'd send the message to your backend here
    setMessageInput("");
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] border rounded-lg overflow-hidden">
      {/* Conversation List */}
      <div className="w-80 border-r flex flex-col bg-muted/10">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8" />
          </div>
        </div>
        <Tabs defaultValue="all">
          <div className="px-3 pt-3">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="flex-1">
                Inquiries
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[calc(100vh-15rem)]">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 cursor-pointer hover:bg-muted/50 border-b transition-colors ${
                    selectedConversation.id === conversation.id
                      ? "bg-muted/50"
                      : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage
                        src={conversation.user.avatar}
                        alt={conversation.user.name}
                      />
                      <AvatarFallback>
                        {conversation.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">
                          {conversation.user.name}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            conversation.booking.status === "inquiry"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {conversation.booking.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground truncate">
                          {conversation.booking.venue}
                        </span>
                      </div>
                    </div>
                    {conversation.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-[calc(100vh-15rem)]">
              {conversations
                .filter((c) => c.unread)
                .map((conversation) => (
                  <div
                    key={conversation.id}
                    className="p-3 cursor-pointer hover:bg-muted/50 border-b"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage
                          src={conversation.user.avatar}
                          alt={conversation.user.name}
                        />
                        <AvatarFallback>
                          {conversation.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">
                            {conversation.user.name}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              conversation.booking.status === "inquiry"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {conversation.booking.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground truncate">
                            {conversation.booking.venue}
                          </span>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    </div>
                  </div>
                ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="inquiries" className="m-0">
            <ScrollArea className="h-[calc(100vh-15rem)]">
              {conversations
                .filter((c) => c.booking.status === "inquiry")
                .map((conversation) => (
                  <div
                    key={conversation.id}
                    className="p-3 cursor-pointer hover:bg-muted/50 border-b"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage
                          src={conversation.user.avatar}
                          alt={conversation.user.name}
                        />
                        <AvatarFallback>
                          {conversation.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">
                            {conversation.user.name}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {conversation.booking.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground truncate">
                            {conversation.booking.venue}
                          </span>
                        </div>
                      </div>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={selectedConversation.user.avatar}
                    alt={selectedConversation.user.name}
                  />
                  <AvatarFallback>
                    {selectedConversation.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    {selectedConversation.user.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        selectedConversation.booking.status === "inquiry"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {selectedConversation.booking.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground truncate">
                      Booking #{selectedConversation.booking.id}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messageThread.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "vendor"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === "vendor"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 block text-right mt-1">
                        {new Date(message.timestamp).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-3 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">
                Select a conversation to view messages
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Customer Info Sidebar */}
      <div className="w-72 border-l bg-muted/10 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-medium">Customer Info</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={selectedConversation?.user.avatar}
                  alt={selectedConversation?.user.name}
                />
                <AvatarFallback>
                  {selectedConversation?.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-medium mt-2">
                {selectedConversation?.user.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Customer since July 2023
              </p>
            </div>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="text-muted-foreground">Email</p>
                    <p>{selectedConversation?.user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="text-muted-foreground">Phone</p>
                    <p>{selectedConversation?.user.phone}</p>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Booking Details</h4>
              <Card>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">Event Date</p>
                      <p>
                        {new Date(
                          selectedConversation?.booking.date
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">Booking ID</p>
                      <p>#{selectedConversation?.booking.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  View Booking
                </Button>
                <Button variant="outline" size="sm">
                  Send Quote
                </Button>
                <Button variant="outline" size="sm">
                  Add Note
                </Button>
                <Button variant="outline" size="sm">
                  Mark as Read
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default VendorMessages;
