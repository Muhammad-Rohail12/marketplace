const mediaConfig = require('../config/media.config');

// Turns a stored relative path (e.g. "product-images/xyz.jpg") into
// a full public URL. Only this function needs to change if the
// storage driver moves from local disk to Cloudinary.
const buildMediaUrl = (relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http')) return relativePath;
  return `/uploads/${relativePath}`;
};

const getUploadSubfolder = (mediaType) => {
  const map = {
    PRODUCT_IMAGE: mediaConfig.subfolders.productImages,
    BRAND_LOGO: mediaConfig.subfolders.brandLogos,
    SELLER_LOGO: mediaConfig.subfolders.sellerLogos,
    STORE_BANNER: mediaConfig.subfolders.storeBanners,
    CATEGORY_IMAGE: mediaConfig.subfolders.categoryImages,
  };
  return map[mediaType] || 'misc';
};

module.exports = { buildMediaUrl, getUploadSubfolder };