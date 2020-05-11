const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', [
    auth,
    check('text', 'Text is required').not().isEmpty()
], async (req, res) =>{
    const errors =validationResult(req);
    if (!errors) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        const post = await new Post(newPost).save();

        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   Get api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const post = await Post.find().sort({ date: -1 });
        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   Get api/posts
// @desc    Get post by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(400).json({ msg: 'There is no post found'});
        }

        res.json(post);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') return res.status(400).json({ msg: 'There is no post found'});

        res.status(500).send('Server error');
    }
});

// @route   DELETE api/posts/:id
// @desc    Delete post by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post || post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized'});
        }

        await post.remove();
        res.json({ msg: 'Post removed' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') return res.status(400).json({ msg: 'There is no post found'});

        res.status(500).send('Server error');
    }
});

// @route   PUT api/posts/like/:id
// @desc    Like post by ID
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // post was liked?
        if (post && post.likes.filter(x => x.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked'});
        }

        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike post by ID
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // post was liked?
        if (post && post.likes.filter(x => x.user.toString() === req.user.id).length > 0) {
            // get index to remove
            const removeIndex = post.likes.map(x => x.user.toString()).indexOf(req.user.id);

            post.likes.splice(removeIndex, 1);
            await post.save();
            res.json(post);
        } else {
            return res.status(400).json({ msg: 'Post has not been liked'});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/posts/comment/:id
// @desc    Create a comment
// @access  Private
router.post('/comment/:id', [
    auth,
    check('text', 'Text is required').not().isEmpty()
], async (req, res) =>{
    const errors =validationResult(req);
    if (!errors) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);
        await post.save();
        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   Delete api/posts/comment/:id/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(x => x.id === req.params.comment_id);
        
        if (post && comment) {
            if (comment.user.toString() !== req.user.id) {
                res.status(401).json({ msg: 'User not authorized'});
            }

            const removeIndex = post.comments.map(x => x.user.toString()).indexOf(req.user.id);
            post.comments.splice(removeIndex, 1);

            await post.save();
            res.json(post.comments);
        } else {
            return res.status(400).json({ msg: 'comment not found'});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
