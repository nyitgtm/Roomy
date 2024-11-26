const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const router = express.Router();

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'Roomy'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Route to authenticate student
router.post('/authenticate', (req, res) => {
    const { studentId, password } = req.body;

    // Check if student exists
    const query = 'SELECT * FROM Students WHERE student_id = ?';
    db.query(query, [studentId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const student = results[0];

        // Compare the password
        bcrypt.compare(password, student.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            // Authentication successful
            res.status(200).json({ message: 'Authentication successful', student });
        });
    });
});

module.exports = router;