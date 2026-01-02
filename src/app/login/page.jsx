'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { SiNike } from 'react-icons/si';

export default function LoginPage() {
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [name, setName] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const [phoneError, setPhoneError] = useState(''); // State for validation error

    const [timer, setTimer] = useState(34);

    const router = useRouter();
    const { loading, error, loginSuccess, loginFailure, setLoading, isAuthenticated } = useAuth(); // Destructure isAuthenticated

    const otpRefs = [useRef(), useRef(), useRef(), useRef()];

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (step === 2 && timer > 0) {
            const interval = setInterval(() => setTimer((t) => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [step, timer]);

    // State for temporary data during auth flow
    const [serverOtp, setServerOtp] = useState(null);
    const [tempToken, setTempToken] = useState(null);

    // OTP Modal sate here ... 
    const [showOtpModal, setShowOtpModal] = useState(false);

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();

        // Validation: 10 digit number
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setPhoneError('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/verify', { phone_number: phoneNumber });
            const data = response.data;

            // Store OTP (for testing/validation) and status
            setServerOtp(data.otp);
            setShowOtpModal(true);

            if (data.user) {
                // Existing user - store token to use after OTP verify
                setTempToken(data.token.access);
                setIsNewUser(false);
            } else {
                // New user
                setIsNewUser(true);
            }

            setStep(2);
            setLoading(false);
        } catch (err) {
            console.error(err);
            loginFailure(err.response?.data?.message || 'Verification failed');
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            otpRefs[index + 1].current.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current.focus();
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 4) return;

        if (otpValue !== serverOtp) {
            alert('Invalid OTP');
            return;
        }

        setLoading(true);

        if (isNewUser) {
            // New user: proceed to name collection
            setStep(3);
            setLoading(false);
        } else {
            // Existing user --we already have the token from Step 1
            loginSuccess(
                { phoneNumber }, // User data
                tempToken // Token
            );
            router.push('/');
        }
    };

    const handleNameSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/login-register', {
                name,
                phone_number: phoneNumber
                // unique_id mapping if neededasda
            });

            const data = response.data;

            loginSuccess(
                { name: data.name, phoneNumber: data.phone_number, id: data.user_id },
                data.token.access
            );
            router.push('/profile');

        } catch (err) {
            console.error(err);
            loginFailure(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-black text-white selection:bg-gray-800 selection:text-white">

            {/* Left Panel - Image (Visible on LG screens) */}
            <div className="hidden lg:block w-1/2 relative h-screen bg-[#111]">
                <Image
                    src="/images/login_hero.jpg" // Using user provided image
                    alt="Basketball Lifestyle"
                    fill
                    className="object-cover opacity-90"
                    priority
                />
                {/* Logo Overlay on Image */}
                <div className="absolute top-8 left-8">
                    <SiNike className="text-white text-4xl" />
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between px-8 py-8 lg:px-20 relative">

                {/* Mobile Logo */}
                <div className="lg:hidden mb-8">
                    <SiNike className="text-white text-3xl" />
                </div>

                {/* Center Content */}
                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">

                    {/* STEP 1: PHONE */}
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-bold mb-8">Log In</h2>

                            <form onSubmit={handlePhoneSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => {
                                            setPhoneNumber(e.target.value);
                                            setPhoneError(''); // Clear error on change
                                        }}
                                        placeholder="Enter Phone"
                                        className={`w-full bg-[#1A1A1A] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white transition-all ${phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-800'}`}
                                        required
                                    />
                                    {phoneError && (
                                        <p className="text-red-500 text-sm mt-2">{phoneError}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Continue'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* STEP 2: OTP */}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <div className="flex items-center gap-2 mb-2">
                                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white text-sm">
                                    ← Back
                                </button>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Verify phone</h2>
                            <p className="text-gray-400 text-sm mb-8">
                                Enter the OTP sent to {phoneNumber} <span className="text-white cursor-pointer underline">Edit</span>
                            </p>

                            <form onSubmit={handleOtpSubmit} className="space-y-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">Enter OTP</label>
                                    <div className="flex gap-4">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={otpRefs[index]}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="w-14 h-14 bg-[#1A1A1A] border border-gray-800 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="text-sm text-gray-500">
                                    Resend OTP in <span className="text-white font-bold">{timer}s</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Verify'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* STEP 3: NAME */}
                    {step === 3 && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-bold mb-2">Welcome, You are?</h2>
                            <p className="text-gray-400 text-sm mb-8">
                                Let us know what to call you.
                            </p>

                            <form onSubmit={handleNameSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Eg: John Mathew"
                                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Creating Account...' : 'Continue'}
                                </button>
                            </form>
                        </div>
                    )}

                </div>

                {/* Footer Icons */}
                {/* <div className="flex justify-end gap-6 mt-8">
                    <FaFacebookF className="text-white hover:text-gray-400 cursor-pointer transition-colors" />
                    <FaInstagram className="text-white hover:text-gray-400 cursor-pointer transition-colors" />
                    <FaTwitter className="text-white hover:text-gray-400 cursor-pointer transition-colors" />
                </div> */}

            </div>

            {/* Custom OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-green-500 text-2xl">✓</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">OTP Sent!</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Your One Time Password is:
                            </p>
                            <div className="bg-black rounded-lg p-4 mb-6 border border-gray-800">
                                <span className="text-2xl font-mono tracking-widest text-white">{serverOtp}</span>
                            </div>
                            <button
                                onClick={() => setShowOtpModal(false)}
                                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


