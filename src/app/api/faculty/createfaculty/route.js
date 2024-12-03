import mysql from 'mysql2/promise';

export async function POST(req, res) {
    try {
        // Parse request body
        const { email, password, full_name } = await req.json();

        if (!email || !password || !full_name) {
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

        const [result] = await connection.execute(
            `INSERT INTO Faculty (email, password, full_name) VALUES (?, ?, ?)`,
            [email, password, full_name]
        );

        // Close the connection
        await connection.end();

        // Return the authenticated user
        return new Response(JSON.stringify({ message: 'Successfully Created'}), {
            status: 200,
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}