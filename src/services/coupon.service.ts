import { orderAPI } from "./orderAPI";

export const couponService = {
    validateCoupon: async (code: string, subtotal: number) => {
        const response = await orderAPI.validateCoupon(code, subtotal);

        if (!response.success) {
            throw new Error(response.message || "Invalid coupon");
        }

        return response;
    },
};