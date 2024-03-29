const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const authMiddleware = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

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

// @route   POST api/profile
// @desc    Create or updatea user profile
// @access  Private
router.post(
    '/',
    [
        authMiddleware,
        [
            check('status', 'Status is required')
                .not()
                .isEmpty(),
            check('skills', 'Skills is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        // build profile object
        const profileFields = {};
        profileFields.user = req.user;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // Build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user });

            if (profile) {
                // update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user },
                    { $set: profileFields },
                    {
                        new: true
                    }
                );
            } else {
                // create
                profile = new Profile(profileFields);
                await profile.save();
            }

            return res.json(profile);
        } catch (e) {
            console.error(e.message);
            return res.status(500).send('Server error');
        }
    }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        return res.json(profiles);
    } catch (e) {
        console.error(e.message);
        return res.status(500).send('Server error');
    }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ message: 'There is no profile for this user' });
        }
        return res.json(profile);
    } catch (e) {
        console.error(e.message);
        if (e.kind === 'ObjectId') {
            return res.status(400).json({ message: 'There is no profile for this user' });
        }
        return res.status(500).send('Server error');
    }
});

// @route   DELETE api/profile
// @desc    Delete profile, user, posts
// @access  Private
router.delete('/', authMiddleware, async (req, res) => {
    try {
        // remove user posts
        await Post.deleteMany({ user: req.user });
        // remove profile
        await Profile.findOneAndRemove({ user: req.user });
        // remove user
        await User.findOneAndRemove({ _id: req.user });

        return res.json({ message: 'User deleted' });
    } catch (e) {
        console.error(e.message);
        return res.status(500).send('Server error');
    }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
    '/experience',
    [
        authMiddleware,
        [
            check('title', 'Title is required')
                .not()
                .isEmpty(),
            check('company', 'Company is required')
                .not()
                .isEmpty(),
            check('from', 'From date is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, company, location, from, to, current, description } = req.body;

        const newExp = { title, company, location, from, to, current, description };
        try {
            const profile = await Profile.findOne({ user: req.user });
            profile.experience.unshift(newExp);
            await profile.save();

            return res.json(profile);
        } catch (e) {
            console.error(e.message);
            return res.status(500).send('Server error');
        }
    }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', authMiddleware, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user });
        profile.experience = profile.experience.filter(p => p.id !== req.params.exp_id);
        await profile.save();

        return res.json(profile);
    } catch (e) {
        console.error(e.message);
        return res.status(500).send('Server error');
    }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
    '/education',
    [
        authMiddleware,
        [
            check('school', 'School is required')
                .not()
                .isEmpty(),
            check('degree', 'Degree is required')
                .not()
                .isEmpty(),
            check('fieldofstudy', 'Field of study is required')
                .not()
                .isEmpty(),
            check('from', 'From date is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { school, degree, fieldofstudy, from, to, current, description } = req.body;

        const newEdu = { school, degree, fieldofstudy, from, to, current, description };
        try {
            const profile = await Profile.findOne({ user: req.user });
            profile.education.unshift(newEdu);
            await profile.save();

            return res.json(profile);
        } catch (e) {
            console.error(e.message);
            return res.status(500).send('Server error');
        }
    }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', authMiddleware, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user });
        profile.education = profile.education.filter(p => p.id !== req.params.edu_id);
        await profile.save();

        return res.json(profile);
    } catch (e) {
        console.error(e.message);
        return res.status(500).send('Server error');
    }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from github
// @access  Public
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get(
                'githubSecret'
            )}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        request(options, (e, response, body) => {
            if (e) console.log(e);

            if (response.statusCode !== 200) {
                return res.status(404).json({ message: 'No github profile found' });
            }

            return res.json(JSON.parse(body));
        });
    } catch (e) {
        console.error(e.message);
        return res.status(500).send('Server error');
    }
});

module.exports = router;
