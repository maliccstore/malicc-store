
export interface Order {
    id: string;
    status: string;
    subtotal: number;
    tax: number;
    shippingFee: number;
    totalAmount: number;
    currency: string;
    paymentMethod: string;
    shippingMethod: string;
    createdAt: string;
    updatedAt: string;
    shippingAddress: {
        fullName: string;
        phoneNumber: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    items: Array<{
        id: string;
        productId: string;
        productName: string;
        unitPrice: number;
        quantity: number;
        totalPrice: number;
    }>;
}