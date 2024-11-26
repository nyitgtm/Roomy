"use client";

import React from 'react';
import Image from "next/image";

const LoginPage: React.FC = () => {
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
                        window.location.href = '/student/dashboard';
                    }}
                >
                    <div className="mb-5">
                        <label htmlFor="studentId" className="block text-lg font-bold mb-2">Student ID:</label>
                        <input 
                            type="text" 
                            id="studentId" 
                            name="studentId" 
                            className="w-full p-2 border border-gray-300 rounded-lg" 
                            maxLength={7}
                            onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                if (/[^0-9]/.test(input.value)) {
                                    input.classList.add('border-red-500');
                                } else {
                                    input.classList.remove('border-red-500');
                                }
                                input.value = input.value.replace(/[^0-9]/g, '');
                            }}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block text-lg font-bold mb-2">Password:</label>
                        <input type="password" id="password" name="password" className="w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                    <button type="submit" className="w-full bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-amber-200">Login</button>
                <div className="flex justify-center mt-5">
                    <button 
                        type="button" 
                        className="w-full bg-blue-400 text-white font-bold py-2 rounded-lg hover:bg-blue-300"
                        onClick={() => {
                            const studentId = (document.getElementById('studentId') as HTMLInputElement).value;
                            const password = (document.getElementById('password') as HTMLInputElement).value;
                            if (studentId && password) {
                                //window.location.href = '/student/create-account';
                                alert('Created account for ' + studentId);
                            } else {
                                alert('Please fill in all fields');
                            }
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