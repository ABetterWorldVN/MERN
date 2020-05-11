const mongoose = require('mongoose');
const mongooseSchema = mongoose.Schema;

const PostSchema = new mongooseSchema({
    user: {
        type: mongooseSchema.Types.ObjectId,
        ref: 'users'
    },
    text : { type: String, required: true },
    name : { type: String },
    avatar : { type: String },
    likes: [
        {
            user: {
                type: mongooseSchema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: mongooseSchema.Types.ObjectId,
                ref: 'users'
            },
            text : { type: String, required: true },
            name : { type: String },
            avatar : { type: String }
        }
    ],
    date: { type: Date, default: Date.now }
});

module.exports = Post = mongoose.model('post', PostSchema);