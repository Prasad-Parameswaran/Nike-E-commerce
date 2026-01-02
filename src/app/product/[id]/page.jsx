import Image from 'next/image';
import Link from 'next/link';

// Fetch data from real API
async function getProduct(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/new-products/`, { cache: 'no-store' });
        if (!res.ok) return null;
        const products = await res.json();
        // ID is now a UUID string, so simple comparison
        return products.find(p => p.id === id);
    } catch (e) {
        console.error("Failed to fetch product", e);
        return null;
    }
}

export default async function ProductPage({ params }) {
    const product = await getProduct(params.id);

    if (!product) {
        return <div className="text-center py-20 bg-white min-h-screen text-black">Product not found</div>;
    }

    // Adapt new data structure
    const imageToUse = product.product_images?.[0]?.product_image || '/placeholder.png';
    const price = product.sale_price || product.mrp;
    const category = "Shoes"; // Not explicitly in new API response shown, default to Shoes
    const colors = product.variation_colors?.filter(vc => vc.status).map(vc => vc.color_name) || [];

    return (
        <div className="bg-white min-h-screen">
            <div className="pt-6 pb-16 sm:pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                        {/* Image Gallery */}
                        <div className="relative aspect-square w-full rounded-lg bg-gray-100 overflow-hidden">
                            <Image
                                src={imageToUse}
                                alt={product.name}
                                fill
                                className="object-contain mix-blend-multiply p-8"
                                priority
                            />
                        </div>

                        {/* Product Info */}
                        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
                            <div className="mt-3">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-3xl tracking-tight text-gray-900">₹{price}</p>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-900">Category</h3>
                                <p className="text-gray-500">{category}</p>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-900">Colors</h3>
                                <div className="mt-2 flex items-center space-x-3">
                                    {colors.map((color) => (
                                        <div
                                            key={color}
                                            className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ring-green-500 border border-gray-300"
                                        >
                                            <span className="text-xs font-bold px-2">{color}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-10 flex">
                                <Link href="/" className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full">
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
