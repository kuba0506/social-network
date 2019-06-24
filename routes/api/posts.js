const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const authMIddleware = require('../../middleware/auth');

const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
    '/',
    [
        authMIddleware,
        [
            check('text', 'Text is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        try {
            const user = await User.findById(req.user).select('-password');
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user
            });

            await newPost.save();

            return res.json(newPost);
        } catch (e) {
            console.error(e.message);
            return res.status(500).send('Server error');
        }
    }
);

module.exports = router;
