const mongoose = require('mongoose');

const obituarySchema = new mongoose.Schema({
  name: {
    english: { type: String, required: true },
    malayalam: { type: String }
  },
  dateOfBirth: { type: Date, required: true },
  dateOfPassing: { type: Date, required: true },
  biography: {
    english: { type: String, required: true },
    malayalam: { type: String }
  },
  survivedBy: {
    english: [{ type: String }],
    malayalam: [{ type: String }]
  },
  tribute: {
    english: { type: String },
    malayalam: { type: String }
  },
  funeral: {
    venue: {
      english: { type: String, required: true },
      malayalam: { type: String }
    },
    address: {
      english: { type: String, required: true },
      malayalam: { type: String }
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    googleMapsUrl: { type: String },
    liveStreamUrl: { type: String }
  },
  photos: [{
    cloudinaryId: String,
    url: String,
    caption: {
      english: String,
      malayalam: String
    }
  }],
  language: { type: String, enum: ['english', 'malayalam'], default: 'english' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Obituary', obituarySchema);
