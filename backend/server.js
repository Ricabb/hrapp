const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const Project = require('./models/Project');
const VacationRequest = require('./models/VacationRequest');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hr_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Projects routes
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().lean();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/projects', async (req, res) => {
  try {
    const { name, schedule } = req.body;
    const project = new Project({ name, schedule });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/projects/:id', async (req, res) => {
  try {
    const { name, schedule } = req.body;
    const project = await Project.findByIdAndUpdate(req.params.id, { name, schedule }, { new: true });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vacation requests routes
app.get('/vacation-requests', async (req, res) => {
  try {
    const query = {};
    if (req.query.projectId) {
      query.projectId = req.query.projectId;
    }
    const requests = await VacationRequest.find(query).lean();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/vacation-requests', async (req, res) => {
  try {
    const { userId, projectId, requestedHours, date } = req.body;
    const vacationRequest = new VacationRequest({ userId, projectId, requestedHours, date });
    await vacationRequest.save();
    res.status(201).json(vacationRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/vacation-requests/:id', async (req, res) => {
  try {
    const { status, approverName } = req.body;
    const vacationRequest = await VacationRequest.findByIdAndUpdate(req.params.id, { status, approverName }, { new: true });
    if (!vacationRequest) return res.status(404).json({ error: "Vacation request not found" });
    res.json(vacationRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
