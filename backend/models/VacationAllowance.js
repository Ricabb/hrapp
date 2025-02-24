const mongoose = require('mongoose');

const VacationAllowanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  remainingHours: { type: Number, default: 0 }
});

module.exports = mongoose.model('VacationAllowance', VacationAllowanceSchema);
