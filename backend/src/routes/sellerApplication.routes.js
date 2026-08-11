const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../seller/controllers/sellerApplication.controller');

const router = express.Router();

// Applicant routes — ownership enforced inside the service via
// assertOwnership(application, req.user.id), not via role alone.
router.get('/me', authenticate, controller.getOrCreateDraft);
router.get('/me/current', authenticate, controller.getMyApplication);
router.patch('/:id', authenticate, controller.updateDraft);
router.post('/:id/submit', authenticate, controller.submitApplication);
router.post('/:id/cancel', authenticate, controller.cancelApplication);

// Admin routes
router.get('/', authenticate, authorize(ROLES.ADMIN), controller.listApplications);
router.get('/:id', authenticate, authorize(ROLES.ADMIN), controller.getApplication);
router.post('/:id/review', authenticate, authorize(ROLES.ADMIN), controller.startReview);
router.post('/:id/approve', authenticate, authorize(ROLES.ADMIN), controller.approveApplication);
router.post('/:id/reject', authenticate, authorize(ROLES.ADMIN), controller.rejectApplication);
router.post('/:id/suspend', authenticate, authorize(ROLES.ADMIN), controller.suspendSeller);

module.exports = router;