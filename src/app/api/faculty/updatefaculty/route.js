import mysql from 'mysql2/promise';

export async function POST(req, res) {
    try {
        // Parse request body
        const { facultyId, email, password } = await req.json();

        if (!facultyId) {
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

        let [rows] = [];

        if(email && password) {
            [rows] = await connection.execute(
                'UPDATE Faculty SET email = ?, password = ? WHERE faculty_id = ?',
                [email, password, facultyId]
            );
        } else if (email) {
            [rows] = await connection.execute(
                'UPDATE Faculty SET email = ? WHERE faculty_id = ?',
                [email, facultyId]
            );
        } else if (password) {
            [rows] = await connection.execute(
                'UPDATE Faculty SET password = ? WHERE faculty_id = ?',
                [password, facultyId]
            );
        }

        // Close the connection
        await connection.end();

        if (rows.length === 0) {
            return new Response(JSON.stringify({ message: 'Invalid Data' }), {
                status: 404,
            });
        }

        const admin = rows[0];

        // Return the authenticated user
        return new Response(JSON.stringify({ message: 'Successfully Updated', faculty: admin }), {
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