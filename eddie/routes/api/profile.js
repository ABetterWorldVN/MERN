const { Router } = require('express');
const router = Router();

// GET api/profile
// @access Public
router.get('/', (req, res) => res.send('Profile route is working'));

module.exports = router;
