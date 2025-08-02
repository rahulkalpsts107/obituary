const mongoose = require('mongoose');

const condolenceSchema = new mongoose.Schema({
  obituaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Obituary', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  isApproved: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Condolence', condolenceSchema);
