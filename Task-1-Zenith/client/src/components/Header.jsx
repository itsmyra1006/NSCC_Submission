import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { navigate } from '../router/Router';

// Get the base URL for the API from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const Header = () => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogin = () => {
        // *** BUG FIX: Use the full, absolute URL for the login redirect ***
        window.location.href = `${API_BASE_URL}/api/auth/google`;
    };

    useEffect(() => {
        const handleClickOutside = (event) => { 
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-[#2D283E] shadow-lg sticky top-0 z-50 border-b border-[#4C495D]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div 
                        className="text-2xl font-bold text-white cursor-pointer hover:text-[#802BB1] transition-colors"
                        onClick={() => navigate('/')}
                    >
                        Zenith
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <button
                                    onClick={() => navigate('/create-post')}
                                    className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#802BB1] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-transform transform hover:scale-105"
                                >
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Create Post
                                </button>
                                <div className="relative" ref={dropdownRef}>
                                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-purple-500 transition">
                                        <img className="h-9 w-9 rounded-full object-cover" src={user.picture} alt="User avatar" />
                                    </button>
                                    {dropdownOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-[#4C495D] ring-1 ring-black ring-opacity-5 z-50">
                                            <div className="px-4 py-3 border-b border-[#564F6F]">
                                                <p className="font-semibold text-white text-sm">{user.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); setDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#564F6F] hover:text-white">Dashboard</a>
                                                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/create-post'); setDropdownOpen(false); }} className="block sm:hidden px-4 py-2 text-sm text-gray-300 hover:bg-[#564F6F] hover:text-white">Create Post</a>
                                                <a href="#" onClick={(e) => { e.preventDefault(); logout(); setDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#564F6F] hover:text-white">Logout</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#802BB1] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-transform transform hover:scale-105"
                            >
                                Login with Google
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

