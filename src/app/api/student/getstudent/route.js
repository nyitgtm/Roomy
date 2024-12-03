import mysql from 'mysql2/promise';

export async function POST(req, res) {
    try {
        // Parse request body
        const { studentId } = await req.json();

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

        console.log('Connected to MySQL');

        // Get the student by ID from the database
        const [student] = await connection.execute(
            'SELECT * FROM Students WHERE student_id = ?',
            [studentId]
        );

        // Close the connection
        await connection.end();

        if (student.length === 0) {
            return new Response(JSON.stringify({ message: 'Student Not Found' }), {
                status: 404,
            });
        }

        // Return success response with student data
        return new Response(JSON.stringify({ message: 'Succesfully logged in', student: student }), {
            status: 200
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}
