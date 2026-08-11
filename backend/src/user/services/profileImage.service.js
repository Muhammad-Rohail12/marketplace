const fs = require('fs/promises');
const path = require('path');
const prisma = require('../../database/prismaClient');
const { sanitizeUser } = require('./profile.service');
const { UPLOAD_DIR } = require('../middlewares/upload.middleware');
const logger = require('../../utils/logger');

const PUBLIC_PATH_PREFIX = '/uploads/profile-images';

const deleteFileIfExists = async (relativePath) => {
  if (!relativePath) return;
  const filename = path.basename(relativePath);
  const fullPath = path.join(UPLOAD_DIR, filename);
  try {
    await fs.unlink(fullPath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      logger.warn('Failed to delete old profile image:', err.message);
    }
  }
};

const uploadProfileImage = async (userId, file) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });

  // Remove the previous image (if any) so orphaned files don't
  // accumulate on disk every time a user updates their photo.
  await deleteFileIfExists(existingUser.profileImage);

  const publicPath = `${PUBLIC_PATH_PREFIX}/${file.filename}`;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { profileImage: publicPath },
  });

  return sanitizeUser(user);
};

const removeProfileImage = async (userId) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  await deleteFileIfExists(existingUser.profileImage);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { profileImage: null },
  });

  return sanitizeUser(user);
};

module.exports = { uploadProfileImage, removeProfileImage };