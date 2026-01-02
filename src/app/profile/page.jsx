'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import Image from 'next/image';

export default function ProfilePage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            const fetchOrders = async () => {
                try {
                    const res = await api.get('/user-orders/');
                    // Validate response 
                    if (res.data && Array.isArray(res.data.orders)) {
                        setOrders(res.data.orders);
                    } else if (Array.isArray(res.data)) {
                        setOrders(res.data);
                    } else {
                        setOrders([]);
                    }
                } catch (err) {
                    console.error("Failed to fetch orders", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrders();
        }
    }, [isAuthenticated, router]);

    if (!mounted || !isAuthenticated) return <div className="min-h-screen bg-black" />;

    return (
        <div className="bg-black min-h-screen text-white p-8">
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold mb-10">My Orders</h1>

                {loading ? (
                    <div className="flex justify-center text-gray-500">Loading...</div>
                ) : (
                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <p className="text-xl">No orders yet.</p>
                                <p className="text-sm mt-2">Go purchase something!</p>
                            </div>
                        ) : (
                            orders.map((order) => {





                                return (
                                    <div key={order.order_id || Math.random()} className="bg-[#1A1A1A] rounded-2xl p-4 flex gap-6 items-center shadow-lg hover:shadow-gray-900 transition-shadow">
                                        {/* Image Box */}
                                        <div className="relative w-32 h-24 bg-[#252525] rounded-xl overflow-hidden flex-shrink-0">
                                            <Image
                                                src={order.image || '/images/shoe1.png'}
                                                alt={order.product_name || 'Product'}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="text-xl font-medium text-white mb-1">{order.product_name || 'Unknown Product'}</h3>
                                            <p className="text-gray-400 text-sm mb-4">
                                                Qty: {order.quantity || 1}
                                            </p>
                                            <p className="text-gray-500 text-xs text-opacity-80">
                                                {order.created_date || 'Date N/A'}
                                            </p>
                                            <p className="text-[#333] text-[10px] mt-1">ID: {order.order_id}</p>
                                        </div>

                                        {/* Price details */}
                                        <div className="text-right flex flex-col justify-center h-full self-start pt-2">
                                            <div className="flex items-center gap-2 justify-end">
                                                <span className="text-white font-bold text-lg">₹{(order.product_amount || 0).toLocaleString()}</span>
                                                {order.product_mrp && order.product_mrp > order.product_amount && (
                                                    <span className="text-gray-500 line-through text-sm">₹{order.product_mrp.toLocaleString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
