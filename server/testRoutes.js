const {  poolPromise } = require('./db');
const express = require('express');
const router = express.Router(); // Create a router instance


// Fetch questions
router.get('/questions', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT TOP 10 * FROM questions');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).send('Error fetching questions');
    }
});


router.get('/categories', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM categories');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Error fetching categories');
    }
});

// Save test results
router.post('/results', async (req, res) => {
    const { totalGrade, userId } = req.body;

    if (!userId) {
        return res.status(401).send('User not authenticated');
    }

    const timestamp = new Date();

    try {
        const pool = await poolPromise;
        const request = pool.request();

        // Convert totalGrade to an integer
        const grade = parseInt(totalGrade);

        // Insert the result
        await request.query(`
            INSERT INTO results (user_id, timestamp, result) 
            VALUES ('${String(userId)}', '${timestamp.toISOString()}', ${grade})
        `);

        res.status(201).send('Results saved');
    } catch (error) {
        console.error('Error saving results:', error);
        res.status(500).send('Error saving results');
    }
});




module.exports = router;
