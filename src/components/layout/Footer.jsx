import Link from 'next/link';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-black text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center bg-black">
                    {/* Left: Nike Swoosh Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" aria-label="Nike Home">
                            <img
                                src="/images/Vector.png"
                                alt="Nike Logo"
                                className="h-6 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Right: Social Icons */}
                    <div className="flex space-x-6 items-center">
                        <a href="#" className="text-white hover:text-gray-400 transition-colors" aria-label="Facebook">
                            <FaFacebookF className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-white hover:text-gray-400 transition-colors" aria-label="Instagram">
                            <FaInstagram className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-white hover:text-gray-400 transition-colors" aria-label="X (Twitter)">
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
