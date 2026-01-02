'use client';

import { useEffect, useState } from 'react';
import ProductCard from '../components/ui/ProductCard';
import api from '../lib/api';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/new-products');
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#121212] min-h-screen text-white flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#121212] min-h-screen text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-10">Men&apos;s Jordan Shoes</h2>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
