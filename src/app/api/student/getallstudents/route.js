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

        // Get all students from the database
        const [students] = await connection.execute('SELECT * FROM Students');
        

        // Close the connection
        await connection.end();

        // Return success response
        return new Response(JSON.stringify({ message: 'Created Student', students: students }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}
