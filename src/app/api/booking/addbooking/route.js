import mysql from 'mysql2/promise';

export async function POST(req, res) {
    try {
        // Parse request body
        const { reserverId, reserverType, roomId, date, startTime, endTime } = await req.json();

        if (!reserverId || !reserverType || !roomId || !date || !startTime || !endTime) {
            return new Response(JSON.stringify({ message: 'Invalid Data' }), {
                status: 400,
            });
        }

        // Create a new connection for the request
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Database28',
            database: 'Roomy',
        });

        console.log('Connected to MySQL');

        // Check if the student has an approved booking for the same day
        const [existingBookings] = await connection.execute(
            'SELECT * FROM Bookings WHERE reserver_id = ? AND reserver_type = ? AND date = ? AND status = "Approved"',
            [reserverId, reserverType, date]
        );

        // Check if there's an existing booking for the same room and time
        const [conflictingBookings] = await connection.execute(
            'SELECT * FROM Bookings WHERE room_id = ? AND date = ? AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?))',
            [roomId, date, endTime, startTime, startTime, endTime]
        );

        let status = 'Pending';

        // Logic for status determination
        if (existingBookings.length === 0) {
            // If no approved booking exists for the day, approve this one
            status = 'Approved';
        }

        if (conflictingBookings.length > 0) {
            const [conflict] = conflictingBookings;
            if (conflict.status === 'Pending') {
                // Decline the conflicting pending booking
                await connection.execute(
                    'UPDATE Bookings SET status = "Declined" WHERE booking_id = ?',
                    [conflict.booking_id]
                );

                // Approve this booking
                status = 'Approved';
            }
        }

        // Insert the new booking
        const [result] = await connection.execute(
            'INSERT INTO Bookings (reserver_id, reserver_type, room_id, date, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [reserverId, reserverType, roomId, date, startTime, endTime, status]
        );

        // Close the connection
        await connection.end();

        console.log('Booking created:', result);

        return new Response(
            JSON.stringify({ message: 'Booking created', bookingId: result.insertId, status }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}
