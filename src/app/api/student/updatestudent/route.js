import mysql from 'mysql2/promise';

export async function POST(req, res) {
    try {
        // Parse request body
        const { studentId, email, password } = await req.json();

        if (!studentId) {
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

        // Update the Admins table
        let [rows] = [];

        if(email && password) {
            [rows] = await connection.execute(
                'UPDATE Students SET email = ?, password = ? WHERE student_id = ?',
                [email, password, studentId]
            );
        } else if (email) {
            [rows] = await connection.execute(
                'UPDATE Students SET email = ? WHERE student_id = ?',
                [email, studentId]
            );
        } else if (password) {
            [rows] = await connection.execute(
                'UPDATE Students SET password = ? WHERE student_id = ?',
                [password, studentId]
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
        return new Response(JSON.stringify({ message: 'Successfully Updated', student: admin }), {
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