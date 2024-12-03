import mysql from 'mysql2/promise';

export async function POST(req) {
    try {
        // Parse request body
        const { bookingId, newStatus } = await req.json();

        if (!bookingId || !newStatus) {
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


        // Check if the student has an approved booking for the same day
        const [existingBookings] = await connection.execute(
            'SELECT * FROM Bookings WHERE booking_id = ?',
            [bookingId]
        );

        if (existingBookings.length === 0) {
            return new Response(JSON.stringify({ message: 'Booking not found' }), {
            status: 404,
            });
        }

        await connection.execute(
            'UPDATE Bookings SET status = ? WHERE booking_id = ?',
            [newStatus, bookingId]
        );

        return new Response(
            JSON.stringify({ message: 'Booking updated'}),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}
