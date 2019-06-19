const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ message: 'There is no profile for this user' });
        }

        return res.json(profile);
    } catch (e) {
        console.error(e.message);
        return res.status(500).send('Server error');
    }
});

module.exports = router;
