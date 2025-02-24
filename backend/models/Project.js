const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  schedule: {
    Monday: { type: [Number], default: [] },
    Tuesday: { type: [Number], default: [] },
    Wednesday: { type: [Number], default: [] },
    Thursday: { type: [Number], default: [] },
    Friday: { type: [Number], default: [] },
    Saturday: { type: [Number], default: [] },
    Sunday: { type: [Number], default: [] }
  }
});

// Virtual to compute total weekly hours from the schedule
ProjectSchema.virtual('totalWeeklyHours').get(function () {
  let total = 0;
  for (const day in this.schedule) {
    total += this.schedule[day].length;
  }
  return total;
});

// Include virtuals when converting to JSON/Object
ProjectSchema.set('toJSON', { virtuals: true });
ProjectSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Project', ProjectSchema);
