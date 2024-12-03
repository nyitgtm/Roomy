import mysql from 'mysql2/promise';

export async function POST(req) {
    try {
        const { room_id } = await req.json();

        // Create a new connection for the request
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Database28',
            database: 'Roomy',
        });

        console.log('Connected to MySQL');

        // Make query to delete bookings with room_id
        await connection.execute(
            'DELETE FROM Bookings WHERE room_id = ?',
            [room_id]
        );
        // Make query to add study room
        await connection.execute(
            'DELETE FROM StudyRooms WHERE room_id = ?',
            [room_id]
        );

        // Close the connection
        await connection.end();

        // Return success response with study rooms data
        return new Response(JSON.stringify({ message: 'Study Room Removed' }), {
            status: 200
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}