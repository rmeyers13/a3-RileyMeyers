const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    try {
        let user = await User.findOne({ username });

        if (!user) {
            user = new User({
                username,
                password: password
            });
            await user.save();

            req.session.user = { username };
            return res.json({
                success: true,
                message: 'Account created successfully!',
                isNewUser: true
            });
        }

        const isValidPassword = await user.correctPassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        req.session.user = { username };
        res.json({
            success: true,
            message: 'Login successful!',
            isNewUser: false
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        });
    }
});

module.exports = router;