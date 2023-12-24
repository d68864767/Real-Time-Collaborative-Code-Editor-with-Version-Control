```javascript
// Import required modules
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Project = require('./projectModel');
const User = require('./userModel');

// Route to create a new project
router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const newProject = new Project({
      name: req.body.name,
      owner: req.user.id,
      collaborators: [req.user.id],
      files: [],
      chat: []
    });

    const project = await newProject.save();

    // Add the project to the user's projects
    req.user.projects.push(project.id);
    await req.user.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get a project by ID
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner').populate('collaborators');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.collaborators.includes(req.user.id)) {
      return res.status(403).json({ error: 'You do not have access to this project' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to update a project
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to update this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to delete a project
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);

    // Remove the project from the user's projects
    req.user.projects = req.user.projects.filter(projectId => projectId.toString() !== req.params.id);
    await req.user.save();

    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```
