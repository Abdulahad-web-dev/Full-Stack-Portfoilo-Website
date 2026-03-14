const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    tags: {
        type: [String],
        default: [],
    },
    github: {
        type: String,
        default: '#',
    },
    demo: {
        type: String,
        default: '#',
    },
    color: {
        type: String,
        default: '#8B5CF6',
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
