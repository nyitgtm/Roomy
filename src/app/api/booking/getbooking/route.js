import mysql from 'mysql2/promise';

export async function POST(req, res) {
    try {
        // Parse request body
        const { reserverId, reserverType, date, roomId } = await req.json();

        if (!reserverId && !reserverType) {
            if (!date) {
                return new Response(JSON.stringify({ message: 'Invalid request' }), {
                    status: 400,
                });
            }
        }

        // Create a new connection for the request
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Database28',
            database: 'Roomy',
        });

        let query = 'SELECT * FROM Bookings WHERE ';
        let result;
        if (reserverId && reserverType) {
            query += 'reserver_id = ? AND reserver_type = ?';
            [result] = await connection.execute(query, [reserverId, reserverType]);
        } else if (date) {
            query += 'date = ?';
            const formattedDate = new Date(new Date(date).setDate(new Date(date).getDate() + 1)).toISOString().split('T')[0];
            [result] = await connection.execute(query, [formattedDate]);
        }

        // Close the connection
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