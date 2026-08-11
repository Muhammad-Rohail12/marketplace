const path = require('path');
const config = require('../../config');

// Single point of truth for where marketplace media lives. Product
// images, brand logos, etc. all resolve their storage path through
// this config — swapping to Cloudinary/object storage later means
// changing only this file plus mediaUrlHelper.js, not every service
// that uploads a file.
const mediaConfig = {
  driver: 'local', // 'local' | 'cloudinary' (future)
  localUploadsRoot: path.join(__dirname, '../../../../uploads'),
  publicBaseUrl: `${config.server.frontendUrl.startsWith('http') ? '' : ''}`, // resolved via backend origin, not stored here
  subfolders: {
    productImages: 'product-images',
    brandLogos: 'brand-logos',
    sellerLogos: 'seller-logos',
    storeBanners: 'store-banners',
    categoryImages: 'category-images',
  },
};

module.exports = mediaConfig;