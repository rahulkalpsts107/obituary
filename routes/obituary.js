const express = require('express');
const router = express.Router();
const Obituary = require('../models/Obituary');
const Condolence = require('../models/Condolence');
const { getContent } = require('../utils/content');
const cloudinary = require('cloudinary').v2;

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to get content in the selected language
function getLocalizedContent(obituaryField, language) {
  if (typeof obituaryField === 'object' && obituaryField !== null) {
    return obituaryField[language] || obituaryField.english || obituaryField;
  }
  return obituaryField;
}

// Home page - display obituary
router.get('/', async (req, res) => {
  try {
    const obituary = await Obituary.findOne({ isActive: true });
    
    if (!obituary) {
      const content = getContent('english');
      return res.render('setup', { content });
    }
    
    console.log('Active obituary found:', {
      _id: obituary._id,
      name: obituary.name,
      isActive: obituary.isActive
    });
    
    // Debug: Check all condolences in the database
    const allCondolencesInDb = await Condolence.find({});
    console.log(`Total condolences in database: ${allCondolencesInDb.length}`);
    
    if (allCondolencesInDb.length > 0) {
      console.log('All condolences obituaryIds:', allCondolencesInDb.map(c => ({
        condolenceId: c._id,
        obituaryId: c.obituaryId,
        obituaryIdType: typeof c.obituaryId,
        name: c.name,
        isApproved: c.isApproved
      })));
    }
    
    // Debug: Check all condolences for this obituary
    const allCondolences = await Condolence.find({ obituaryId: obituary._id });
    console.log(`Total condolences for obituary ${obituary._id}:`, allCondolences.length);
    
    // Try multiple approaches to find condolences
    let condolences = await Condolence.find({ 
      obituaryId: obituary._id,
      isApproved: true
    }).sort({ createdAt: -1 });
    
    // If no results, try with string conversion
    if (condolences.length === 0) {
      condolences = await Condolence.find({ 
        obituaryId: obituary._id.toString(),
        isApproved: true
      }).sort({ createdAt: -1 });
      console.log(`Found ${condolences.length} approved condolences using string ID`);
    }
    
    // If still no results, try without approval filter to see if that's the issue
    if (condolences.length === 0) {
      condolences = await Condolence.find({ 
        obituaryId: obituary._id
      }).sort({ createdAt: -1 });
      console.log(`Found ${condolences.length} condolences (ignoring approval status)`);
    }
    
    console.log(`Final result: ${condolences.length} condolences for display`);
    
    const language = req.query.lang || 'english';
    const content = getContent(language);
    
    // Create localized obituary object
    const localizedObituary = {
      ...obituary.toObject(),
      name: getLocalizedContent(obituary.name, language),
      biography: getLocalizedContent(obituary.biography, language),
      survivedBy: getLocalizedContent(obituary.survivedBy, language),
      tribute: getLocalizedContent(obituary.tribute, language),
      funeral: {
        ...obituary.funeral,
        venue: getLocalizedContent(obituary.funeral.venue, language),
        address: getLocalizedContent(obituary.funeral.address, language)
      }
    };
    
    res.render('index', { obituary: localizedObituary, condolences, content, currentLang: language });
  } catch (error) {
    console.error('Error loading obituary:', error);
    res.status(500).render('error', { message: 'Unable to load obituary' });
  }
});

// Funeral details page
router.get('/funeral', async (req, res) => {
  try {
    const obituary = await Obituary.findOne({ isActive: true });
    const language = req.query.lang || 'english';
    const content = getContent(language);
    
    const localizedObituary = {
      ...obituary.toObject(),
      name: getLocalizedContent(obituary.name, language),
      funeral: {
        ...obituary.funeral,
        venue: getLocalizedContent(obituary.funeral.venue, language),
        address: getLocalizedContent(obituary.funeral.address, language)
      }
    };
    
    res.render('funeral', { obituary: localizedObituary, content, currentLang: language });
  } catch (error) {
    res.status(500).render('error', { message: 'Unable to load funeral details' });
  }
});

// Debug route to see available folders
router.get('/debug-folders', async (req, res) => {
  try {
    const result = await cloudinary.api.root_folders();
    res.json({ folders: result.folders });
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.json({ error: error.message });
  }
});

// Debug route to see all resources
router.get('/debug-resources', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 50
    });
    res.json({ resources: result.resources.map(r => r.public_id) });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.json({ error: error.message });
  }
});

// Debug route to see all condolences
router.get('/debug-condolences', async (req, res) => {
  try {
    const allCondolences = await Condolence.find({});
    const obituaries = await Obituary.find({});
    
    res.json({ 
      condolences: allCondolences.map(c => ({
        _id: c._id,
        name: c.name,
        obituaryId: c.obituaryId,
        obituaryIdType: typeof c.obituaryId,
        isApproved: c.isApproved,
        createdAt: c.createdAt
      })),
      obituaries: obituaries.map(o => ({
        _id: o._id,
        name: o.name,
        isActive: o.isActive
      }))
    });
  } catch (error) {
    console.error('Error fetching debug info:', error);
    res.json({ error: error.message });
  }
});

// Photos gallery page
router.get('/photos', async (req, res) => {
  try {
    const obituary = await Obituary.findOne({ isActive: true });
    const language = req.query.lang || 'english';
    const content = getContent(language);
    
    // Load ALL photos for slideshow (no pagination)
    let searchQuery = cloudinary.search
      .expression('folder:obit-project/family-photos/')
      .sort_by('created_at', 'desc')
      .max_results(100);
    
    // Execute search
    const result = await searchQuery.execute();
    
    const photos = result.resources.map((resource, index) => ({
      url: resource.secure_url,
      public_id: resource.public_id,
      width: resource.width,
      height: resource.height,
      position: index + 1
    }));
    
    const totalPhotos = photos.length;
    
    const pagination = {
      totalPhotos: totalPhotos
    };
    
    // Localize photo captions
    const localizedPhotos = photos.map(photo => {
      const originalPhoto = obituary.photos ? obituary.photos.find(p => p.url === photo.url) : null;
      return {
        ...photo,
        caption: originalPhoto ? getLocalizedContent(originalPhoto.caption, language) : `Photo ${photo.position}`
      };
    });
    
    const localizedObituary = {
      ...obituary.toObject(),
      name: getLocalizedContent(obituary.name, language)
    };
    
    console.log(`Found ${totalPhotos} photos for slideshow`);
    res.render('photos', { obituary: localizedObituary, content, currentLang: language, photos: localizedPhotos, pagination });
  } catch (error) {
    console.error('Error loading photos:', error);
    res.status(500).render('error', { message: 'Unable to load photos' });
  }
});

module.exports = router;
