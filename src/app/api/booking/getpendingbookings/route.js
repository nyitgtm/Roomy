import mysql from 'mysql2/promise';

export async function POST(req, res) {
    try {
        // Create a new connection for the request
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Database28',
            database: 'Roomy',
        });

        let query = 'SELECT * FROM Bookings WHERE status="Pending"';
        const [result] = await connection.execute(query);


        await connection.end();
        
        return new Response(
            JSON.stringify({ message: 'Booking Retrieved', bookings: result }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ message: 'Try again later.' }), {
            status: 500,
        });
    }
}