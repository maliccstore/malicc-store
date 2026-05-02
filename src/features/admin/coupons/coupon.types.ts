export enum DiscountType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED = 'FIXED',
}

export interface AdminCoupon {
    id: string;
    code: string;
    discountType: DiscountType;
    discountValue: number;
    maxDiscount?: number;
    minOrderValue?: number;
    usageLimit?: number;
    perUserLimit?: number;
    validFrom: string;
    validUntil: string;
    isActive: boolean;
    usedCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCouponInput {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    maxDiscount?: number;
    minOrderValue?: number;
    usageLimit?: number;
    perUserLimit?: number;
    validFrom: string; // ISO string
    validUntil: string; // ISO string
}

export interface UpdateCouponInput {
    discountValue?: number;
    maxDiscount?: number;
    minOrderValue?: number;
    usageLimit?: number;
    perUserLimit?: number;
    validFrom?: string;
    validUntil?: string;
    isActive?: boolean;
}

export interface CouponTableProps {
    coupons: AdminCoupon[];
    loading: boolean;
    onDisable: (id: string) => void;
}

export type CouponFormValues = {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    maxDiscount?: number | null;
    minOrderValue?: number | null;
    usageLimit?: number | null;
    perUserLimit?: number | null;
    validFrom: string;
    validUntil: string;
    isActive?: boolean;
};

export interface CouponFormProps {
    initialValues?: Partial<CouponFormValues>;
    onSubmit: (data: CouponFormValues) => void;
    isSubmitting: boolean;
    isEditMode?: boolean;
}
