const { Router } = require('express');
const router = Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// GET api/profile/me
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'No profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// POST api/profile
// Create or update
// @access Private
router.post(
  '/',
  [
    auth,
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
      githubname,
      skills,
      facebook,
      linkedin
    } = req.body;

    // Buil profile obj
    const profileFileds = {};
    profileFileds.user = req.user.id;
    if (company) profileFileds.company = company;
    if (website) profileFileds.website = website;
    if (location) profileFileds.location = location;
    if (bio) profileFileds.bio = bio;
    if (status) profileFileds.status = status;
    if (githubname) profileFileds.githubname = githubname;
    if (skills) {
      profileFileds.skills = skills.split(',').map(skill => skill.trim());
    }
    console.log(profileFileds.skills);

    // Buil social obj
    profileFileds.social = {};
    if (facebook) profileFileds.social.facebook = facebook;
    if (linkedin) profileFileds.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFileds },
          { new: true }
        );
        console.log(profile);
        return res.json(profile);
      }
      console.log('create');

      //Create
      profile = new Profile(profileFileds);
      await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
