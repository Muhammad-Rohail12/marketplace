const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../media/controllers/media.controller');
const { uploadMediaFiles } = require('../media/middlewares/uploadMedia.middleware');

const router = express.Router({ mergeParams: true });
router.use(authenticate, authorize(ROLES.SELLER));

// Mounted at /api/seller/products/:id/media
router.get('/', controller.listMedia);
router.post('/', uploadMediaFiles, controller.uploadMedia);
router.patch('/:mediaId', controller.updateMetadata);
router.post('/:mediaId/primary', controller.setPrimary);
router.put('/reorder', controller.reorderMedia);
router.post('/:mediaId/replace', uploadMediaFiles, controller.replaceMedia);
router.delete('/:mediaId', controller.deleteMedia);

module.exports = router;