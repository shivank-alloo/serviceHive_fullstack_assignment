import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 150 }).withMessage('Name must be 2-150 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['new', 'contacted', 'qualified', 'lost'])
    .withMessage('Status must be: new, contacted, qualified, or lost'),
  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(['website', 'instagram', 'referral'])
    .withMessage('Source must be: website, instagram, or referral'),
];

const updateLeadValidation = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 }).withMessage('Name must be 2-150 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'lost'])
    .withMessage('Status must be: new, contacted, qualified, or lost'),
  body('source')
    .optional()
    .isIn(['website', 'instagram', 'referral'])
    .withMessage('Source must be: website, instagram, or referral'),
];

const listQueryValidation = [
  query('status').optional().isIn(['new', 'contacted', 'qualified', 'lost']),
  query('source').optional().isIn(['website', 'instagram', 'referral']),
  query('sort').optional().isIn(['latest', 'oldest']),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
];

// Export must be before /:id to avoid conflict
router.get('/export', listQueryValidation, validate, exportLeads);

router.get('/', listQueryValidation, validate, getLeads);
router.get('/:id', param('id').isMongoId().withMessage('Invalid lead ID'), validate, getLeadById);
router.post('/', createLeadValidation, validate, createLead);
router.patch('/:id', updateLeadValidation, validate, updateLead);
// Only admins can delete leads
router.delete('/:id', requireRole('admin'), param('id').isMongoId().withMessage('Invalid lead ID'), validate, deleteLead);

export default router;
