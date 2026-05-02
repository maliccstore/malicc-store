import apiClient from '@/services/apiClient';
import { AdminCoupon, CreateCouponInput, UpdateCouponInput } from '@/features/admin/coupons/coupon.types';

export const adminCouponAPI = {
    getAll: async (filters?: { isActive?: boolean; limit?: number; offset?: number }) => {
        const query = `
            query ListCoupons($isActive: Boolean, $limit: Float, $offset: Float) {
                listCoupons(isActive: $isActive, limit: $limit, offset: $offset) {
                    success
                    message
                    totalCount
                    coupons {
                        id
                        code
                        discountType
                        discountValue
                        maxDiscount
                        minOrderValue
                        usageLimit
                        perUserLimit
                        validFrom
                        validUntil
                        isActive
                        usedCount
                        createdAt
                        updatedAt
                    }
                }
            }
        `;

        const response = await apiClient.post('', {
            query,
            variables: filters,
        });

        if (response.data.errors) throw new Error(response.data.errors[0].message);

        const result = response.data.data.listCoupons;
        if (!result.success) throw new Error(result.message);

        return {
            data: result.coupons as AdminCoupon[],
            totalCount: result.totalCount
        };
    },

    getById: async (id: string) => {
        const query = `
            query GetCouponById($id: String!) {
                getCouponById(id: $id) {
                    success
                    message
                    coupon {
                        id
                        code
                        discountType
                        discountValue
                        maxDiscount
                        minOrderValue
                        usageLimit
                        perUserLimit
                        validFrom
                        validUntil
                        isActive
                        usedCount
                        createdAt
                        updatedAt
                    }
                }
            }
        `;

        const response = await apiClient.post('', { query, variables: { id } });
        if (response.data.errors) throw new Error(response.data.errors[0].message);

        const result = response.data.data.getCouponById;
        if (!result.success) throw new Error(result.message);

        return { data: result.coupon as AdminCoupon };
    },

    create: async (data: CreateCouponInput) => {
        const query = `
            mutation CreateCoupon($input: CreateCouponInput!) {
                createCoupon(input: $input) {
                    success
                    message
                    coupon {
                        id
                        code
                        discountType
                        discountValue
                        maxDiscount
                        minOrderValue
                        usageLimit
                        perUserLimit
                        validFrom
                        validUntil
                        isActive
                        usedCount
                        createdAt
                        updatedAt
                    }
                }
            }
        `;

        const response = await apiClient.post('', { query, variables: { input: data } });
        if (response.data.errors) throw new Error(response.data.errors[0].message);

        const result = response.data.data.createCoupon;
        if (!result.success) throw new Error(result.message);

        return { data: result.coupon as AdminCoupon };
    },

    update: async (id: string, data: UpdateCouponInput) => {
        const query = `
            mutation UpdateCoupon($id: String!, $input: UpdateCouponInput!) {
                updateCoupon(id: $id, input: $input) {
                    success
                    message
                    coupon {
                        id
                        code
                        discountType
                        discountValue
                        maxDiscount
                        minOrderValue
                        usageLimit
                        perUserLimit
                        validFrom
                        validUntil
                        isActive
                        usedCount
                        createdAt
                        updatedAt
                    }
                }
            }
        `;

        const response = await apiClient.post('', { query, variables: { id, input: data } });
        if (response.data.errors) throw new Error(response.data.errors[0].message);

        const result = response.data.data.updateCoupon;
        if (!result.success) throw new Error(result.message);

        return { data: result.coupon as AdminCoupon };
    },

    disable: async (id: string) => {
        const query = `
            mutation DisableCoupon($id: String!) {
                disableCoupon(id: $id) {
                    success
                    message
                    coupon {
                        id
                        isActive
                    }
                }
            }
        `;
        const response = await apiClient.post('', { query, variables: { id } });
        if (response.data.errors) throw new Error(response.data.errors[0].message);

        const result = response.data.data.disableCoupon;
        if (!result.success) throw new Error(result.message);

        return { data: result.coupon as AdminCoupon };
    },
};
