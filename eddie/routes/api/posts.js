const { Router } = require('express');
const router = Router();

// GET api/posts
// @access Public
router.get('/', (req, res) => res.send('Posts route is working'));

module.exports = router;
