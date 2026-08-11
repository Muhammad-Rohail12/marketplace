const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const { getMyProfile, updateMyProfile } = require('../user/controllers/profile.controller');
const { uploadImage, removeImage } = require('../user/controllers/profileImage.controller');
const { changePassword } = require('../user/controllers/changePassword.controller');
const { deactivateAccount } = require('../user/controllers/deactivateAccount.controller');
const { uploadProfileImage } = require('../user/middlewares/upload.middleware');

const router = express.Router();

router.use(authenticate); // every route below requires a valid access token

router.get('/me', getMyProfile);
router.patch('/me', updateMyProfile);
router.post('/me/profile-image', uploadProfileImage, uploadImage);
router.delete('/me/profile-image', removeImage);
router.post('/me/change-password', changePassword);
router.post('/me/deactivate', deactivateAccount);

module.exports = router;