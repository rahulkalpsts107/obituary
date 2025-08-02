require('dotenv').config();
const mongoose = require('mongoose');
const Obituary = require('../models/Obituary');

const sampleData = {
  name: "Athira Gowtham",
  dateOfBirth: new Date("1985-03-15"),
  dateOfPassing: new Date("2024-01-01"),
  biography: "A loving wife, mother, and friend to many. Athira lived her life with grace, kindness, and an unwavering commitment to her family and community. She touched the hearts of everyone she met with her warm smile and generous spirit.",
  survivedBy: [
    "Gowtham (Husband)",
    "Rahul (Son)", 
    "Priya (Daughter)",
    "Ramesh (Father)",
    "Lakshmi (Mother)"
  ],
  tribute: "Athira's legacy lives on in the countless lives she touched. Her love, wisdom, and compassion will be remembered forever. She was a beacon of light in our lives and will be deeply missed.",
  funeral: {
    venue: "St. Mary's Church",
    address: "123 Church Street, Kochi, Kerala, India",
    date: new Date("2024-01-05T10:00:00.000Z"),
    time: "10:00 AM",
    googleMapsUrl: "https://maps.google.com/?q=St+Mary's+Church+Kochi",
    liveStreamUrl: "https://youtube.com/watch?v=example"
  },
  photos: [],
  language: "english",
  isActive: true
};

async function insertData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const obituary = new Obituary(sampleData);
    await obituary.save();
    
    console.log('Sample obituary data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting data:', error);
    process.exit(1);
  }
}

insertData();
