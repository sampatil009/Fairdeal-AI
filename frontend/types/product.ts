export type ProductCategory =
    | 'Electronics'
    | 'Fashion'
    | 'Home & Garden'
    | 'Sports'
    | 'Books'
    | 'Toys'
    | 'Beauty'
    | 'Automotive';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    minPrice: number;
    stock: number;
    images: string[];
    category: ProductCategory;
    negotiationEnabled: boolean;
    rating: number;
    reviewCount: number;
    createdAt: string;
    featured?: boolean;
    badge?: string;
}

export interface ProductFilter {
    category?: ProductCategory;
    minPrice?: number;
    maxPrice?: number;
    negotiationEnabled?: boolean;
    search?: string;
}
