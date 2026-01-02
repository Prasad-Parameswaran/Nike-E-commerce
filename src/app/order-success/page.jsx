'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id') || 'ORD-UNKNOWN';
    const productName = searchParams.get('name') || 'Product';
    const price = searchParams.get('price') ? parseFloat(searchParams.get('price')).toLocaleString() : '0';
    const originalPrice = searchParams.get('original');
    const image = searchParams.get('image') || '/images/shoe1.png';
    const dateStr = searchParams.get('date');

    const formattedDate = dateStr
        ? new Date(dateStr).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, day: 'numeric', month: 'short', year: 'numeric' })
        : new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, day: 'numeric', month: 'short', year: 'numeric' });


    return (
        <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center p-4 font-sans text-white">
            {/* Nike Logo */}
            <div className="mb-6">
                <img
                    src="/images/Vector.png"
                    alt="Nike Logo"
                    className="h-6 w-auto"
                />
            </div>

            {/* Success Message */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                    Successfully Ordered!
                </h1>
                <p className="text-[#6D6D6D] text-sm">
                    {formattedDate}
                </p>
                <p className="text-[#444] text-xs mt-2">Order ID: {orderId}</p>
            </div>

            {/* Product Card */}
            <div className="w-full max-w-[500px] bg-[#1C1C1C] rounded-2xl p-5 flex items-center gap-5 shadow-2xl">
                {/* Product Image Container */}
                <div className="relative w-28 h-24 bg-[#D4F756] rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {/* Shoe Image */}
                    <div className="w-full h-full flex items-center justify-center p-2">
                        <img
                            src={image}
                            alt={productName}
                            className="w-full h-full object-contain transform -rotate-12 scale-110"
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = 'No Image'; }}
                        />
                    </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-lg truncate">
                        {productName}
                    </h3>
                    <p className="text-[#888888] text-sm mt-1">
                        UK 7, 9ADA2A
                    </p>
                </div>

                {/* Price */}
                <div className="text-right">
                    <p className="text-white font-bold text-lg">
                        ₹{price}
                    </p>
                    {originalPrice ? (
                        <p className="text-[#555555] text-sm line-through decoration-1">
                            ₹{parseFloat(originalPrice).toLocaleString()}
                        </p>
                    ) : (
                        <p className="text-[#555555] text-sm line-through decoration-1">
                            ₹{parseFloat(price) * 1.2 /* Mock original */}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccess() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}
