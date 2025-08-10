import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Issue } from '../models/Issue.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

const createIssueSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  category: z.string().min(2).max(50),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().optional().default(''),
  subCity: z.string().optional().default(''),
  woreda: z.string().optional().default(''),
  deviceId: z.string().min(6).max(64),
});

// GET /api/issues
router.get('/', async (req, res, next) => {
  try {
    const { status, category, subCity, q, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (subCity) filter.subCity = subCity;
    if (q) filter.$text = { $search: q };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Issue.find(filter)
        .sort({ upvotes: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Issue.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
});

// GET /api/issues/near?lat=..&lng=..&radiusKm=..
router.get('/near', async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusKm = Number(req.query.radiusKm || 5);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }
    const meters = radiusKm * 1000;
    const items = await Issue.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: meters,
        },
      },
    })
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ items });
  } catch (err) {
    next(err);
  }
});

// GET /api/issues/:id
router.get('/:id', async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    next(err);
  }
});

// POST /api/issues
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const parsed = createIssueSchema.safeParse({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      lat: Number(req.body.lat),
      lng: Number(req.body.lng),
      address: req.body.address || '',
      subCity: req.body.subCity || '',
      woreda: req.body.woreda || '',
      deviceId: req.body.deviceId,
    });

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    let imageUrl = '';
    let imagePublicId = '';
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, {
        folder: 'fixmyhood/issues',
        transformation: [{ width: 1600, height: 1600, crop: 'limit' }],
      });
      imageUrl = uploadRes.secure_url;
      imagePublicId = uploadRes.public_id;
    }

    const issue = await Issue.create({
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      city: 'Addis Ababa',
      subCity: parsed.data.subCity,
      woreda: parsed.data.woreda,
      address: parsed.data.address,
      location: { type: 'Point', coordinates: [parsed.data.lng, parsed.data.lat] },
      imageUrl,
      imagePublicId,
      upvotes: 1,
      upvoters: [parsed.data.deviceId],
    });

    res.status(201).json(issue);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/issues/:id/status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['open', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    next(err);
  }
});

// POST /api/issues/:id/upvote
router.post('/:id/upvote', async (req, res, next) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId) return res.status(400).json({ error: 'deviceId required' });
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    if (issue.upvoters.includes(deviceId)) {
      return res.json({ upvotes: issue.upvotes, alreadyUpvoted: true });
    }
    issue.upvoters.push(deviceId);
    issue.upvotes += 1;
    await issue.save();
    res.json({ upvotes: issue.upvotes, alreadyUpvoted: false });
  } catch (err) {
    next(err);
  }
});

// POST /api/issues/:id/comments
router.post('/:id/comments', async (req, res, next) => {
  try {
    const { deviceId, name, text } = req.body;
    if (!deviceId || !text) return res.status(400).json({ error: 'deviceId and text required' });
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    issue.comments.push({ deviceId, name: name || 'Resident', text });
    await issue.save();
    res.status(201).json(issue.comments[issue.comments.length - 1]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/issues/:id (optional cleanup, not linked in UI)
router.delete('/:id', async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    if (issue.imagePublicId) {
      await deleteFromCloudinary(issue.imagePublicId);
    }
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;