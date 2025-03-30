"use client";

import React, { useState } from "react";
import {
  Star,
  Filter,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Flag,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// --- Mock review data ---
const reviews = [
  {
    id: "1",
    user: {
      name: "Sarah Thompson",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    },
    rating: 5,
    venue: "Garden Paradise",
    date: "2023-07-15",
    content:
      "The venue was absolutely stunning! Everything was perfect for our wedding day. The staff went above and beyond to make sure every detail was taken care of.",
    helpful: 12,
    hasResponse: true,
    response: {
      content:
        "Thank you so much for your kind words, Sarah! It was a pleasure hosting your special day.",
      date: "2023-07-16",
    },
    booking: {
      id: "B24601",
      type: "Wedding",
      date: "2023-06-10",
    },
  },
  {
    id: "2",
    user: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    },
    rating: 4,
    venue: "Urban Studio",
    date: "2023-07-02",
    content:
      "Great space for our corporate event. The audio-visual setup was top-notch and the catering was excellent.",
    helpful: 8,
    hasResponse: true,
    response: {
      content:
        "Thank you for your review, Michael. We appreciate your feedback and are glad your event was a success.",
      date: "2023-07-03",
    },
    booking: {
      id: "B24585",
      type: "Corporate Event",
      date: "2023-06-28",
    },
  },
  {
    id: "3",
    user: {
      name: "Jessica Martinez",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    },
    rating: 5,
    venue: "Mountain Retreat",
    date: "2023-06-20",
    content:
      "What an amazing venue for our family reunion! The mountain views were breathtaking.",
    helpful: 15,
    hasResponse: false,
    booking: {
      id: "B24498",
      type: "Family Reunion",
      date: "2023-06-17",
    },
  },
  {
    id: "4",
    user: {
      name: "David Wilson",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    },
    rating: 3,
    venue: "Sunset Terrace",
    date: "2023-06-18",
    content:
      "The venue itself is beautiful, and the sunset views were spectacular as promised.",
    helpful: 6,
    hasResponse: false,
    booking: {
      id: "B24432",
      type: "Birthday Party",
      date: "2023-06-16",
    },
  },
];

const ratingCounts = {
  5: 112,
  4: 32,
  3: 8,
  2: 3,
  1: 1,
};

const totalReviews = Object.values(ratingCounts).reduce((a, b) => a + b, 0);

const VendorReviews: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [responseText, setResponseText] = useState<string>("");
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  const handleStartResponse = (reviewId: string) => {
    setRespondingTo(reviewId);
    setResponseText("");
  };

  const handleCancelResponse = () => {
    setRespondingTo(null);
    setResponseText("");
  };

  const handleSubmitResponse = (reviewId: string) => {
    // In a real app, send response to backend
    console.log(`Responding to review ${reviewId}: ${responseText}`);
    setRespondingTo(null);
    setResponseText("");
  };

  const calculateAverageRating = () => {
    let totalScore = 0;
    for (const [rating, count] of Object.entries(ratingCounts)) {
      totalScore += Number(rating) * count;
    }
    return (totalScore / totalReviews).toFixed(1);
  };

  const getResponseRate = () => {
    const reviewsWithResponses = reviews.filter(
      (review) => review.hasResponse
    ).length;
    return ((reviewsWithResponses / reviews.length) * 100).toFixed(0);
  };

  const getFilteredReviews = () => {
    switch (activeTab) {
      case "unanswered":
        return reviews.filter((review) => !review.hasResponse);
      case "answered":
        return reviews.filter((review) => review.hasResponse);
      case "five-stars":
        return reviews.filter((review) => review.rating === 5);
      case "critical":
        return reviews.filter((review) => review.rating <= 3);
      default:
        return reviews;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-2">
                {calculateAverageRating()}
              </span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(parseFloat(calculateAverageRating()))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              From {totalReviews} reviews
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Response Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getResponseRate()}%</div>
            <div className="text-sm text-muted-foreground mt-1">
              Avg response time: 18 hours
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unanswered Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.filter((r) => !r.hasResponse).length}
            </div>
            <Button
              variant="link"
              className="text-sm p-0 h-auto mt-1"
              onClick={() => setActiveTab("unanswered")}
            >
              View unanswered reviews
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.filter((r) => r.rating <= 3).length}
            </div>
            <Button
              variant="link"
              className="text-sm p-0 h-auto mt-1 text-amber-600"
              onClick={() => setActiveTab("critical")}
            >
              Needs attention
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Rating Breakdown and Reviews */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Rating Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm w-12">{rating} star</span>
                    <Progress
                      value={
                        (ratingCounts[rating as keyof typeof ratingCounts] /
                          totalReviews) *
                        100
                      }
                      className="h-2 w-32 ml-2"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {ratingCounts[rating as keyof typeof ratingCounts]} (
                    {Math.round(
                      (ratingCounts[rating as keyof typeof ratingCounts] /
                        totalReviews) *
                        100
                    )}
                    %)
                  </span>
                </div>
              </div>
            ))}

            <Separator className="my-4" />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Review Sources</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Direct Bookings</span>
                  <span>78%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>External Sites</span>
                  <span>22%</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-2">
              View All Analytics
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Reviews</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                  <TabsTrigger value="answered">Answered</TabsTrigger>
                  <TabsTrigger value="five-stars">5 Stars</TabsTrigger>
                  <TabsTrigger value="critical">Critical</TabsTrigger>
                </TabsList>

                <div className="flex space-x-2">
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="highest">Highest Rated</SelectItem>
                      <SelectItem value="lowest">Lowest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value={activeTab} className="mt-4 space-y-4">
                {getFilteredReviews().length > 0 ? (
                  getFilteredReviews().map((review) => (
                    <Card key={review.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <Avatar>
                                <AvatarImage
                                  src={review.user.avatar}
                                  alt={review.user.name}
                                />
                                <AvatarFallback>
                                  {review.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">
                                  {review.user.name}
                                </h4>
                                <div className="flex items-center mt-1">
                                  <div className="flex mr-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(review.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                {review.venue}
                              </Badge>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <p>{review.content}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground text-xs h-7"
                              >
                                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                                {review.helpful} Found helpful
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground text-xs h-7"
                              >
                                <Flag className="h-3.5 w-3.5 mr-1" />
                                Report
                              </Button>
                            </div>
                          </div>

                          {review.hasResponse && review.response && (
                            <div className="bg-muted/30 p-3 rounded-md mt-2">
                              <div className="flex justify-between items-start">
                                <h5 className="text-sm font-medium">
                                  Your Response
                                </h5>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    review.response.date
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <p className="text-sm mt-1">
                                {review.response.content}
                              </p>
                            </div>
                          )}

                          {!review.hasResponse &&
                            respondingTo !== review.id && (
                              <div className="mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStartResponse(review.id)}
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Respond to Review
                                </Button>
                              </div>
                            )}

                          {respondingTo === review.id && (
                            <div className="mt-2 space-y-2">
                              <Textarea
                                className="w-full min-h-24 p-2 text-sm"
                                placeholder="Write your response here..."
                                value={responseText}
                                onChange={(e) =>
                                  setResponseText(e.target.value)
                                }
                              />
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleCancelResponse}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleSubmitResponse(review.id)
                                  }
                                  disabled={!responseText.trim()}
                                >
                                  Submit Response
                                </Button>
                              </div>
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                            Booking #{review.booking.id} • {review.booking.type}{" "}
                            •{" "}
                            {new Date(review.booking.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No reviews match the selected filter
                    </p>
                  </div>
                )}

                <div className="flex justify-center mt-4">
                  <Button variant="outline">
                    Load More Reviews
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorReviews;
