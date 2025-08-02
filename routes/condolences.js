const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Condolence = require('../models/Condolence');
const Obituary = require('../models/Obituary');
const emailService = require('../utils/emailService');

// Submit condolence
router.post('/submit', [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('message').trim().isLength({ min: 5 }).withMessage('Message must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        error: 'Please check your input: ' + errors.array().map(err => err.msg).join(', '),
        details: errors.array()
      });
    }

    const obituary = await Obituary.findOne({ isActive: true });
    if (!obituary) {
      return res.status(404).json({ error: 'No active obituary found' });
    }

    console.log('Creating condolence with data:', {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message.substring(0, 50) + '...'
    });

    const condolence = new Condolence({
      obituaryId: obituary._id,
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      isApproved: true
    });

    await condolence.save();
    console.log('Condolence saved successfully');
    
    // Send email notifications
    try {
      await emailService.notifyAdmin(condolence, obituary);
      await emailService.confirmSubmission(condolence, obituary);
      console.log('Emails sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.json({ success: true, message: 'Condolence submitted successfully' });
  } catch (error) {
    console.error('Condolence submission error:', error);
    res.status(500).json({ error: 'Unable to submit condolence: ' + error.message });
  }
});

// Admin route to approve condolences (optional)
router.post('/approve/:id', async (req, res) => {
  try {
    await Condolence.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ success: true, message: 'Condolence approved' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to approve condolence' });
  }
});

module.exports = router;
