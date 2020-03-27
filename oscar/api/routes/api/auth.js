const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET api/
// @desc    authentication
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

router.post('/', [
    check('email', 'Enter an valid email').isEmail(),
    check('password', 'Password is required').exists()]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        console.log(req.body);
        const { email, password } = req.body;

        // check if user exists
        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400)
                 .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            // verify password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400)
                 .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload, 
                config.get('jwtToken'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) {
                        throw err;
                    }
                    return res.json({ token })
                });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    });

module.exports = router;
