import './globals.css';
import { Providers } from '../components/Providers';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export const metadata = {
    title: 'Nike E-Commerce',
    description: 'Mini E-Commerce Application',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased font-sans">
                <Providers>
                    <Navbar />
                    <main className="min-h-screen pt-4 pb-12">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
