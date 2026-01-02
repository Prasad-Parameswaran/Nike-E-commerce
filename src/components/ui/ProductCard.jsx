'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import gsap from 'gsap';
import api from '../../lib/api';

export default function ProductCard({ product }) {
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const detailsRef = useRef(null);
    const titleRef = useRef(null);
    const watermarkRef = useRef(null);

    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [buying, setBuying] = useState(false);

    // Extract Data from new API structure
    const availableColors = product.variation_colors?.filter(vc => vc.status) || [];

    // State for selections - Initialize directly to avoid flash
    const [selectedColor, setSelectedColor] = useState(() => availableColors[0] || null);

    // Prioritize selected color image, fallback to product default, then placeholder
    const imageToUse = selectedColor?.color_images?.[0] ||
        product.product_images?.[0]?.product_image ||
        '/images/shoe1.png';

    // Derived sizes based on current selection
    const currentSizes = selectedColor?.sizes?.filter(s => s.status) || [];

    // State for size - sync with color change
    const [selectedSize, setSelectedSize] = useState(() => currentSizes[0] || null);

    // Update selected size when color changes
    useEffect(() => {
        if (currentSizes.length > 0) {
            // Try to find the same size in the new color options
            const preservedSize = selectedSize
                ? currentSizes.find(s => s.size_name === selectedSize.size_name)
                : null;

            if (preservedSize) {
                setSelectedSize(preservedSize);
            } else {
                // If not available, fallback to first size
                setSelectedSize(currentSizes[0]);
            }
        } else {
            setSelectedSize(null);
        }
    }, [selectedColor, currentSizes]); // Depend on selectedColor so this runs when it updates


    const handleColorSelect = (e, color) => {
        e.stopPropagation(); // Prevent card navigation
        setSelectedColor(color);
    };

    const handleSizeSelect = (e, size) => {
        e.stopPropagation(); // Prevent card navigation
        setSelectedSize(size);
    };

    const cardColorToUse = selectedColor?.color_name?.toLowerCase().includes('red') ? '#a52a2a' :
        selectedColor?.color_name?.toLowerCase().includes('green') ? '#9bdc28' :
            selectedColor?.color_name?.toLowerCase().includes('blue') ? '#8a2be2' :
                selectedColor?.color_name?.toLowerCase() || '#333';

    // Animation effects
    useEffect(() => {
        const container = containerRef.current;

        // Initial States
        gsap.set(detailsRef.current, { autoAlpha: 0, y: 100 }); // Start lower
        gsap.set(titleRef.current, { y: 0 });

        const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out", duration: 0.5 } });

        // Animation Sequence
        tl.to(imageRef.current, {
            y: -50, // Move shoe up slightly
            scale: 1.05,
            rotate: 0,
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))"
        }, 0)
            .to(watermarkRef.current, {
                y: -100, // Move watermark up with background
                opacity: 0.1
            }, 0)
            .to(titleRef.current, {
                y: -140, // Move title further up as requested
            }, 0)
            .to(detailsRef.current, {
                autoAlpha: 1,
                y: 0 // Move details to natural position (bottom)
            }, 0.1);

        const onEnter = () => tl.play();
        const onLeave = () => tl.reverse();

        container.addEventListener('mouseenter', onEnter);
        container.addEventListener('mouseleave', onLeave);

        return () => {
            if (container) {
                container.removeEventListener('mouseenter', onEnter);
                container.removeEventListener('mouseleave', onLeave);
            }
            tl.kill();
        };
    }, []);

    const handleBuyNow = async (e) => {
        e.stopPropagation(); // prevent navigation
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (buying) return;
        setBuying(true);

        try {

            if (!selectedSize) {
                alert("Please select a size.");
                setBuying(false);
                return;
            }

            const payload = {
                variation_product_id: selectedSize.variation_product_id,
            };

            const response = await api.post('/purchase-product', payload);

            if (response.data && response.data.order) {
                const order = response.data.order;
                const params = new URLSearchParams({
                    id: order.id,
                    name: product.name,
                    price: order.total_amount,
                    original: product.mrp,
                    image: imageToUse,
                    date: new Date().toISOString()
                });
                router.push(`/order-success?${params.toString()}`);
            }

        } catch (error) {
            console.error("Buy error:", error);
            alert("Failed to purchase product. Please try again.");
        } finally {
            setBuying(false);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full aspect-[3/4.2] bg-[#232323] rounded-none overflow-hidden shadow-2xl cursor-pointer group">

            {/* Background Watermark */}
            <div ref={watermarkRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] font-black text-white/5 whitespace-nowrap select-none z-0 pointer-events-none italic tracking-tighter">
                NIKE
            </div>

            {/* Product Image */}
            <div className="absolute top-0 left-0 w-full h-full z-10 transition-transform duration-300 flex items-center justify-center p-4">
                <Image
                    ref={imageRef}
                    src={imageToUse}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="object-contain drop-shadow-xl w-full h-full"
                    priority
                />
            </div>

            {/* Title */}
            <div ref={titleRef} className="absolute bottom-10 left-0 w-full text-center z-20 px-4">
                {/* <h3 className="text-white font-extrabold text-2xl uppercase tracking-wider">{product.name}</h3> */}
                {/* <p className="text-gray-400 text-sm mt-1">₹{product.sale_price}</p> */}
            </div>

            {/* Hover Details */}
            <div ref={detailsRef} className="absolute bottom-0 left-0 w-full px-4 pb-6 text-center z-20 opacity-0 bg-[#232323]">

                <div className="flex flex-col items-center gap-5">

                    {/* Size Selector */}
                    <div className="flex items-center gap-3">
                        <span className="text-gray-300 font-bold uppercase text-sm">SIZE:</span>
                        <div className="flex gap-2 flex-wrap justify-center max-w-[280px]">
                            {(() => {
                                // Get all unique size names across all colors to display the full range
                                const allSizeNames = Array.from(new Set(
                                    product.variation_colors?.flatMap(vc => vc.sizes?.map(s => s.size_name)) || []
                                )).sort((a, b) => {
                                    // Try numeric sort if possible, otherwise string
                                    const numA = parseFloat(a.replace(/[^\d.]/g, ''));
                                    const numB = parseFloat(b.replace(/[^\d.]/g, ''));
                                    return !isNaN(numA) && !isNaN(numB) ? numA - numB : a.localeCompare(b);
                                });

                                return allSizeNames.slice(0, 5).map(sizeName => { // Limit to 5 for card layout
                                    // Check availability for selected color
                                    const availableSizeObj = currentSizes.find(s => s.size_name === sizeName && s.status);
                                    const isSelected = selectedSize?.size_name === sizeName;
                                    const isAvailable = !!availableSizeObj;

                                    return (
                                        <button
                                            key={sizeName}
                                            onClick={(e) => isAvailable && handleSizeSelect(e, availableSizeObj)}
                                            disabled={!isAvailable}
                                            className={`w-9 h-9 rounded-lg font-bold text-sm flex items-center justify-center transition-all
                                                ${isSelected
                                                    ? 'bg-white text-black scale-110 shadow-md'
                                                    : isAvailable
                                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                                        : 'bg-gray-900/50 text-gray-600 cursor-not-allowed opacity-50'
                                                }`}
                                        >
                                            {sizeName}
                                        </button>
                                    );
                                });
                            })()}
                        </div>
                    </div>

                    {/* Color Selector */}
                    <div className="flex items-center gap-3">
                        <span className="text-gray-300 font-bold uppercase text-sm">COLOR:</span>
                        <div className="flex gap-2">
                            {availableColors.slice(0, 3).map(color => (
                                <button
                                    key={color.color_id}
                                    onClick={(e) => handleColorSelect(e, color)}
                                    className={`w-6 h-6 rounded-full border-2 transition-all 
                                        ${selectedColor?.color_id === color.color_id
                                            ? 'border-white scale-125 ring-2 ring-white/50'
                                            : 'border-transparent ring-2 ring-transparent hover:ring-white/50'}`}
                                    style={{ backgroundColor: color.color_name.toLowerCase() }}
                                ></button>
                            ))}
                        </div>
                    </div>

                    {/* Buy Now Button */}
                    <div className="w-full max-w-[200px]">
                        <button
                            onClick={handleBuyNow}
                            disabled={buying || currentSizes.length === 0}
                            className="w-full bg-white text-black font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-gray-100 uppercase tracking-wider text-sm transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {buying ? 'Processing...' : 'Buy Now'}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
