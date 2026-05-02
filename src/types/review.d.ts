export interface Review {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    reviewText?: string;
    status: string;
    createdAt: string;
}

export interface ProductRatingSummary {
    averageRating?: number;
    totalReviews: number;
}

export interface CreateReviewInput {
    productId: string;
    orderId: string;
    rating: number;
    reviewText?: string;
}

export interface UpdateReviewInput {
    rating?: number;
    reviewText?: string;
}
