import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MockService } from '@/lib/mockServices';
import { MockReview } from '@/lib/mockReviews';
import { Star, Check } from 'lucide-react'; // Import necessary icons

// --- Define Tab Content Components ---

interface ServiceAboutTabProps {
    description?: string;
}
const ServiceAboutTab: React.FC<ServiceAboutTabProps> = ({ description }) => (
    <TabsContent value="about">
        <h3 className="font-semibold text-lg mb-2">Description</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">
            {description || "No description available."}
        </p>
    </TabsContent>
);

interface ServiceFeaturesTabProps {
    features: string[];
}
const ServiceFeaturesTab: React.FC<ServiceFeaturesTabProps> = ({ features }) => (
    <TabsContent value="features">
        <h3 className="font-semibold text-lg mb-3">What's Included</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((featureName, index) => (
                <div key={index} className="flex items-start p-3 bg-secondary/30 rounded-lg border">
                    <Check className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{featureName}</span>
                </div>
            ))}
        </div>
    </TabsContent>
);

interface ServiceReviewsTabProps {
    reviews: MockReview[];
    rating: MockService['rating'];
}
const ServiceReviewsTab: React.FC<ServiceReviewsTabProps> = ({ reviews, rating }) => (
    <TabsContent value="reviews">
        <div className="flex items-center mb-4 gap-4">
            <div className="bg-amber-100/60 border border-amber-300/50 text-amber-900 px-3 py-2 rounded-lg flex items-center">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500 mr-2" />
                <span className="font-semibold text-xl">{rating.average.toFixed(1)}</span>
            </div>
            <div>
                <p className="font-medium">Based on {rating.count} reviews</p>
            </div>
        </div>
        <div className="space-y-4">
            {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border border-border rounded-lg p-4 bg-background">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            {/* We don't have user name, use ID or placeholder */}
                            <p className="font-medium text-sm">User ID: ...{review.user.slice(-6)}</p>
                            <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center bg-amber-100/60 px-1.5 py-0.5 rounded-full border border-amber-300/50">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                            <span className="text-xs font-medium text-amber-900">{review.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment || "No comment provided."}</p>
                </div>
            ))}
        </div>
        {rating.count > reviews.slice(0, 3).length && (
            <Button variant="outline" className="w-full mt-6" disabled>
                View All {rating.count} Reviews (Display Limited)
            </Button>
        )}
    </TabsContent>
);

interface ServicePoliciesTabProps {
    policies?: MockService['policies'];
}
const ServicePoliciesTab: React.FC<ServicePoliciesTabProps> = ({ policies }) => (
    <TabsContent value="policies">
        <h3 className="font-semibold text-lg mb-3">Service Policies</h3>
        <div className="space-y-4">
            {policies?.listOfPolicies.map((policy, index) => (
                <div key={index}>
                    <h4 className="font-medium mb-1 text-sm">{policy.name}</h4>
                    <p className="text-sm text-muted-foreground">{policy.description}</p>
                    {index < (policies?.listOfPolicies.length ?? 0) - 1 && <Separator className="my-4" />}
                </div>
            ))}
        </div>
    </TabsContent>
);

// --- Main Tabs Component ---
interface ServiceTabsProps {
    service: MockService;
    reviews: MockReview[];
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ service, reviews }) => {
    const hasFeatures = service.features && service.features.length > 0;
    const hasReviews = reviews.length > 0;
    const hasPolicies = service.policies?.listOfPolicies && service.policies.listOfPolicies.length > 0;
    const tabCount = 1 + (hasFeatures ? 1 : 0) + (hasReviews ? 1 : 0) + (hasPolicies ? 1 : 0);

    return (
        <Tabs defaultValue="about" className="w-full">
            <TabsList className={`grid w-full grid-cols-${tabCount > 4 ? 4 : tabCount} mb-6 bg-muted/50 rounded-lg p-1 h-auto`}>
                <TabsTrigger value="about">About</TabsTrigger>
                {hasFeatures && <TabsTrigger value="features">Features</TabsTrigger>}
                {hasReviews && <TabsTrigger value="reviews">Reviews</TabsTrigger>}
                {hasPolicies && <TabsTrigger value="policies">Policies</TabsTrigger>}
            </TabsList>

            <ServiceAboutTab description={service.description} />
            {hasFeatures && <ServiceFeaturesTab features={service.features} />}
            {hasReviews && <ServiceReviewsTab reviews={reviews} rating={service.rating} />}
            {hasPolicies && <ServicePoliciesTab policies={service.policies} />}
        </Tabs>
    );
};

export default ServiceTabs;