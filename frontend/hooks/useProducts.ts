'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Product, ProductFilter } from '@/types/product';

export function useProducts(initialFilter?: ProductFilter) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<ProductFilter>(initialFilter || {});

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filter.category) params.set('category', filter.category);
            if (filter.search) params.set('search', filter.search);
            if (filter.negotiationEnabled !== undefined)
                params.set('negotiationEnabled', String(filter.negotiationEnabled));
            if (filter.minPrice !== undefined) params.set('minPrice', String(filter.minPrice));
            if (filter.maxPrice !== undefined) params.set('maxPrice', String(filter.maxPrice));

            const res = await axios.get(`http://localhost:5000/api/products?${params.toString()}`);
            setProducts(res.data.products);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, isLoading, error, filter, setFilter, refetch: fetchProducts };
}

export function useProduct(productId: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!productId) return;
        setIsLoading(true);
        axios.get(`http://localhost:5000/api/products/${productId}`)
            .then((res) => {
                setProduct(res.data.product);
            })
            .catch((err) => setError(err.response?.data?.error || 'Failed to fetch product'))
            .finally(() => setIsLoading(false));
    }, [productId]);

    return { product, isLoading, error };
}
