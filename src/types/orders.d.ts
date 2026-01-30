export interface Order {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string | number;
    items: OrderItem[];
    shippingAddress?: {
        addressLine1: string;
        city: string;
        state: string;
    };
}


export interface OrderItem {
    id: string;
    productName: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}


export interface OrderDetail {
    id: string;
    status: string;
    subtotal: number;
    tax: number;
    shippingFee: number;
    totalAmount: number;
    currency: string;
    paymentMethod?: string;
    shippingMethod?: string;
    createdAt: string | number;
    updatedAt: string | number;
    items: OrderItem[];
    shippingAddress?: {
        fullName: string;
        phoneNumber: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}