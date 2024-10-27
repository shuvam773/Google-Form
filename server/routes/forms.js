import express from 'express';
import Form from '../models/Form.js';
import Response from '../models/Response.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all forms for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const forms = await Form.find({ creator: req.user.userId });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forms' });
  }
});

// Create a new form
router.post('/', auth, async (req, res) => {
  try {
    const form = new Form({
      ...req.body,
      creator: req.user.userId
    });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: 'Error creating form' });
  }
});

// Update a form
router.put('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOneAndUpdate(
      { _id: req.params.id, creator: req.user.userId },
      req.body,
      { new: true }
    );
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Error updating form' });
  }
});

// Delete a form
router.delete('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({
      _id: req.params.id,
      creator: req.user.userId
    });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    await Response.deleteMany({ form: req.params.id });
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting form' });
  }
});

// Submit a form response
router.post('/:id/submit', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const response = new Response({
      form: form._id,
      answers: req.body.answers,
      respondent: req.user?.userId
    });
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting response' });
  }
});

// Get form responses
router.get('/:id/responses', auth, async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id,
      creator: req.user.userId
    });
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const responses = await Response.find({ form: req.params.id })
      .populate('respondent', 'name email');
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching responses' });
  }
});

export default router;