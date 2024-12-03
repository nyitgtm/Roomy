import mysql from 'mysql2/promise';

export async function POST(req) {
    try {
        const { location, room_name, capacity } = await req.json();

        // Create a new connection for the request
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Database28',
            database: 'Roomy',
        });

        console.log('Connected to MySQL');

        // Make query to add study room
        await connection.execute(
            'INSERT INTO StudyRooms (location, room_name, capacity) VALUES (?, ?, ?)',
            [location, room_name, capacity]
        );

        // Close the connection
        await connection.end();

        // Return success response with study rooms data
        return new Response(JSON.stringify({ message: 'Study Room Added' }), {
            status: 200
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}