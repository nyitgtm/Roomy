import mysql from 'mysql2/promise';

export async function POST(req) {
    try {
       // Parse request body (req.body in Next.js API routes)
       const { studentId, newStatus } = await req.json();

       if (!studentId) {
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

        // Update the student's is_banned status in the database
        await connection.execute(
            'UPDATE Students SET is_banned = ? WHERE student_id = ?',
            [newStatus, studentId]
        );

        // Close the connection
        await connection.end();

        // Return success response
        return new Response(JSON.stringify({ message: 'Updated Student' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}