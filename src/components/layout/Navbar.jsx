import Link from 'next/link';
import { cookies } from 'next/headers';
import NavbarAuth from './NavbarAuth';

export default function Navbar() {
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    const isAuthenticated = !!token;

    return (
        <nav className="w-full bg-black border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-14 items-center">
                    {/* Left: Nike Swoosh Logo (White) */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center" aria-label="Nike Home">
                            {/* Corrected Nike Swoosh Logo */}
                            <img
                                src="/images/Vector.png"
                                alt="Nike Logo"
                                className="h-4 pl-4 w-auto"
                            />
                        </Link>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                        {/* <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                        */}
                    </div>

                    <div className="flex items-center space-x-4">
                        <NavbarAuth initialIsAuthenticated={isAuthenticated} />
                    </div>
                </div>
            </div>
        </nav>
    );
}
