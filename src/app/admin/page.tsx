"use client";

import React from 'react';
import Image from "next/image";

const AdminLoginPage: React.FC = () => {
    const [adminId, setAdminId] = React.useState('');
    const [password, setPassword] = React.useState('');


    type Admin = {
        admin_id: number,
        email: string,
        password: string,
        full_name: string,
    }

    const handleLogin = async () => {
        if (!adminId || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const res = await fetch('/api/admin/adminAuth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId: adminId, password: password }),
            });

            if (res.ok) {
                const {admin} = await res.json();
                localStorage.setItem('admin', JSON.stringify(admin as Admin));
                
                window.location.href = '/admin/dashboard';
            } else {
                const data = await res.json();
                alert("Invalid admin ID or password");
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
            <h1 className="text-5xl font-extrabold text-center py-5">Admin Login</h1>
            <div className="flex justify-center">
                <form 
                    className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
                    <div className="mb-5">
                        <label htmlFor="adminId" className="block text-lg font-bold mb-2">Admin ID:</label>
                        <input 
                            type="text" 
                            id="adminId" 
                            name="adminId" 
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
                                setAdminId(input.value);
                            }}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block text-lg font-bold mb-2">Password:</label>
                        <input type="password" id="password" name="password" className="w-full p-2 border border-gray-300 rounded-lg"
                        onInput={
                            (e) => {
                                const input = e.target as HTMLInputElement;
                                setPassword(input.value);
                            }
                        } />
                    </div>
                    <button type="submit" className="w-full bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-amber-200">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;