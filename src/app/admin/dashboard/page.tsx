"use client";

import React, { useState } from 'react';
import Image from "next/image";

const FacultyDashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState("");
    const [isSuggestingTime, setIsSuggestingTime] = useState(false);

    const timeSlots = ["12pm-1pm", "1pm-2pm", "2pm-3pm", "3pm-4pm", "4pm-5pm"];
    const [requests, setRequests] = useState([
        { id: 1, studentName: "Alice Johnson", room: "Anna Rubin", time: "12pm-1pm", status: "Pending" },
        { id: 2, studentName: "Bob Smith", room: "Sultran Center", time: "2pm-3pm", status: "Pending" },
    ]);

    const handleAccept = (id: number) => {
        setRequests((prev) =>
            prev.map((request) =>
                request.id === id ? { ...request, status: "Accepted" } : request
            )
        );
    };

    const handleReject = (id: number) => {
        setIsSuggestingTime(true);
    };

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
                <h1 className="text-4xl font-extrabold py-5">Faculty Dashboard</h1>

                {/* Incoming Requests Section */}
                <div className="w-full max-w-4xl mt-10 bg-white p-5 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Incoming Requests</h2>
                    <ul>
                        {requests.map((request) => (
                            <li
                                key={request.id}
                                className={`flex justify-between items-center p-3 border-b border-gray-300 ${
                                    request.status === "Accepted"
                                        ? "bg-green-100"
                                        : request.status === "Rejected"
                                        ? "bg-red-100"
                                        : ""
                                }`}
                            >
                                <div>
                                    <p className="font-bold">{request.studentName}</p>
                                    <p>{`${request.room} - ${request.time}`}</p>
                                </div>
                                {request.status === "Pending" ? (
                                    <div className="flex gap-3">
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400"
                                            onClick={() => handleAccept(request.id)}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400"
                                            onClick={() => handleReject(request.id)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                ) : (
                                    <span
                                        className={`px-3 py-1 rounded-full text-white ${
                                            request.status === "Accepted"
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    >
                                        {request.status}
                                    </span>
                                )}
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
                        <h2 className="text-xl font-bold mt-3">Faculty Name</h2>
                        <p>Faculty ID: 12345</p>
                    </div>
                </div>
            )}

            {/* Suggest Alternative Time Slot */}
            {isSuggestingTime && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Suggest Alternative Time Slot</h2>

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

                        <button
                            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-400"
                            onClick={() => {
                                alert(
                                    `Alternative time slot suggested: ${selectedTime}. Notification will be sent to the student.`
                                );
                                setIsSuggestingTime(false);
                            }}
                        >
                            Confirm Time Slot
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyDashboard;
