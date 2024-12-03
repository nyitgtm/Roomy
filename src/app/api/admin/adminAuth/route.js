import mysql from 'mysql2/promise';

export async function POST(req, res) {
    try {
        // Parse request body
        const { adminId, password } = await req.json();

        if (!adminId || !password) {
            return new Response(JSON.stringify({ message: 'Invalid Parameters' }), {
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

        // Execute query
        const [rows] = await connection.execute(
            'SELECT * FROM Admins WHERE admin_id = ? AND password = ?',
            [adminId, password]
        );

        // Close the connection
        await connection.end();

        if (rows.length === 0) {
            return new Response(JSON.stringify({ message: 'Invalid Data' }), {
                status: 404,
            });
        }

        const admin = rows[0];

        // Return the authenticated user
        return new Response(JSON.stringify({ message: 'Successfully logged in', admin: admin }), {
            status: 200,
            admin
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}