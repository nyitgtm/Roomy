CREATE DATABASE Roomy;
USE Roomy;


CREATE TABLE Students (
    student_id INT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_banned BOOLEAN DEFAULT FALSE
);

--  Faculty Table
CREATE TABLE Faculty (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL
);

--  Admins Table
CREATE TABLE Admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL
);

-- StudyRooms Table
CREATE TABLE StudyRooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    room_name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
);

--  Bookings Table
CREATE TABLE Bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    reserver_id INT NOT NULL,
    reserver_type ENUM('Student', 'Faculty', 'Admin') NOT NULL,
    room_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('Pending', 'Approved', 'Declined') DEFAULT 'Pending',
    approved_by ENUM('Faculty', 'Admin'),
    FOREIGN KEY (reserver_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (reserver_id) REFERENCES Faculty(faculty_id) ON DELETE CASCADE,
    FOREIGN KEY (reserver_id) REFERENCES Admins(admin_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES StudyRooms(room_id) ON DELETE CASCADE
);

