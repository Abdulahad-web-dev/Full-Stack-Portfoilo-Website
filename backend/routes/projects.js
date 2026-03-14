const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');

// GET all projects (public)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching projects' });
    }
});

// GET single project (public)
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST create project (protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, image, tags, github, demo, color, order } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const project = new Project({
            title,
            description,
            image: image || '',
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
            github: github || '#',
            demo: demo || '#',
            color: color || '#8B5CF6',
            order: order || 0,
        });

        const saved = await project.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: 'Server error creating project' });
    }
});

// PUT update project (protected)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, image, tags, github, demo, color, order } = req.body;

        const update = {
            title,
            description,
            image,
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
            github,
            demo,
            color,
            order,
        };

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: 'Server error updating project' });
    }
});

// DELETE project (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error deleting project' });
    }
});

module.exports = router;
