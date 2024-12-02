"use client";

import React from 'react';
import Image from "next/image";

const CreateAccountPage: React.FC = () => {
    const [studentId, setStudentId] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [fullName, setFullName] = React.useState('');

    const handleCreateAccount = async () => {
        if (!studentId || !email || !password || !confirmPassword || !fullName) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const res = await fetch('/api/student/createstudent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: studentId, email: email, password: password, fullName: fullName }),
            });

            if (res.ok) {
                alert('Account created successfully!');
                window.location.href = '/student/dashboard';
            } else {
                const data = await res.json();
                alert("Account already created. Please Login.");
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
            <h1 className="text-5xl font-extrabold text-center py-5">Create Account</h1>
            <div className="flex justify-center">
                <form 
                    className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateAccount();
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
                        <label htmlFor="email" className="block text-lg font-bold mb-2">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full p-2 border ${!/\S+@\S+\.\S+/.test(email) ? 'border-red-500' : 'border-gray-300'} rounded-lg`} 
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block text-lg font-bold mb-2">Password:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="confirmPassword" className="block text-lg font-bold mb-2">Confirm Password:</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            value={confirmPassword}
                            onChange={(e) => {
                                const value = e.target.value;
                                setConfirmPassword(value);
                            }}
                            className={`w-full p-2 border ${password !== confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="fullName" className="block text-lg font-bold mb-2">Full Name:</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            name="fullName" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <button 
                        type="submit" 
                        id="createAccountButton" 
                        className="w-full bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-amber-200 disabled:bg-gray-300" 
                        disabled={!studentId || !email || !password || !confirmPassword || !fullName || password !== confirmPassword || !/\S+@\S+\.\S+/.test(email)}
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAccountPage;