import mysql from 'mysql2/promise';

export async function POST(req, res) {
    try {
        // Parse request body
        const { studentId, email, password, fullName } = await req.json();

        if (!studentId || !email || !password || !fullName) {
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

        // Check if the studentId or email already exists in the database
        const [existingStudent] = await connection.execute(
            'SELECT * FROM Students WHERE student_id = ? OR email = ?',
            [studentId, email]
        );

        if (existingStudent.length > 0) {
            return new Response(JSON.stringify({ message: 'Student Exists' }), {
                status: 400,
            });
        }

        // Insert the new student into the database
        const [result] = await connection.execute(
            'INSERT INTO Students (student_id, email, password, full_name) VALUES (?, ?, ?, ?)',
            [studentId, email, password, fullName]
        );

        // Close the connection
        await connection.end();

        console.log('Student created:', result);

        // Return success response
        return new Response(JSON.stringify({ message: 'Created Student' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}
