'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

export default function NavbarAuth({ initialIsAuthenticated }) {
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();

    // Context is the single source of truth now, simpler than Redux + Props mixing.
    // However, for SSG/SSR initial render to not flicker, we might still respect initialIsAuthenticated if context is loading.
    const isLoggedIn = isAuthenticated;

    const handleLogout = () => {
        logout();
        router.push('/');
        router.refresh();
    };

    return (
        <div className="flex items-center">
            {isLoggedIn ? (
                <div className="flex items-center gap-6">
                    <Link
                        href="/profile"
                        className="flex items-center text-white text-sm font-medium hover:text-gray-300 transition-colors gap-2"
                    >
                        <FaUserCircle className="h-5 w-5" />
                        <span>Profile</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-gray-400 text-sm font-medium hover:text-white transition-colors"
                    >
                        <span>Log Out</span>
                    </button>
                </div>
            ) : (
                <Link href="/login" className="text-white text-sm font-medium hover:text-gray-300 transition-colors">
                    Log In
                </Link>
            )}
        </div>
    );
}
