import mysql from 'mysql2/promise';

export async function POST(req, res) {
    try {
        // Parse request body
        const { facultyId } = await req.json();

        if (!facultyId) {
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

        // Get the student by ID from the database
        const [faculty] = await connection.execute(
            'SELECT * FROM Faculty WHERE faculty_id = ?',
            [facultyId]
        );

        // Close the connection
        await connection.end();

        if (faculty.length === 0) {
            return new Response(JSON.stringify({ message: 'Faculty Not Found' }), {
                status: 404,
            });
        }

        // Return success response with student data
        return new Response(JSON.stringify({ message: 'Succesfully logged in', faculty: faculty }), {
            status: 200
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}
