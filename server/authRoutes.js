const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const {  db ,poolPromise } = require('./db');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const sessionSecret = uuidv4();
console.log(sessionSecret);

router.use(express.json());
router.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
}));

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const pool = await poolPromise; // Wait for the pool to be available

      
        const result = await pool.request()
            .input('email', email)
            .input('password', hashedPassword)
            .query('INSERT INTO users (email, password) OUTPUT INSERTED.id AS userId VALUES (@email, @password)');

        const userId = result.recordset[0].userId;

        req.session.userId = userId;
        res.status(200).json({ message: 'User created', userId });
    } catch (error) {
        console.error('Error creating user:', error); // Log the exact error
        res.status(400).send(`Error creating user: ${error.message}`);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await poolPromise;  // Wait for the pool to be available
        const result = await pool.request().query(`SELECT * FROM users WHERE email = '${email}'`);
        const user = result.recordset[0];
    
        if (user) {
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                req.session.userId = user.id;
                res.status(200).json({ message: 'Login successful', userId: user.id });
            } else {
                res.status(400).send('Invalid password');
            }
        } else {
            res.status(400).send('User not found');
        }
    } catch (error) {
        console.error('Error logging in:', error); // Log the exact error
        res.status(500).send(`Error logging in: ${error.message}`);
    }
});




module.exports = router;
