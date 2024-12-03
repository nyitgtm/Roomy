"use client";

import React, { useState } from 'react';
import Image from "next/image";

const StudentDashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('en-CA').split('T')[0]);
    type StudyRoom = {
        room_id: number;
        location: string;
        room_name: string;
        capacity: number;
    };

    const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([]);

    type Student = {
        student_id: number;
        email: string;
        password: string;
        full_name: string;
        is_banned: boolean;
    };

    let currStudent: Student | null = null;
    if (typeof window !== 'undefined') {
        const studentData = localStorage.getItem('student');
        try {
            currStudent = studentData ? (JSON.parse(studentData) as Student) : null;
        } catch (error) {
            console.error("Error parsing student data from localStorage", error);
            window.location.href = '/student';
        }
        if (!currStudent) {
            window.location.href = '/student';
        }
    }

    const refreshStudent = async () => {
        if (!currStudent) {
            window.location.href = '/student';
            return;
            }

        try {
            const res = await fetch('/api/student/getstudent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: currStudent.student_id }),
            });

            if (res.ok) {
                const {student} = await res.json();
                type Student = {
                    student_id: number;
                    email: string;
                    password: string;
                    full_name: string;
                    is_banned: boolean;
                };

                localStorage.setItem('student', JSON.stringify(student as Student));
                console.log("Student data refreshed");
                return;
            } else {
                return;
            }
        } catch (error) {
            return;
        }
    }

    const getStudyRooms = async () => {
        try {
            const res = await fetch('/api/getrooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                const {studyRooms} = await res.json();
                setStudyRooms(studyRooms);
                return;
            } else {
                return;
            }
        } catch (error) {
            return;
        }
    }

    if (studyRooms.length === 0) {
        getStudyRooms();
    }

    const makeBooking = async () => {
        try {
            // Function to convert time to 24-hour format
            const convertTo24HourFormat = (time : string) => {
                const [hourMin, period] = time.split(/(am|pm)/);
                let [hours, minutes] = hourMin.split(':').map((part) => parseInt(part, 10)); // Parse as integers
            
                // Ensure that hours and minutes are valid numbers
                if (isNaN(hours)) hours = 0;
                if (isNaN(minutes)) minutes = 0;
            
                // Convert to 24-hour format
                if (period === 'pm' && hours !== 12) {
                    hours += 12; // Convert PM to 24-hour format
                }
                if (period === 'am' && hours === 12) {
                    hours = 0; // Convert midnight (12 AM) to 00:00
                }
            
                // Return time as HH:MM:00 string (with leading zeros if necessary)
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
            };
            
            const startTime24 = convertTo24HourFormat(selectedTime);  // Convert start time
            const startHour = parseInt(startTime24.split(':')[0], 10);
            const endTime24 = `${(startHour + 1).toString().padStart(2, '0')}:00:00`;  // End time + 1 hour

            console.log(new Date(selectedDate).toISOString().split('T')[0]);
    
            // Send request to backend with valid formatted date and time
            const res = await fetch('/api/booking/addbooking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reserverId: currStudent?.student_id,
                    reserverType: 'Student',
                    roomId: selectedRoom,
                    date: selectedDate,
                    startTime: convertTo24HourFormat(selectedTime),
                    endTime: endTime24,
                }),
            });
    
            if (res.ok) {
                alert("Booking successful!");
            } else {
                alert("Booking failed.");
            }
        } catch (error) {
            console.error("Error making booking", error);
            alert("Booking failed.");
        }
    };
    

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
                    <Image src="/roomylogo.png" alt="Roomy Logo" width={150} height={50} />
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
                <h1 className="text-4xl font-extrabold py-5">Welcome {currStudent?.full_name}!</h1>

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

                {/* Different Types of Study Rooms */}
                {studyRooms && (
                    <div className="w-full max-w-4xl mt-10 bg-white p-5 rounded-lg shadow-lg">
                        {selectedRoom && selectedTime && (
                            <div className="flex justify-end">
                                <button
                                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-400 m-4"
                                    onClick={() => {
                                        const date = new Date(); // You can customize the date as needed
                                        makeBooking();
                                    }}
                                >Checkout</button>
                            </div>
                        )}
                        <h2 className="text-2xl font-bold mb-4 text-center">Available Rooms</h2>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                            value={selectedBuilding}
                            onChange={(e) => setSelectedBuilding(e.target.value)}
                        >
                            <option value="">Select a location</option>
                            {Array.from(new Set(studyRooms.map(room => room.location))).sort().map((location: string) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                            value={selectedDate || new Date().toLocaleDateString('en-CA')}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toLocaleDateString('en-CA')}
                        />
                        <div className="mb-6">
                            <ul>
                                {Array.from(new Set(studyRooms.map(room => room.location))).sort().map((location: string) => (
                                    (!selectedBuilding || location === selectedBuilding) && (
                                        <div key={location}>
                                            <h3 className="text-lg font-bold mt-4">{location}</h3>
                                            {studyRooms
                                                .filter((room) => !selectedBuilding || room.location === selectedBuilding)
                                                .filter((room) => room.location === location)
                                                .map((room) => (
                                                    <li
                                                        key={room.room_id}
                                                        className="flex justify-between items-center p-3 border-b border-gray-300 hover:bg-gray-200"
                                                    >
                                                        <div>
                                                            <p className="font-bold">{room.room_name}</p>
                                                            <p>{room.capacity} people</p>
                                                        </div>

                                                        <div className="w-full max-w-4xl mt-10 p-5">
                                                            <div className="flex overflow-x-auto space-x-2">
                                                                {Array.from({ length: 12 }, (_, i) => {
                                                                    const hour = 8 + i;
                                                                    const time = `${hour % 12 || 12}${hour < 12 ? 'am' : 'pm'}`;
                                                                    return (
                                                                        <div
                                                                            key={i}
                                                                            className={`p-1 rounded-lg text-center text-sm min-w-[50px] cursor-pointer ${
                                                                                selectedTime === time && selectedBuilding === room.location && selectedRoom === room.room_id ? 'bg-yellow-500' : 'bg-green-500 text-white hover:bg-gray-300'
                                                                            }`}
                                                                            onClick={() => {
                                                                                setSelectedTime(time);
                                                                                setSelectedBuilding(room.location);
                                                                                setSelectedRoom(room.room_id);
                                                                            }}
                                                                        >
                                                                            {time}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                        </div>
                                    )
                                ))}
                            </ul>
                        </div>
                    </div>
                )}      


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
                        {/* Display dynamic user details */}
                        <h2 className="text-xl font-bold mt-3">
                            {currStudent?.full_name || "Guest"}
                        </h2>
                        <p>Student ID: {currStudent?.student_id || "N/A"}</p>
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
                            {Array.from(new Set(studyRooms.map(room => room.location))).sort().map((building: string) => (
                                <option key={building} value={building}>
                                    {building}
                                </option>
                            ))}
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

        <div className='my-10'>&nbsp;</div>
    </div>
    );
};

export default StudentDashboard;
