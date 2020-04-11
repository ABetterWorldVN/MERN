const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Enter an valid email').isEmail(),
    check('password', 'Password should be 6 or more characters')
        .isLength({ min: 6 })]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        console.log(req.body);
        const { name, email, password } = req.body;

        // check if user exists
        try {
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already existed' }] });
            }

            // get gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            // encrypt password
            const salt = await bcrypt.genSalt(10);
            const hashedPw = await bcrypt.hash(password, salt);

            user = new User({
                name,
                email,
                avatar,
                password: hashedPw
            });
            // return jsonwebtoken

            await user.save();

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
