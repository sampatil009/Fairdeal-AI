export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    originalPrice: number;
    finalPrice: number;
    negotiated: boolean;
    savingsPercent?: number;
}

export interface ShippingAddress {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    subtotal: number;
    total: number;
    totalSavings: number;
    status: OrderStatus;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    originalPrice: number;
    finalPrice: number;
    negotiated: boolean;
    negotiationSessionId?: string;
    savingsPercent?: number;
}
