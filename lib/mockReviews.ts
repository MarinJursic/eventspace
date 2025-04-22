// src/lib/mockReviews.ts
import { v4 as uuidv4 } from 'uuid';

// Interface provided by the user
export interface MockReview {
  id: string;
  user: string; // Mocked as string UUID
  rating: number;
  comment?: string;
  target: string; // Venue or Service ID
  targetModel: 'Venue' | 'Service';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Placeholder Service IDs (Replace with actual IDs from mockServices.ts if known)
// Ideally, you would import mockServices and get the actual IDs, but to keep
// this file independent as requested, we use placeholders.
// Ensure these placeholders match the target IDs used below.
const FLORIST_SERVICE_ID = "florist-service-id-placeholder";
const PHOTO_SERVICE_ID = "photo-service-id-placeholder";
const CATER_SERVICE_ID = "cater-service-id-placeholder";
const DJ_SERVICE_ID = "dj-service-id-placeholder";

export const reviews: MockReview[] = [
  // --- Specific Service Reviews from previous example (adapted to new schema) ---

  // Florist Reviews
  {
    id: "review_florist_1", // Keep original ID if desired, or use uuidv4()
    user: uuidv4(), // Mock User ID
    rating: 5,
    comment: "Absolutely stunning flowers! They completely understood my vision and exceeded expectations. So easy to work with.",
    target: FLORIST_SERVICE_ID,
    targetModel: 'Service',
    isDeleted: false,
    createdAt: new Date("2024-05-15"), // Use original date
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: "review_florist_2",
    user: uuidv4(),
    rating: 5,
    comment: "The centerpieces were breathtaking. Highly recommend Ethereal Blooms!",
    target: FLORIST_SERVICE_ID,
    targetModel: 'Service',
    isDeleted: false,
    createdAt: new Date("2024-04-28"),
    updatedAt: new Date("2024-04-28"),
  },
  {
    id: "review_florist_3",
    user: uuidv4(),
    rating: 4.5,
    comment: "Beautiful arrangements, though communication was a bit slow at times. Overall very happy with the result.",
    target: FLORIST_SERVICE_ID,
    targetModel: 'Service',
    isDeleted: false,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },

  // Photography Reviews
  {
    id: "review_photo_1",
    user: uuidv4(),
    rating: 5,
    comment: "Incredible photos! They captured so many moments we missed. Very professional and discreet.",
    target: PHOTO_SERVICE_ID,
    targetModel: 'Service',
    isDeleted: false,
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: "review_photo_2",
    user: uuidv4(),
    rating: 4.5,
    comment: "Great candid shots, exactly what we wanted. The final gallery took a little longer than expected, but the quality was worth it.",
    target: PHOTO_SERVICE_ID,
    targetModel: 'Service',
    isDeleted: false,
    createdAt: new Date("2024-05-12"),
    updatedAt: new Date("2024-05-12"),
  },

  // Catering Reviews
  {
    id: "review_cater_1",
    user: uuidv4(),
    rating: 5,
    comment: "The food was absolutely delicious and the presentation was stunning! Our guests couldn't stop raving about it. Service was impeccable too.",
    target: CATER_SERVICE_ID,
    targetModel: 'Service',
    isDeleted: false,
    createdAt: new Date("2024-07-05"),
    updatedAt: new Date("2024-07-05"),
  },
    // Add cater review 2 if needed
  // {
  //   id: "review_cater_2", // Assuming an ID
  //   user: uuidv4(),
  //   rating: 4,
  //   comment: "Good food and reliable service for our corporate event. Menu planning was easy. A bit pricey but worth it for the quality.",
  //   target: CATER_SERVICE_ID,
  //   targetModel: 'Service',
  //   isDeleted: false,
  //   createdAt: new Date("2024-06-18"),
  //   updatedAt: new Date("2024-06-18"),
  // },


  // DJ Reviews
  {
    id: "review_dj_1",
    user: uuidv4(),
    rating: 5,
    comment: "Fantastic DJ! Kept the dance floor packed all night. Great music selection and seamless transitions.",
    target: DJ_SERVICE_ID,
    targetModel: 'Service',
    isDeleted: false,
    createdAt: new Date("2024-07-10"),
    updatedAt: new Date("2024-07-10"),
  },
  {
    id: "review_dj_2",
    user: uuidv4(),
    rating: 5,
    comment: "So professional and easy to work with. Understood exactly the vibe we wanted for our wedding.",
    target: DJ_SERVICE_ID,
    targetModel: 'Service',
    isDeleted: false,
    createdAt: new Date("2024-06-22"),
    updatedAt: new Date("2024-06-22"),
  },
  {
    id: "review_dj_3",
    user: uuidv4(),
    rating: 4.5,
    comment: "Good music, kept the energy up. MCing was a little basic but did the job.",
    target: DJ_SERVICE_ID,
    targetModel: 'Service',
    isDeleted: false,
    createdAt: new Date("2024-05-01"),
    updatedAt: new Date("2024-05-01"),
  },
  {
    id: "review_dj_4",
    user: uuidv4(),
    rating: 5,
    comment: "Highly recommend! They made our party unforgettable.",
    target: DJ_SERVICE_ID,
    targetModel: 'Service',
    isDeleted: false,
    createdAt: new Date("2024-04-15"),
    updatedAt: new Date("2024-04-15"),
  },

  // --- Generic Reviews provided by user (Venue/Service) ---
  {
    id: uuidv4(),
    user: uuidv4(),
    rating: 5,
    comment: "Absolutely loved this venue! The ambiance was perfect.",
    target: uuidv4(), // Random target venue ID
    targetModel: 'Venue',
    isDeleted: false,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: uuidv4(),
    user: uuidv4(),
    rating: 4,
    comment: "Great service, but the parking situation could be better.",
    target: uuidv4(), // Random target service ID
    targetModel: 'Service',
    isDeleted: false,
    createdAt: new Date('2025-02-15'),
    updatedAt: new Date('2025-02-15'),
  },
  {
    id: uuidv4(),
    user: uuidv4(),
    rating: 3,
    comment: "Decent place, but it was a bit noisy for our event.",
    target: uuidv4(), // Random target venue ID
    targetModel: 'Venue',
    isDeleted: false,
    createdAt: new Date('2025-03-05'),
    updatedAt: new Date('2025-03-05'),
  },
  {
    id: uuidv4(),
    user: uuidv4(),
    rating: 5,
    comment: "Fantastic staff! They made sure everything ran smoothly.",
    target: uuidv4(), // Random target service ID
    targetModel: 'Service',
    isDeleted: false,
    createdAt: new Date('2025-04-20'),
    updatedAt: new Date('2025-04-20'),
  },
  {
    id: uuidv4(),
    user: uuidv4(),
    rating: 2,
    comment: "Not what I expected. The pictures looked better than reality.",
    target: uuidv4(), // Random target venue ID
    targetModel: 'Venue',
    isDeleted: false,
    createdAt: new Date('2025-05-10'),
    updatedAt: new Date('2025-05-10'),
  },
  // ... (keep the rest of the generic reviews you provided) ...
   {
    id: uuidv4(),
    user: uuidv4(),
    rating: 2,
    comment: "Not what I expected. The pictures looked better than reality.",
    target: uuidv4(),
    targetModel: 'Venue',
    isDeleted: false,
    createdAt: new Date('2025-05-10'),
    updatedAt: new Date('2025-05-10'),
  },
  {
    id: uuidv4(),
    user: uuidv4(),
    rating: 2,
    comment: "Not what I expected. The pictures looked better than reality.",
    target: uuidv4(),
    targetModel: 'Venue',
    isDeleted: false,
    createdAt: new Date('2025-05-10'),
    updatedAt: new Date('2025-05-10'),
  },
  {
    id: uuidv4(),
    user: uuidv4(),
    rating: 2,
    comment: "Not what I expected. The pictures looked better than reality.",
    target: uuidv4(),
    targetModel: 'Venue',
    isDeleted: false,
    createdAt: new Date('2025-05-10'),
    updatedAt: new Date('2025-05-10'),
  },
   // Add more generic reviews if needed...

];

// --- Helper Function ---

/**
 * Finds all non-deleted reviews for a specific target (Venue or Service).
 * @param targetId The ID of the Venue or Service.
 * @param targetModel The type of target ('Venue' or 'Service').
 * @returns An array of matching MockReview objects.
 */
export const findReviewsByTargetId = (targetId: string | undefined, targetModel: 'Venue' | 'Service'): MockReview[] => {
    if (!targetId) return [];

    return reviews.filter(review =>
        review.target === targetId &&
        review.targetModel === targetModel &&
        !review.isDeleted
    );
};

// Optional Helper: Find reviews by multiple Service IDs (if needed)
// This replaces the previous findReviewsByIds, specifically for services
export const findServiceReviewsByServiceIds = (serviceIds: string[]): MockReview[] => {
    if (!serviceIds || serviceIds.length === 0) return [];
    const idSet = new Set(serviceIds);
    return reviews.filter(review =>
        review.targetModel === 'Service' &&
        idSet.has(review.target) && // Check if the review's target is in the set of service IDs
        !review.isDeleted
    );
};