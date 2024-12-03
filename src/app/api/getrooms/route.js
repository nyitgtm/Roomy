import mysql from 'mysql2/promise';

export async function POST() {
    try {
        // Create a new connection for the request
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Database28',
            database: 'Roomy',
        });

        console.log('Connected to MySQL');

        // Get the study rooms from the database
        const [studyRooms] = await connection.execute(
            'SELECT * FROM StudyRooms'
        );

        // Close the connection
        await connection.end();

        if (studyRooms.length === 0) {
            return new Response(JSON.stringify({ message: 'No Study Rooms Found' }), {
                status: 404,
            });
        }

        // Return success response with study rooms data
        return new Response(JSON.stringify({ message: 'Study Rooms Retrieved', studyRooms: studyRooms }), {
            status: 200
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}