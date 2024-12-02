import mysql from 'mysql2/promise';

export async function POST(req, res) {
    try {
        // Parse request body
        const { studentId, password } = await req.json();

        if (!studentId || !password) {
            return res.status(400).json({ error: 'Missing studentId or password' });
        }

        // Create a new connection for the request
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Database28',
            database: 'Roomy',
        });

        console.log('Connected to MySQL');

        // Execute query
        const [rows] = await connection.execute(
            'SELECT * FROM Students WHERE student_id = ? AND password = ?',
            [studentId, password]
        );

        // Close the connection
        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Student not found or incorrect password' });
        }

        const student = rows[0];
        console.log('Student found:', student);

        // Return the authenticated user
        return new Response(JSON.stringify({ message: 'Succesfully logged in' }), {
            status: 200,
            student
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}
