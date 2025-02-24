const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import models (to be created later)
const Project = require('./models/Project');
const VacationRequest = require('./models/VacationRequest');
const VacationAllowance = require('./models/VacationAllowance');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB (using environment variable MONGO_URI if set, or default to localhost)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hr_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// --- PROJECT ROUTES ---
// Get all projects
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().lean();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new project
app.post('/projects', async (req, res) => {
  try {
    const { name, schedule, dailyHours } = req.body;
    const project = new Project({ name, schedule, dailyHours });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a project
app.put('/projects/:id', async (req, res) => {
  try {
    const { name, schedule, dailyHours } = req.body;
    const project = await Project.findByIdAndUpdate(req.params.id, { name, schedule, dailyHours }, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a project
app.delete('/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- VACATION REQUEST ROUTES ---
// Create a new vacation request
app.post('/vacation-requests', async (req, res) => {
  try {
    const { userId, projectId, requestedHours } = req.body;
    // Validate the user's vacation allowance
    const allowance = await VacationAllowance.findOne({ userId, projectId });
    if (!allowance || allowance.remainingHours < requestedHours) {
      return res.status(400).json({ error: 'Insufficient vacation balance.' });
    }
    allowance.remainingHours -= requestedHours;
    await allowance.save();

    const vacationRequest = new VacationRequest({ userId, projectId, requestedHours });
    await vacationRequest.save();
    res.status(201).json(vacationRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all vacation requests (optional filtering can be added)
app.get('/vacation-requests', async (req, res) => {
  try {
    const requests = await VacationRequest.find().populate('userId projectId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
