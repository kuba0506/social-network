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

// @route   PUT api/posts/:post_id
// @desc    Update a specific post
// @access  Private
router.put(
    '/:post_id',
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
            let post = await Post.findById(req.params.post_id);

            if (!post) return res.status(404).json({ message: 'Post not found' });
            // check if user can update a post
            if (req.user !== post.user.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            // update
            post = await Post.findOneAndUpdate(
                { user: req.user },
                { $set: req.body },
                {
                    new: true
                }
            );

            return res.json(post);
        } catch (e) {
            console.error(e.message);
            if (e.kind === 'ObjectId') return res.status(404).json({ message: 'Post not found' });
            return res.status(500).send('Server error');
        }
    }
);

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

// @route   PUT api/posts/like/:post_id
// @desc    Like a post
// @access  Private
router.put('/like/:post_id', authMIddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        // check if post has been already liked
        const likes = post.likes.filter(l => l.user.toString() === req.user).length;
        if (likes > 0) {
            return res.status(400).json({ message: 'Post already liked' });
        } else {
            post.likes.unshift({ user: req.user });
            await post.save();
            return res.json(post.likes);
        }
    } catch (e) {
        console.error(e.message);
        return res.status(500).send('Server error');
    }
});

// @route   PUT api/posts/unlike/:post_id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:post_id', authMIddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        // check if post has been already liked
        const likes = post.likes.filter(l => l.user.toString() === req.user).length;
        if (likes === 0) {
            return res.status(400).json({ message: 'Post has not been liked' });
        } else {
            post.likes = post.likes.filter(l => l.user.toString() !== req.user);
            await post.save();
            return res.json(post.likes);
        }
    } catch (e) {
        console.error(e.message);
        return res.status(500).send('Server error');
    }
});

// @route   POST api/posts/comment/:post_id
// @desc    Comment on a post
// @access  Private
router.post(
    '/comment/:post_id',
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
            if (!user) return res.status(404).json({ message: 'User not found' });

            const post = await Post.findById(req.params.post_id);
            if (!post) return res.status(404).json({ message: 'Post not found' });

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user
            };

            post.comments.unshift(newComment);
            await post.save();

            return res.json(post.comments);
        } catch (e) {
            console.error(e.message);
            return res.status(500).send('Server error');
        }
    }
);

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Delete comment from specific post
// @access  Private
router.delete('/comment/:post_id/:comment_id', authMIddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Pull out comment
        const comment = post.comments.find(c => c.id.toString() === req.params.comment_id);
        // Make sure comment exists
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // check if a user is an author of a comment
        if (comment.user.toString() !== req.user) {
            return res.status(401).json({ message: 'User is not authorized' });
        }

        // remove a comment
        post.comments = post.comments.filter(c => c.id.toString() !== comment.id.toString());
        await post.save();
        return res.json(post.comments);
    } catch (e) {
        console.error(e.message);
        return res.status(500).send('Server error');
    }
});

module.exports = router;
