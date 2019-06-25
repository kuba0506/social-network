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

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', authMIddleware, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        return res.json(posts);
    } catch (e) {
        console.error(e.message);
        return res.status(500).send('Server error');
    }
});

// @route   GET api/posts/:post_id
// @desc    Get a specific post
// @access  Private
router.get('/:post_id', authMIddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        return res.json(post);
    } catch (e) {
        console.error(e.message);
        if (e.kind === 'ObjectId') return res.status(404).json({ message: 'Post not found' });
        return res.status(500).send('Server error');
    }
});

// @route   DELETE api/posts/:post_id
// @desc    Delete a post
// @access  Private
router.delete('/:post_id', authMIddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        // check user
        if (post.user.toString() !== req.user) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await post.remove();

        return res.json({ message: 'Post removed' });
    } catch (e) {
        console.error(e.message);
        if (e.kind === 'ObjectId') return res.status(404).json({ message: 'Post not found' });

        return res.status(500).send('Server error');
    }
});

module.exports = router;
