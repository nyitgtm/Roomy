"use client";

import React from 'react';
import Image from "next/image";


const LoginPage: React.FC = () => {
    const [studentId, setStudentId] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = async () => {
        if (!studentId || !password) {
            alert('Please fill in all fields');
            return;
            }

        try {
            const res = await fetch('/api/student/studentauth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: studentId, password: password }),
            });

            if (res.ok) {
                window.location.href = '/student/dashboard';
            } else {
                const data = await res.json();
                alert(data.error);
            }
        } catch (error) {
            alert('Please try again later.');
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-yellow-100 to-orange-200 text-black animate-gradient-rotate y-10">
            <div className="flex justify-center py-5">
            <button onClick={() => window.location.href = '/'}>
                <Image src="/roomylogomain.png" alt="Roomy Logo" width={500} height={500} />
            </button>
            </div>
            <h1 className="text-5xl font-extrabold text-center py-5">Student Login</h1>
            <div className="flex justify-center">
                <form 
                    className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
                    <div className="mb-5">
                        <label htmlFor="studentId" className="block text-lg font-bold mb-2">Student ID:</label>
                        <input 
                            type="text" 
                            id="studentId" 
                            name="studentId" 
                            value={studentId}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,7}$/.test(value)) {
                                    setStudentId(value);
                                }
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg" 
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block text-lg font-bold mb-2">Password:</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password" 
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <button 
                        type="submit" 
                        id="loginButton" 
                        className="w-full bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-amber-200 disabled:bg-gray-300" 
                        disabled={!studentId || !password}
                    >
                        Login
                    </button>
                    <div className="flex justify-center mt-5">
                        <button 
                            type="button" 
                            className="w-full bg-blue-400 text-white font-bold py-2 rounded-lg hover:bg-blue-300"
                            onClick={() => {
                                window.location.href = '/student/createAccount';
                            }}
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;