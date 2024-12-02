"use client";

import React, { useState } from 'react';
import Image from "next/image";

const FacultyLogin: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Handle login logic here
        alert(`Logging in with email: ${email}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-yellow-100 to-orange-200 text-black">
            {/* Logo and Header */}
            <div className="flex justify-between items-center p-5">
                <button onClick={() => (window.location.href = '/')}>
                    <Image src="/roomylogomain.png" alt="Roomy Logo" width={150} height={50} />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center px-5">
                <h1 className="text-4xl font-extrabold py-5">Faculty Login</h1>

                {/* Login Form */}
                <div className="w-full max-w-md bg-white p-5 rounded-lg shadow-lg">
                    <label className="block text-lg font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label className="block text-lg font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-400"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FacultyLogin;