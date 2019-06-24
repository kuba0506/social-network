const express = require('express');
const router = express.Router();
const authMIddleware = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', authMIddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');
        return res.json(user);
    } catch (e) {
        console.error(e.message);
        return res.status(500).send('Server error');
    }
});

// @route   POST api/auth
// @desc    Log in, authnticate user and get token
// @access  Public
router.post(
    '/',
    [check('email', 'Please include a valid email.').isEmail(), check('password', 'Password is required.').exists()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { password, email } = req.body;

        try {
            // See if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ message: 'Invalid credentials.' }] });
            }

            // compare passwords
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ message: 'Invalid credentials.' }] });
            }

            // Return JWT
            const payload = {
                user: user.id
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {
                    expiresIn: 360000 // prod 3600
                },
                (e, token) => {
                    if (e) throw e;
                    return res.json({ token });
                }
            );
        } catch (e) {
            console.error(e.message);
            return res.status(500).send('Server error');
        }
    }
);

module.exports = router;
