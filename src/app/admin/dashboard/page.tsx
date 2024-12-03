"use client";

import React, { use, useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';

const AdminDashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('en-CA').split('T')[0]);
    const [allBookings, setAllBookings] = useState<any[]>([]);
    const [allPendingBookings, setAllPendingBookings] = useState<any[]>([]);
    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [newRoomName, setNewRoomName] = useState("");
    const [newCapacity, setNewCapacity] = useState(0);
    

    type Booking = {
        booking_id: number;
        reserver_id: number;
        reserver_type: string;
        room_id: number;
        date: string;
        start_time: string;
        end_time: string;
        status: string;
    };

    const [myBookings, setMyBookings] = useState<Booking[]>([]);

    type StudyRoom = {
        room_id: number;
        location: string;
        room_name: string;
        capacity: number;
    };

    const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([]);

    type Admin = {
        admin_id: number,
        email: string,
        password: string,
        full_name: string,
    }
    type Student = {
        student_id: number;
        email: string;
        password: string;
        full_name: string;
        is_banned: boolean;
    };

    let currAdmin: Admin | null = null;

    if (typeof window !== 'undefined') {
        const adminData = localStorage.getItem('admin');
        try {
            currAdmin = adminData ? (JSON.parse(adminData) as Admin) : null;
        } catch (error) {
            console.error("Error parsing faculty data from localStorage", error);
            window.location.href = '/admin';
        }
    
        if (!currAdmin) {
            window.location.href = '/admin';
        }
    }

    const refreshAdmin = async (): Promise<void> => {
        try {
            const res = await fetch('/api/admin/getadmin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId: currAdmin?.admin_id }),
            });

            if (res.ok) {
                const { admin } = await res.json();
                localStorage.setItem('admin', JSON.stringify(admin as Admin));
                return;
            } else {
                return;
            }
        } catch (error) {
            return;
        }
    }

    useEffect(() => {
        if (currAdmin) {
            console.log("Admin logged in", currAdmin);
            refreshAdmin();
        }
    }, []);


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
    
            // Send request to backend with valid formatted date and time
            const res = await fetch('/api/booking/addbooking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reserverId: currAdmin?.admin_id,
                    reserverType: 'Admin',
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

    const getBookingsForStudent = async () => {
        try {
            const res = await fetch('/api/booking/getbooking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reserverId: currAdmin?.admin_id, reserverType: 'Admin' }),
            });

            if (res.ok) {
                const {bookings} = await res.json();
                setMyBookings(bookings);
                return;
            } else {
                return;
            }
        } catch (error) {
            return;
        }
    }

    if (!myBookings || myBookings === null) {
        getBookingsForStudent();
    }

    useEffect(() => {
        getBookingsForStudent();
    }, []); 

    const getBookingsByDate = async () => {
        try {
            const res = await fetch('/api/booking/getbooking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: new Date(selectedDate).toLocaleDateString().split('T')[0] }),
            });

            if (res.ok) {
                const {bookings} = await res.json();
                setAllBookings(bookings);
                return;
            } else {
                return;
            }
        } catch (error) {
            return;
        }
    }

    useEffect(() => {
        getBookingsByDate();
    }, [selectedDate]);

    useEffect(() => {
        getPendingBookings();
    }, []);

    const getPendingBookings = async () => {
        try {
            const res = await fetch('/api/booking/getpendingbookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                const {bookings} = await res.json();
                setAllPendingBookings(bookings);
                return;
            } else {
                return;
            }
        } catch (error) {
            return;
        }
    }

    const handleButtonClick = async () => {
        await makeBooking();
        setSelectedTime("");
        await getBookingsByDate();
        await getBookingsForStudent();
    };

    const updateBookingStatus = async (bookingId: number, status: string) => {
        try {
            const res = await fetch('/api/booking/updatebooking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: bookingId, newStatus: status }),
            });

            if (res.ok) {
                return;
            } else {
                return;
            }
        } catch (error) {
            return;
        }
    };

    const addStudyRoom = async () => { 
        try {
            const res = await fetch('/api/addrooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: newLocation,
                    room_name: newRoomName,
                    capacity: newCapacity,
                }),
            });

            if (res.ok) {
                alert("Room added successfully!");
            } else {
                alert("Failed to add room.");
            }
        } catch (error) {
            console.error("Error adding room", error);
            alert("Failed to add room.");
        }
    }

    const getAllStudents = async () => {
        try {
            const res = await fetch('/api/student/getallstudents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                const {students} = await res.json();
                setAllStudents(students);
            } else {
                return;
            }
        } catch (error) {
            setAllStudents([]);
        }
    }

    if (allStudents.length === 0) {
        getAllStudents();
    }

    const changeStudentStatus = async (studentId: number, isBanned: number) => {
        try {
            const res = await fetch('/api/student/banstudent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: studentId, newStatus: isBanned }),
            });

            if (res.ok) {
                await getAllStudents();
            } else {
                return;
            }
        } catch (error) {
            return;
        }
    }

    const removeRoom = async (roomId: number) => {
        try {
            const res = await fetch('/api/removerooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_id: roomId }),
            });

            if (res.ok) {
                alert("Room removed successfully!");
                await getStudyRooms();
            } else {
                alert("Failed to remove room.");
            }
        } catch (error) {
            console.error("Error removing room", error);
            alert("Failed to remove room.");
        }
    }

    const changeEmailPassword = async () => {
        try {
            const res = await fetch('/api/admin/updateadmin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: currAdmin?.admin_id,
                    email: newEmail,
                    password: newPassword,
                }),
            });

            if (res.ok) {
                if (newEmail && currAdmin) {
                    if (newPassword && newPassword.length > 0) {
                        currAdmin.password = newPassword;
                    }
                }
                refreshAdmin();
                window.location.reload();
            } else {
                return;
            }
        } catch (error) {
            console.error("Error updating profile", error);
        }
    }

    const [facultyIdCreated, setFacultyIdCreated] = useState<number | null>(null);
    const [faciltyEmailCreated, setFacultyEmailCreated] = useState<string>("");
    const [facultyPasswordCreated, setFacultyPasswordCreated] = useState<string>("");
    const [facultyFullNameCreated, setFacultyFullNameCreated] = useState<string>("");

    const addFaculty = async () => {
        try {
            const res = await fetch('/api/faculty/createfaculty', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: faciltyEmailCreated,
                    password: facultyPasswordCreated,
                    full_name: facultyFullNameCreated,
                }),
            });

            if (res.ok) {
                alert("Faculty added successfully!");
            } else {
                alert("Failed to add faculty.");
            }
        } catch (error) {
            console.error("Error adding faculty", error);
            alert("Failed to add faculty.");
        }
    }

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
                <h1 className="text-4xl font-extrabold py-5">Admin Control Panel</h1>
                <h1 className="text-3xl font-extrabold py-5">{currAdmin?.full_name}</h1>
                <div className="w-full max-w-4xl mt-10 bg-white p-5 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Approve Bookings</h2>
                    <ul>
                        {allPendingBookings && allPendingBookings
                            .filter(booking => new Date(booking.date) >= new Date(new Date().toLocaleDateString('en-CA')))
                            .map((booking) => (
                                <li
                                    key={booking.booking_id}
                                    className="flex justify-between items-center p-3 border-b border-gray-300"
                                >
                                    <div>
                                        <p className="font-bold">{booking.room_id}</p>
                                        <p>{(booking.date).split('T')[0]} {booking.start_time} - {booking.end_time}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-400"
                                            onClick={async () => {
                                                await updateBookingStatus(booking.booking_id, 'Approved');
                                                await getPendingBookings();
                                            }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-400"
                                            onClick={async () => {
                                                await updateBookingStatus(booking.booking_id, 'Declined');
                                                await getPendingBookings();
                                            }}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>

                {/* Faculty Modifying Area */}
                <div className="w-full max-w-4xl mt-10 bg-white p-5 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Manage Faculty</h2>
                    <div className="mb-4">
                        <label className="block text-lg font-bold mb-2">Full Name:</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={facultyFullNameCreated}
                            onChange={(e) => setFacultyFullNameCreated(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-bold mb-2">Email:</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={faciltyEmailCreated}
                            onChange={(e) => setFacultyEmailCreated(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-bold mb-2">Password:</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={facultyPasswordCreated}
                            onChange={(e) => setFacultyPasswordCreated(e.target.value)}
                        />
                    </div>
                    <button
                        className={`w-full py-2 rounded-lg ${facultyFullNameCreated && faciltyEmailCreated && facultyPasswordCreated ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        onClick={async () => {
                            if (facultyFullNameCreated && faciltyEmailCreated && facultyPasswordCreated) {
                                await addFaculty();
                                setFacultyFullNameCreated("");
                                setFacultyEmailCreated("");
                                setFacultyPasswordCreated("");
                            }
                        }}
                        disabled={!facultyFullNameCreated || !faciltyEmailCreated || !facultyPasswordCreated}
                    >
                        Add Faculty
                    </button>
                </div>


                {/* Student Modifying Area */}
                <div className="w-full max-w-4xl mt-10 bg-white p-5 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Manage Students</h2>
                    <div className="w-full max-w-4xl p-5">
                        <h2 className="text-xl font-bold mb-4">Search Students</h2>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                            placeholder="Search by name or email or student ID"
                            onChange={(e) => {
                                const searchTerm = e.target.value.toLowerCase();
                                setAllStudents(prevStudents =>
                                    prevStudents.filter(student =>
                                        student.full_name.toLowerCase().includes(searchTerm) ||
                                        student.email.toLowerCase().includes(searchTerm) ||
                                        student.student_id.toString().includes(searchTerm)
                                    )
                                );
                            }}
                        />
                    </div>
                    <ul>
                        {allStudents && allStudents.map((student) => (
                            <li
                                key={student.student_id}
                                className="flex justify-between items-center p-3 border-b border-gray-300"
                            >
                                <div>
                                    <p className="font-bold">{student.full_name}</p>
                                    <p>{student.email}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-400"
                                        onClick={async () => {
                                            await changeStudentStatus(student.student_id, student.is_banned ? 0 : 1);
                                        }}
                                    >
                                        {student.is_banned ? "Unban" : "Ban"}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>




                {/* My Bookings Section */}
                <div className="w-full max-w-4xl mt-10 bg-white p-5 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
                    <ul>
                        {myBookings && myBookings
                            .filter(booking => new Date(booking.date) >= new Date(new Date().toLocaleDateString('en-CA')))
                            .map((booking) => (
                                <li
                                    key={booking.booking_id}
                                    className="flex justify-between items-center p-3 border-b border-gray-300"
                                >
                                    <div>
                                        <span className='font-bold'>{studyRooms.find(room => room.room_id === booking.room_id)?.room_name}</span>
                                        <p>{(booking.date).split('T')[0]} {booking.start_time} - {booking.end_time}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-white ${
                                            booking.status === "Approved"
                                                ? "bg-green-500"
                                                : booking.status === "Declined"
                                                ? "bg-red-500"
                                                : "bg-yellow-500"
                                        }`}
                                    >
                                        {booking.status}
                                    </span>
                                </li>
                            ))}
                    </ul>
                </div>

                <div className="w-full max-w-4xl mt-10 bg-white p-5 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
                    <div className="mb-4">
                        <label className="block text-lg font-bold mb-2">Select Location:</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                        >
                            <option value="">Select a location</option>
                            {Array.from(new Set(studyRooms.map(room => room.location))).sort().map((location: string) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-bold mb-2">Room Name:</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-bold mb-2">Capacity:</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={newCapacity}
                            onChange={(e) => setNewCapacity(parseInt(e.target.value))}
                        />
                    </div>
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-400"
                        onClick={async () => {
                            await addStudyRoom();
                            setNewLocation("");
                            setNewRoomName("");
                            setNewCapacity(0);
                            await getStudyRooms();
                        }}
                    >
                        Add Room
                    </button>
                </div>

                {/* Different Types of Study Rooms */}
                {studyRooms && (
                    <div className="w-full max-w-4xl mt-10 bg-white p-5 rounded-lg shadow-lg">
                        {selectedRoom && selectedTime && (() => {
                            const convertTo24HourFormat = (time : string) => {
                                const [hourMin, period] = time.split(/(am|pm)/);
                                let [hours, minutes] = hourMin.split(':').map((part) => parseInt(part, 10)); // Parse as integers
                                if (isNaN(hours)) hours = -1;
                                if (isNaN(minutes)) minutes = 0;
                                if (period === 'pm' && hours !== 12) {
                                    hours += 12; // Convert PM to 24-hour format
                                }
                                if (period === 'am' && hours === 12) {
                                    hours = 0; // Convert midnight (12 AM) to 00:00
                                }
                                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
                            };
                            const isTaken = allBookings && allBookings.some(
                                (booking) =>
                                    booking.status === 'Approved' &&
                                    booking.room_id === selectedRoom &&
                                    booking.date.split('T')[0] === selectedDate.split('T')[0] &&
                                    booking.start_time === convertTo24HourFormat(selectedTime)
                            );
                            return (
                                <div className="flex justify-end">
                                    <button
                                        className={`bg-${isTaken ? 'red' : 'blue'}-500 text-white p-2 rounded-full hover:bg-${isTaken ? 'red' : 'blue'}-400 m-4`}
                                        onClick={async () => {
                                            if (isTaken) {
                                                await updateBookingStatus(selectedBooking.booking_id, 'Declined');
                                                setSelectedTime("");
                                                await getBookingsByDate();
                                                await getBookingsForStudent();
                                            } else {
                                                handleButtonClick();
                                            }
                                        }}
                                    >
                                        {isTaken ? 'Delete' : 'Checkout'}
                                    </button>
                                </div>
                            );
                        })()}
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
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                            }}
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
                                                            <button className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-400" onClick={() => {removeRoom(room.room_id); getStudyRooms()}}>Remove Room</button>
                                                        </div>

                                                        <div className="w-full max-w-4xl mt-10 p-5">
                                                            <div className="flex overflow-x-auto space-x-2">
                                                                {Array.from({ length: 12 }, (_, i) => {
                                                                const hour = 8 + i;
                                                                const time = `${hour % 12 || 12}${hour < 12 ? 'am' : 'pm'}`;

                                                                const convertTo24HourFormat = (time : string) => {
                                                                    const [hourMin, period] = time.split(/(am|pm)/);
                                                                    let [hours, minutes] = hourMin.split(':').map((part) => parseInt(part, 10)); // Parse as integers
                                                                
                                                                    // Ensure that hours and minutes are valid numbers
                                                                    if (isNaN(hours)) hours = -1;
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

                                                                // Check if the current time slot is already taken
                                                                const isTaken = allBookings && allBookings.some(
                                                                    (booking) =>
                                                                    booking.status === 'Approved' &&
                                                                    booking.room_id === room.room_id &&
                                                                    booking.date.split('T')[0] === (selectedDate).split('T')[0] &&
                                                                    booking.start_time === convertTo24HourFormat(time)
                                                                );

                                                                return (
                                                                    <div
                                                                        key={i}
                                                                        className={`p-1 rounded-lg text-center text-sm min-w-[50px] cursor-pointer ${
                                                                            (selectedRoom === room.room_id && selectedTime === time)
                                                                            ? 'bg-yellow-500' // Highlight if selected
                                                                            : isTaken
                                                                            ? 'bg-red-500 text-white hover:bg-gray-300'
                                                                            : 'bg-green-500 text-white hover:bg-gray-300'
                                                                        }`}
                                                                        onClick={() => {
                                                                            setSelectedTime(time);
                                                                            setSelectedBuilding(room.location);
                                                                            setSelectedRoom(room.room_id);
                                                                            if (isTaken) {
                                                                                const takenBooking = allBookings.find(
                                                                                    (booking) =>
                                                                                        booking.status === 'Approved' &&
                                                                                        booking.room_id === room.room_id &&
                                                                                        booking.date.split('T')[0] === selectedDate.split('T')[0] &&
                                                                                        booking.start_time === convertTo24HourFormat(time)
                                                                                );
                                                                                setSelectedBooking(takenBooking || null);
                                                                            }
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
                <div className="fixed top-0 right-0 w-82 h-full bg-white shadow-lg z-50 p-5 overflow-y-auto">
                    <button
                        className="text-black font-bold text-lg mb-5"
                        onClick={() => setSidebarOpen(false)}
                    >
                        Close
                    </button>
                    <div className="flex flex-col items-center">
                        <Image
                            src="/roomylogo.png"
                            alt="Profile"
                            width={200}
                            height={100}
                        />
                        {/* Display dynamic user details */}
                        <h2 className="text-xl font-bold mt-3">
                            {currAdmin?.full_name || "Guest"}
                        </h2>
                        <p>ID: {currAdmin?.admin_id || "N/A"}</p>
                        <p>Email: {currAdmin?.email || "N/A"}</p>

                        {/* Logout Button */}
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg mt-5"
                            onClick={() => {
                                localStorage.removeItem('admin');
                                window.location.href = '/admin';
                            }}
                        > Logout </button>

                        {/* Update Password/Email */}
                        <div className="w-full max-w-4xl mt-10 bg-white p-5 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
                            <div className="mb-4">
                                <label className="block text-lg font-bold mb-2">Email:</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter new email"
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-lg font-bold mb-2">Password:</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter new password"
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                    }}
                                />
                            </div>
                            <button 
                                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-400"
                                onClick={() => changeEmailPassword()}
                            >
                                Update
                            </button>
                        </div>


                        <p className='mt-10 text-lg font-bold'>Old Bookings</p>
                        <ul>
                            {myBookings && myBookings
                                .filter(booking => new Date(booking.date) < new Date(new Date().toLocaleDateString('en-CA')))
                                .map((booking) => (
                                    <li
                                        key={booking.booking_id}
                                        className="flex justify-between items-center p-3 border-b border-gray-300"
                                    >
                                        <div>
                                            <span className='font-bold'>{studyRooms.find(room => room.room_id === booking.room_id)?.room_name}</span>
                                            <p>{(booking.date).split('T')[0]} {booking.start_time} - {booking.end_time}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-white ${
                                                booking.status === "Approved"
                                                    ? "bg-green-500"
                                                    : booking.status === "Declined"
                                                    ? "bg-red-500"
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

export default AdminDashboard;
