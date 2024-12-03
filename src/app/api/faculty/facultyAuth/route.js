import mysql from 'mysql2/promise';

export async function POST(req, res) {
    try {
        // Parse request body
        const { facultyId, password } = await req.json();

        if (!facultyId || !password) {
            return res.status(400).json({ error: 'Missing facultyId or password' });
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
            'SELECT * FROM Faculty WHERE faculty_id = ? AND password = ?',
            [facultyId, password]
        );

        // Close the connection
        await connection.end();

        if (rows.length === 0) {
            return new Response(JSON.stringify({ message: 'Invalid Data' }), {
                status: 404,
            });
        }

        const faculty = rows[0];
        console.log('Faculty found:', faculty);

        // Return the authenticated user
        return new Response(JSON.stringify({ message: 'Successfully logged in', faculty: faculty }), {
            status: 200
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}