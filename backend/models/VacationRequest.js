const mongoose = require('mongoose');

const VacationRequestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  projectId: { type: String, required: true },
  requestedHours: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  date: { type: Date, required: true }, // Expected format from frontend: "YYYY-MM-DD"
  requestDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VacationRequest', VacationRequestSchema);
