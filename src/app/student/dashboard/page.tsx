"use client";

import React, { useState } from 'react';
import Image from "next/image";

const StudentDashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    const timeSlots = ["12pm-1pm", "1pm-2pm", "2pm-3pm", "3pm-4pm", "4pm-5pm"];
    const bookings = [
        { id: 1, room: "Anna Rubin", time: "12pm-1pm", status: "Confirmed" },
        { id: 2, room: "Sultran Center", time: "2pm-3pm", status: "Pending" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-yellow-100 to-orange-200 text-black">
            {/* Logo and Header */}
            <div className="flex justify-between items-center p-5">
                <button onClick={() => (window.location.href = '/')}>
                    <Image src="/roomylogomain.png" alt="Roomy Logo" width={150} height={50} />
                </button>
                <button
                    className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-amber-200"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    Profile
                </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center px-5">
                <h1 className="text-4xl font-extrabold py-5">Welcome to Your Dashboard</h1>

                {/* Room Booking Panel */}
                <button
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-400"
                    onClick={() => setIsBookingOpen(true)}
                >
                    Reserve a Room
                </button>

                {/* My Bookings Section */}
                <div className="w-full max-w-4xl mt-10 bg-white p-5 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
                    <ul>
                        {bookings.map((booking) => (
                            <li
                                key={booking.id}
                                className="flex justify-between items-center p-3 border-b border-gray-300"
                            >
                                <div>
                                    <p className="font-bold">{booking.room}</p>
                                    <p>{booking.time}</p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-white ${
                                        booking.status === "Confirmed"
                                            ? "bg-green-500"
                                            : "bg-yellow-500"
                                    }`}
                                >
                                    {booking.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Sidebar for Profile Management */}
            {sidebarOpen && (
                <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-5">
                    <button
                        className="text-black font-bold text-lg mb-5"
                        onClick={() => setSidebarOpen(false)}
                    >
                        Close
                    </button>
                    <div className="flex flex-col items-center">
                        <Image
                            src="/profile-placeholder.png"
                            alt="Profile"
                            width={100}
                            height={100}
                            className="rounded-full"
                        />
                        <h2 className="text-xl font-bold mt-3">John Doe</h2>
                        <p>Student ID: 1234567</p>
                    </div>
                </div>
            )}

            {/* Booking Popup */}
            {isBookingOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Reserve a Room</h2>

                        {/* Building Selection */}
                        <label className="block text-lg font-bold mb-2">Choose a Building:</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                            value={selectedBuilding}
                            onChange={(e) => setSelectedBuilding(e.target.value)}
                        >
                            <option value="">Select a building</option>
                            <option value="Anna Rubin">Anna Rubin</option>
                            <option value="Sultran Center">Sultran Center</option>
                            <option value="Recreation Center">Recreation Center</option>
                        </select>

                        {/* Time Slot Selection */}
                        <label className="block text-lg font-bold mb-2">Choose a Time Slot:</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        >
                            <option value="">Select a time slot</option>
                            {timeSlots.map((slot) => (
                                <option key={slot} value={slot}>
                                    {slot}
                                </option>
                            ))}
                        </select>

                        {/* Confirm Button */}
                        <button
                            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-400"
                            onClick={() => {
                                alert(
                                    `You have requested to book ${selectedBuilding} from ${selectedTime}.`
                                );
                                setIsBookingOpen(false);
                            }}
                        >
                            Confirm Booking
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
