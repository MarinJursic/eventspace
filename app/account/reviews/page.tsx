"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  MessageSquare,
  Star,
  CheckCircle,
  Edit,
  Trash,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useSession } from "next-auth/react";
import Image from "next/image";

// --- Define the valid types for reviews ---
type ItemType = "venue" | "service";

// --- Mock data for reviews ---
const mockReviews = [
  {
    id: "r1",
    type: "venue" as ItemType,
    itemId: "v1",
    itemName: "Crystal Ballroom",
    itemImage:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1548&q=80",
    rating: 5,
    content:
      "Absolutely stunning venue! The staff was incredibly helpful throughout the entire process. The ballroom itself is breathtaking with amazing lighting and sound systems. Would definitely recommend for any wedding or special event.",
    date: "2023-07-15",
  },
  {
    id: "r2",
    type: "service" as ItemType,
    itemId: "s1",
    itemName: "Premium Catering",
    itemImage:
      "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    rating: 4,
    content:
      "The food was delicious and beautifully presented. Service was prompt and professional. The only small issue was that they ran out of one of the appetizers before everyone got to try it. Overall, still a great experience.",
    date: "2023-06-22",
  },
];

// --- Mock pending reviews ---
const mockPendingReviews = [
  {
    id: "p1",
    type: "venue" as ItemType,
    itemId: "v2",
    itemName: "Urban Loft Studio",
    itemImage:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
    eventDate: "2023-06-15",
  },
  {
    id: "p2",
    type: "service" as ItemType,
    itemId: "s2",
    itemName: "Photography Package",
    itemImage:
      "https://images.unsplash.com/photo-1581699493864-468d40662e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    eventDate: "2023-06-15",
  },
];

const Reviews: React.FC = () => {
  const router = useRouter();
  const { id } = useParams() as { id?: string };
  const { toast } = useToast();
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(mockReviews);
  const [pendingReviews, setPendingReviews] = useState(mockPendingReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("submitted");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [review, setReview] = useState<{
    id: string;
    itemId: string;
    itemName: string;
    itemImage: string;
    rating: number;
    content: string;
    type: ItemType;
  } | null>(null);

  // Handle review/:id route (pending review) if id exists
  useEffect(() => {
    if (id) {
      const pendingReview = pendingReviews.find((r) => r.itemId === id);
      if (pendingReview) {
        setReview({
          id: pendingReview.id,
          itemId: pendingReview.itemId,
          itemName: pendingReview.itemName,
          itemImage: pendingReview.itemImage,
          rating: 0,
          content: "",
          type: pendingReview.type,
        });
        setReviewDialogOpen(true);
      } else {
        toast({
          title: "Review not found",
          description: "The requested review could not be found",
          variant: "destructive",
        });
        router.push("/account/reviews");
      }
    }
  }, [id, pendingReviews, router, toast]);

  // Protection against unauthenticated access
  if (!session?.user) {
    router.push("/");
    toast({
      title: "Authentication required",
      description: "Please log in to view your reviews",
      variant: "destructive",
    });
    return null;
  }

  const handleStartReview = (pendingReview: (typeof pendingReviews)[0]) => {
    setReview({
      id: pendingReview.id,
      itemId: pendingReview.itemId,
      itemName: pendingReview.itemName,
      itemImage: pendingReview.itemImage,
      rating: 0,
      content: "",
      type: pendingReview.type,
    });
    setReviewDialogOpen(true);
  };

  const handleEditReview = (existingReview: (typeof reviews)[0]) => {
    setReview({
      id: existingReview.id,
      itemId: existingReview.itemId,
      itemName: existingReview.itemName,
      itemImage: existingReview.itemImage,
      rating: existingReview.rating,
      content: existingReview.content,
      type: existingReview.type,
    });
    setReviewDialogOpen(true);
  };

  const handleCancelReview = () => {
    setReview(null);
    setReviewDialogOpen(false);
  };

  const handleRatingChange = (newRating: number) => {
    if (review) {
      setReview({ ...review, rating: newRating });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (review) {
      setReview({ ...review, content: e.target.value });
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter((r) => r.id !== reviewId));
      toast({
        title: "Review deleted",
        description: "Your review has been successfully deleted",
      });
    }
  };

  const handleSubmitReview = () => {
    if (!review) return;

    if (review.rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    if (review.content.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please provide a more detailed review",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      const existingReviewIndex = reviews.findIndex((r) => r.id === review.id);
      const newReview = {
        ...review,
        date: new Date().toISOString().split("T")[0],
      };

      if (existingReviewIndex >= 0) {
        // Update existing review
        const updatedReviews = [...reviews];
        updatedReviews[existingReviewIndex] = newReview;
        setReviews(updatedReviews);
        toast({
          title: "Review updated",
          description: "Your review has been successfully updated",
        });
      } else {
        // Add new review and remove from pending
        setReviews([...reviews, newReview]);
        setPendingReviews(pendingReviews.filter((r) => r.id !== review.id));
        toast({
          title: "Review submitted",
          description: "Your review has been successfully submitted",
        });
      }

      setIsSubmitting(false);
      setReview(null);
      setReviewDialogOpen(false);
      if (id) {
        router.push("/account/reviews");
      }
    }, 1000);
  };

  return (
    <>
      <AnimatedSection animation="fade-in">
        <Tabs
          defaultValue="submitted"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="submitted" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Submitted ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pending ({pendingReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submitted" className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <SubmittedReviewCard
                  key={review.id}
                  review={review}
                  onEdit={() => handleEditReview(review)}
                  onDelete={() => handleDeleteReview(review.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t submitted any reviews yet
                </p>
                {pendingReviews.length > 0 && (
                  <Button onClick={() => setActiveTab("pending")}>
                    Write a Review
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {pendingReviews.length > 0 ? (
              pendingReviews.map((pendingReview) => (
                <PendingReviewCard
                  key={pendingReview.id}
                  pendingReview={pendingReview}
                  onStartReview={() => handleStartReview(pendingReview)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No pending reviews</h3>
                <p className="text-muted-foreground">
                  You don&apos;t have any pending reviews at the moment
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </AnimatedSection>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {review && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {reviews.some((r) => r.id === review.id)
                    ? `Edit Your Review for ${review.itemName}`
                    : `Write a Review for ${review.itemName}`}
                </DialogTitle>
                <DialogDescription>
                  Share your experience to help others make better decisions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 md:h-20 md:w-20">
                    <Image
                      src={review.itemImage}
                      alt={review.itemName}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium">{review.itemName}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {review.type}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Your Rating</h4>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleRatingChange(i + 1)}
                        className="text-2xl focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Your Review</h4>
                  <Textarea
                    placeholder="Share your experience with this venue or service..."
                    className="min-h-[150px]"
                    value={review.content}
                    onChange={handleContentChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    {review.content.length < 10
                      ? `Please write at least ${
                          10 - review.content.length
                        } more characters`
                      : `${review.content.length} characters`}
                  </p>
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancelReview}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={
                    isSubmitting ||
                    review.rating === 0 ||
                    review.content.trim().length < 10
                  }
                >
                  {isSubmitting
                    ? "Submitting..."
                    : reviews.some((r) => r.id === review.id)
                      ? "Update Review"
                      : "Submit Review"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

interface SubmittedReviewCardProps {
  review: (typeof mockReviews)[0];
  onEdit: () => void;
  onDelete: () => void;
}

const SubmittedReviewCard: React.FC<SubmittedReviewCardProps> = ({
  review,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-start space-x-4">
            <div className="relative h-16 w-16 md:h-20 md:w-20">
              <Image
                src={review.itemImage}
                alt={review.itemName}
                fill
                className="h-16 w-16 md:h-20 md:w-20 rounded-md object-cover"
                objectFit="cover"
              />
            </div>

            <div>
              <h3 className="font-medium">{review.itemName}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {review.type}
              </p>
              <div className="flex mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Reviewed on {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-sm">{review.content}</p>
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
                onClick={onEdit}
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface PendingReviewCardProps {
  pendingReview: (typeof mockPendingReviews)[0];
  onStartReview: () => void;
}

const PendingReviewCard: React.FC<PendingReviewCardProps> = ({
  pendingReview,
  onStartReview,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative h-16 w-16 md:h-20 md:w-20">
            <Image
              fill
              src={pendingReview.itemImage}
              alt={pendingReview.itemName}
              className="h-16 w-16 md:h-20 md:w-20 rounded-md object-cover"
              objectFit="cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="font-medium">{pendingReview.itemName}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {pendingReview.type}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Used on {new Date(pendingReview.eventDate).toLocaleDateString()}
            </p>
          </div>
          <Button onClick={onStartReview}>Write Review</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reviews;
