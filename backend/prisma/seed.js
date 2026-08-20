/* eslint-disable no-console */
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PASSWORD = 'MarketplaceDev!2026';
const IMAGE_URL = (label) => `https://placehold.co/800x800/png?text=${encodeURIComponent(label)}`;
const BANNER_URL = (label) => `https://placehold.co/1600x500/png?text=${encodeURIComponent(label)}`;
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const money = (value) => Number(value.toFixed(2));
const dateDaysAgo = (days) => new Date(Date.now() - days * 86400000);

const categoryDefinitions = [
  ['Electronics', ['Smartphones', 'Laptops', 'Headphones', 'Smart Watches', 'Cameras', 'Accessories', 'Gaming']],
  ['Fashion', ['Shoes', 'T-Shirts', 'Dresses', 'Jackets', 'Bags', 'Activewear']],
  ['Beauty', ['Skin Care', 'Makeup', 'Hair Care', 'Fragrance', 'Bath and Body']],
  ['Sports', ['Running', 'Fitness', 'Cycling', 'Outdoor Recreation', 'Team Sports']],
  ['Home and Kitchen', ['Kitchen', 'Home Decor', 'Lighting', 'Storage', 'Appliances', 'Dining']],
  ['Furniture', ['Living Room', 'Bedroom', 'Office Furniture', 'Outdoor Furniture']],
  ['Watches', ['Smart Watches', 'Classic Watches', 'Luxury Watches', 'Watch Accessories']],
  ['Toys and Games', ['Board Games', 'Action Figures', 'Educational Toys', 'Outdoor Toys']],
  ['Groceries', ['Pantry', 'Snacks', 'Beverages', 'Organic Foods']],
  ['Health and Personal Care', ['Vitamins', 'First Aid', 'Personal Care', 'Wellness']],
  ['Automotive', ['Car Accessories', 'Tools', 'Interior', 'Exterior', 'Motorcycle Gear']],
  ['Books', ['Fiction', 'Business', 'Technology', 'Children Books', 'Education']],
  ['Pet Supplies', ['Dog Supplies', 'Cat Supplies', 'Aquariums', 'Pet Grooming']],
  ['Office and School', ['Stationery', 'Office Electronics', 'School Supplies', 'Desk Accessories']],
  ['Tools and Home Improvement', ['Power Tools', 'Hand Tools', 'Plumbing', 'Electrical', 'Hardware']],
];

const brandNames = [
  'NovaTech', 'Apex Audio', 'PixelCraft', 'Everline', 'Urban Thread', 'Northstar', 'Luma Living',
  'PureKind', 'Trailmark', 'Peak Motion', 'Oak and Iron', 'BrightNest', 'Vertex', 'Cedar House',
  'Mosaic Home', 'Velora', 'Summit Gear', 'Kindred Kitchen', 'Orbit Mobile', 'Blue Harbor',
  'Craftline', 'WellSpring', 'Atlas Works', 'Silverstone', 'Greenfield', 'Meridian', 'CloudNine',
  'Studio One', 'Harbor and Home', 'Goodday Goods',
];

const storeNames = [
  'Tech World', 'Urban Fashion', 'Home Living', 'Beauty Hub', 'Sports Central', 'Gadget Planet',
  'Kitchen House', 'Watch Gallery', 'Pet World', 'Book Market', 'Trail and Tool', 'Everyday Goods',
];

const productTemplates = {
  Smartphones: ['Pro Wireless Smartphone', 'SmartView 5G Phone', 'Edge Max Android Phone', 'PocketPlus Camera Phone'],
  Laptops: ['ProBook Performance Laptop', 'Lightline Creator Laptop', 'WorkMate Business Laptop', 'GameForge Gaming Laptop'],
  Headphones: ['Pro Wireless Noise-Canceling Headphones', 'Studio Wireless Headphones', 'Everyday Bluetooth Earbuds', 'Bassline Gaming Headset'],
  Cameras: ['ClearFrame Mirrorless Camera', 'Vista 4K Action Camera', 'FocusPoint Travel Camera'],
  Gaming: ['Arcade Wireless Gaming Controller', 'GameForge Mechanical Keyboard', 'Velocity Gaming Monitor'],
  Shoes: ['UltraFit Running Shoes', 'CityStep Everyday Sneakers', 'Trailbound Hiking Shoes', 'CourtPro Training Shoes'],
  'T-Shirts': ['Essential Cotton T-Shirt', 'Motion Performance Tee', 'Heritage Graphic T-Shirt'],
  Dresses: ['Modern Linen Day Dress', 'Willow Evening Dress', 'Comfort Knit Midi Dress'],
  'Skin Care': ['Daily Balance Facial Cleanser', 'GlowRenew Vitamin C Serum', 'HydraCalm Moisturizer'],
  Makeup: ['Velvet Matte Lip Color', 'SoftFocus Foundation', 'BrightLook Eye Palette'],
  Running: ['StrideFlex Running Jacket', 'Endurance Hydration Belt', 'PaceLight Running Shorts'],
  Fitness: ['CoreBalance Yoga Mat', 'PowerLoop Resistance Bands', 'LiftPro Adjustable Dumbbells'],
  Kitchen: ['Chefline Stainless Cookware Set', 'BrewMaster Pour Over Coffee Maker', 'QuickPrep Food Processor'],
  'Home Decor': ['Luma Accent Table Lamp', 'Cedar Frame Wall Art', 'SoftNest Decorative Cushion'],
  Lighting: ['Halo Smart LED Floor Lamp', 'WarmGlow Pendant Light', 'BrightDesk Task Lamp'],
  Appliances: ['FreshBrew Compact Coffee Maker', 'CrispAir Digital Fryer', 'BlendPro Countertop Blender'],
  'Living Room': ['Haven Modular Sofa', 'Oakline Coffee Table', 'LoomHouse Accent Chair'],
  'Bedroom': ['CloudRest Memory Foam Pillow', 'Oakline Bedside Table', 'LinenHouse Duvet Set'],
  'Smart Watches': ['PulseTrack Fitness Smartwatch', 'Orbit Active Smartwatch', 'TimeFlow Health Watch'],
  'Classic Watches': ['Meridian Steel Chronograph', 'Silverstone Leather Watch', 'Northstar Minimal Watch'],
  'Board Games': ['Strategy Harbor Board Game', 'Family Quest Board Game', 'WordSmith Party Game'],
  'Educational Toys': ['BuildBright STEM Kit', 'Little Explorer Science Set', 'Numbers and Shapes Learning Set'],
  Pantry: ['Harvest Select Olive Oil', 'Goodday Organic Pasta', 'Cedar House Spice Collection'],
  Snacks: ['Trailmark Nut and Fruit Mix', 'Goodday Granola Bites', 'BrightNest Snack Variety Box'],
  Vitamins: ['WellSpring Daily Multivitamin', 'PureKind Magnesium Capsules', 'Peak Motion Vitamin D3'],
  'Car Accessories': ['RoadReady Wireless Car Charger', 'Atlas Works Emergency Kit', 'DriveBright LED Safety Lights'],
  Fiction: ['The Last Harbor', 'Letters from Meridian', 'A Map of Quiet Places'],
  Business: ['Practical Product Strategy', 'The Modern Seller Handbook', 'Building Better Teams'],
  Stationery: ['Craftline Hardcover Notebook', 'Studio One Desk Organizer', 'Everyday Goods Gel Pen Set'],
  'Power Tools': ['Atlas Works Cordless Drill', 'Craftline Compact Sander', 'Vertex Multi-Tool Kit'],
};

const firstNames = ['Avery', 'Jordan', 'Morgan', 'Taylor', 'Riley', 'Casey', 'Quinn', 'Parker', 'Drew', 'Jamie', 'Cameron', 'Reese', 'Emerson', 'Skyler', 'Rowan', 'Dakota', 'Alex', 'Harper', 'Logan', 'Blake', 'Mia', 'Noah', 'Ivy', 'Liam', 'Nora', 'Eli', 'Sage', 'Zoe', 'Milo', 'Ruby'];
const lastNames = ['Carter', 'Brooks', 'Hayes', 'Reed', 'Morgan', 'Parker', 'Bennett', 'Foster', 'Sullivan', 'Turner', 'Wells', 'Grant', 'Bishop', 'Cole', 'Stone'];
const locations = [
  ['Austin', 'TX', 'Texas', '78701'], ['Seattle', 'WA', 'Washington', '98101'], ['Denver', 'CO', 'Colorado', '80202'],
  ['Portland', 'OR', 'Oregon', '97205'], ['Chicago', 'IL', 'Illinois', '60601'], ['Boston', 'MA', 'Massachusetts', '02108'],
  ['Atlanta', 'GA', 'Georgia', '30303'], ['Phoenix', 'AZ', 'Arizona', '85004'], ['Raleigh', 'NC', 'North Carolina', '27601'],
  ['Nashville', 'TN', 'Tennessee', '37219'], ['Columbus', 'OH', 'Ohio', '43215'], ['San Diego', 'CA', 'California', '92101'],
];

async function resetDatabase() {
  if (process.env.NODE_ENV === 'production') throw new Error('Refusing to seed while NODE_ENV=production.');
  if (!process.env.DATABASE_URL || /prod|production/i.test(process.env.DATABASE_URL)) {
    throw new Error('Refusing to seed without a clearly non-production DATABASE_URL.');
  }
  const tables = [
    'notification', 'wishlistItem', 'review', 'orderStatusEvent', 'orderItem', 'order', 'checkoutInventoryReservation', 'checkoutSession', 'cartShippingSelection',
    'cartItem', 'cart', 'address', 'discount', 'deal', 'priceHistory', 'productPrice', 'stockMovement', 'inventory',
    'productMedia', 'variantCombinationOption', 'variantCombination', 'productSpecificationValue', 'productAttributeValue',
    'productAuditEvent', 'product', 'storePolicy', 'storeAuditEvent', 'store', 'sellerShippingSettings', 'shippingRate',
    'seller', 'sellerApplicationAuditEvent', 'sellerApplication', 'brandCategory', 'brand', 'categoryAttribute', 'category',
    'specificationTemplateItem', 'productSpecificationTemplate', 'variantOption', 'attributeValue', 'attribute', 'attributeGroup',
    'measurementUnit', 'sKUConfiguration', 'barcodeConfiguration', 'shippingMethod', 'stateTaxRate', 'verificationToken',
    'refreshToken', 'user', 'orderNumberSequence',
  ];
  for (const table of tables) await prisma[table].deleteMany();
}

async function seedUsers() {
  const password = await bcrypt.hash(PASSWORD, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
  const admins = [];
  for (let index = 0; index < 2; index += 1) {
    admins.push(await prisma.user.create({ data: {
      firstName: index ? 'Morgan' : 'Alex', lastName: index ? 'Admin' : 'Platform', email: `admin${index + 1}@marketplace.test`,
      password, role: 'ADMIN', status: 'ACTIVE', emailVerified: true, emailVerifiedAt: dateDaysAgo(100 - index * 20),
      createdAt: dateDaysAgo(120 - index * 15), lastLoginAt: dateDaysAgo(index + 1),
    } }));
  }
  const buyers = [];
  for (let index = 0; index < 30; index += 1) {
    const firstName = firstNames[index];
    const lastName = lastNames[index % lastNames.length];
    const verified = index % 5 !== 0;
    buyers.push(await prisma.user.create({ data: {
      firstName, lastName, email: `buyer${String(index + 1).padStart(2, '0')}@marketplace.test`, password, role: 'BUYER',
      status: index === 29 ? 'INACTIVE' : 'ACTIVE', emailVerified: verified, emailVerifiedAt: verified ? dateDaysAgo(90 - index) : null,
      phone: `+1555000${String(1000 + index)}`, createdAt: dateDaysAgo(180 - index * 4), lastLoginAt: index % 3 === 0 ? dateDaysAgo(index + 1) : null,
    } }));
  }
  const sellerApplicants = [];
  for (let index = 0; index < 12; index += 1) {
    const firstName = firstNames[(index + 8) % firstNames.length];
    const lastName = lastNames[(index + 5) % lastNames.length];
    const approved = index < 10;
    const user = await prisma.user.create({ data: {
      firstName, lastName, email: `seller${String(index + 1).padStart(2, '0')}@marketplace.test`, password,
      role: approved ? 'SELLER' : 'BUYER', status: approved ? 'ACTIVE' : index === 10 ? 'ACTIVE' : 'SUSPENDED', emailVerified: true,
      emailVerifiedAt: dateDaysAgo(140 - index * 3), phone: `+1555100${String(1000 + index)}`, createdAt: dateDaysAgo(160 - index * 5),
    } });
    const applicationStatus = approved ? 'APPROVED' : index === 10 ? 'UNDER_REVIEW' : 'REJECTED';
    const application = await prisma.sellerApplication.create({ data: {
      userId: user.id, businessName: storeNames[index], businessType: 'Retail marketplace seller', businessDescription: `Development application for ${storeNames[index]}.`,
      contactName: `${firstName} ${lastName}`, contactEmail: user.email, contactPhone: user.phone, country: 'US', stateProvince: locations[index][2],
      city: locations[index][0], address: `${100 + index} Market Street`, postalCode: locations[index][3], status: applicationStatus, termsAccepted: true,
      submittedAt: dateDaysAgo(150 - index * 4), reviewedAt: approved || index === 11 ? dateDaysAgo(130 - index * 3) : null,
      reviewedById: approved || index === 11 ? admins[index % admins.length].id : null, approvedAt: approved ? dateDaysAgo(125 - index * 3) : null,
      rejectedAt: index === 11 ? dateDaysAgo(125) : null, rejectionReason: index === 11 ? 'Development rejection example.' : null,
    } });
    sellerApplicants.push({ user, application });
    await prisma.sellerApplicationAuditEvent.create({ data: { applicationId: application.id, actorId: admins[0].id, action: approved ? 'APPROVED' : applicationStatus } });
  }
  for (const user of [...admins, ...buyers, ...sellerApplicants.map((item) => item.user)]) {
    if (!user.emailVerified) await prisma.verificationToken.create({ data: { userId: user.id, tokenHash: crypto.createHash('sha256').update(`verify-${user.id}`).digest('hex'), expiresAt: dateDaysAgo(-1) } });
    if (user.id % 2 === 0) await prisma.refreshToken.create({ data: { userId: user.id, tokenHash: crypto.createHash('sha256').update(`refresh-${user.id}`).digest('hex'), expiresAt: dateDaysAgo(-7), revokedAt: user.id % 4 === 0 ? dateDaysAgo(1) : null } });
  }
  return { admins, buyers, sellerApplicants };
}

async function seedTaxonomy() {
  const categories = [];
  const categoryByName = new Map();
  for (let parentIndex = 0; parentIndex < categoryDefinitions.length; parentIndex += 1) {
    const [name, children] = categoryDefinitions[parentIndex];
    const parent = await prisma.category.create({ data: { name, slug: slugify(name), level: 0, sortOrder: parentIndex, isFeatured: parentIndex < 8, showOnHomepage: parentIndex < 10, description: `Explore ${name.toLowerCase()} from trusted marketplace sellers.` } });
    categories.push(parent); categoryByName.set(name, parent);
    for (let childIndex = 0; childIndex < children.length; childIndex += 1) {
      const child = await prisma.category.create({ data: { name: children[childIndex], slug: slugify(`${name}-${children[childIndex]}`), parentId: parent.id, level: 1, sortOrder: childIndex, isFeatured: childIndex < 2, showOnHomepage: childIndex === 0, description: `Quality ${children[childIndex].toLowerCase()} in ${name.toLowerCase()}.` } });
      categories.push(child); categoryByName.set(children[childIndex], child);
    }
  }
  const group = await prisma.attributeGroup.create({ data: { name: 'Marketplace Attributes', slug: 'marketplace-attributes' } });
  const attributeDefinitions = [
    ['Color', 'color', 'COLOR', true, true], ['Size', 'size', 'SIZE', true, true], ['Storage', 'storage', 'TEXT', true, true],
    ['RAM', 'ram', 'TEXT', true, true], ['Material', 'material', 'TEXT', false, true], ['Connectivity', 'connectivity', 'TEXT', false, true],
    ['Battery Life', 'battery-life', 'TEXT', false, false], ['Feature', 'feature', 'TEXT', false, false],
  ];
  const attributes = {};
  const attributeValues = {};
  for (const [name, code, type, variant, filterable] of attributeDefinitions) {
    const attribute = await prisma.attribute.create({ data: { groupId: group.id, name, code, type, isVariantAttribute: variant, isFilterable: filterable } });
    attributes[code] = attribute; attributeValues[code] = [];
    const values = code === 'color' ? [['black', 'Black', '#111111'], ['blue', 'Blue', '#2563eb'], ['white', 'White', '#ffffff'], ['green', 'Green', '#16a34a'], ['red', 'Red', '#dc2626']]
      : code === 'size' ? [['s', 'Small'], ['m', 'Medium'], ['l', 'Large'], ['xl', 'Extra Large']]
        : code === 'storage' ? [['128gb', '128 GB'], ['256gb', '256 GB'], ['512gb', '512 GB'], ['1tb', '1 TB']]
          : code === 'ram' ? [['8gb', '8 GB'], ['16gb', '16 GB'], ['32gb', '32 GB']]
            : [['standard', 'Standard'], ['premium', 'Premium'], ['pro', 'Pro']];
    for (let index = 0; index < values.length; index += 1) {
      const [value, label, colorHex] = values[index];
      attributeValues[code].push(await prisma.attributeValue.create({ data: { attributeId: attribute.id, value, label, colorHex, displayOrder: index } }));
    }
  }
  for (const category of categories) {
    for (const code of ['color', 'size', 'material']) if (attributes[code]) await prisma.categoryAttribute.create({ data: { categoryId: category.id, attributeId: attributes[code].id, isRequired: code === 'color' && category.level === 1 } });
  }
  for (const unit of [['Kilogram', 'kg', 'WEIGHT'], ['Gram', 'g', 'WEIGHT'], ['Centimeter', 'cm', 'DIMENSION'], ['Piece', 'pc', 'COUNT']]) await prisma.measurementUnit.create({ data: { name: unit[0], code: unit[1], unitType: unit[2] } });
  await prisma.sKUConfiguration.create({ data: { name: 'Development SKU', pattern: 'DEV-{CATEGORY}-{SEQUENCE}' } });
  await prisma.barcodeConfiguration.create({ data: { name: 'Development UPC', type: 'UPC', prefix: '890' } });
  for (const parent of categories.filter((category) => category.level === 0)) {
    const template = await prisma.productSpecificationTemplate.create({ data: { name: `${parent.name} Specification Template`, categoryId: parent.id } });
    await prisma.specificationTemplateItem.createMany({ data: [{ templateId: template.id, label: 'Material', attributeId: attributes.material.id, group: 'GENERAL' }, { templateId: template.id, label: 'Key feature', attributeId: attributes.feature.id, group: 'TECHNICAL' }] });
  }
  const brands = [];
  for (let index = 0; index < brandNames.length; index += 1) {
    const brand = await prisma.brand.create({ data: { name: brandNames[index], slug: slugify(brandNames[index]), description: `${brandNames[index]} development catalog brand.`, shortDescription: `Trusted ${brandNames[index]} products.`, logo: IMAGE_URL(`${brandNames[index]} logo`), banner: BANNER_URL(brandNames[index]), country: 'US', isVerified: index < 20, isFeatured: index < 12, showOnHomepage: index < 10, displayOrder: index } });
    brands.push(brand);
    for (const category of categories.filter((item) => item.level === 0).slice(index % 5, (index % 5) + 3)) await prisma.brandCategory.create({ data: { brandId: brand.id, categoryId: category.id } });
  }
  const variantOptions = {};
  for (const code of ['color', 'size', 'storage', 'ram']) {
    variantOptions[code] = [];
    for (const value of attributeValues[code]) variantOptions[code].push(await prisma.variantOption.create({ data: { attributeId: attributes[code].id, attributeValueId: value.id } }));
  }
  return { categories, categoryByName, brands, attributes, attributeValues, variantOptions };
}

async function seedSellers(users) {
  const sellers = [];
  const methods = [];
  for (const [code, name, min, max] of [['STANDARD', 'Standard Delivery', 3, 7], ['EXPRESS', 'Express Delivery', 1, 3], ['FREE', 'Free Delivery', 5, 9]]) methods.push(await prisma.shippingMethod.create({ data: { code, name, description: `${name} for development orders.`, deliveryMinDays: min, deliveryMaxDays: max, sortOrder: methods.length } }));
  for (let index = 0; index < 10; index += 1) {
    const applicant = users.sellerApplicants[index];
    const seller = await prisma.seller.create({ data: { userId: applicant.user.id, status: index === 9 ? 'SUSPENDED' : 'ACTIVE', approvedAt: dateDaysAgo(125 - index * 3), suspendedAt: index === 9 ? dateDaysAgo(3) : null } });
    const location = locations[index];
    const store = await prisma.store.create({ data: { sellerId: seller.id, name: storeNames[index], slug: slugify(storeNames[index]), shortDescription: `Curated products from ${storeNames[index]}.`, description: `Development storefront for ${storeNames[index]} with reliable service and broad selection.`, logo: IMAGE_URL(`${storeNames[index]} logo`), banner: BANNER_URL(storeNames[index]), email: applicant.user.email, phone: applicant.user.phone, country: 'US', stateProvince: location[2], city: location[0], address: `${200 + index} Commerce Avenue`, postalCode: location[3], status: index === 9 ? 'SUSPENDED' : 'ACTIVE', isFeatured: index < 5 } });
    for (const type of ['RETURN', 'SHIPPING', 'CANCELLATION', 'PRIVACY', 'TERMS']) await prisma.storePolicy.create({ data: { storeId: store.id, type, content: `${type} policy for ${store.name}. This is development-only marketplace content.` } });
    await prisma.storeAuditEvent.create({ data: { storeId: store.id, actorId: users.admins[0].id, action: 'SEEDED_DEVELOPMENT_STORE', metadata: JSON.stringify({ development: true }) } });
    await prisma.sellerShippingSettings.create({ data: { sellerId: seller.id, processingMinDays: 1 + index % 2, processingMaxDays: 3 + index % 3, freeShippingThreshold: 75 + index * 10 } });
    for (const method of methods) await prisma.shippingRate.create({ data: { sellerId: seller.id, shippingMethodId: method.id, zone: 'CONTIGUOUS_US', flatRate: method.code === 'FREE' ? 0 : method.code === 'EXPRESS' ? 14.99 : 6.99, freeShippingThreshold: method.code === 'STANDARD' ? 75 : null } });
    sellers.push({ seller, store, user: applicant.user });
  }
  for (const method of methods) await prisma.shippingRate.create({ data: { sellerId: null, shippingMethodId: method.id, zone: 'CONTIGUOUS_US', flatRate: method.code === 'FREE' ? 0 : method.code === 'EXPRESS' ? 14.99 : 6.99 } });
  for (const [stateCode, rate] of [['TX', 0.0825], ['WA', 0.065], ['CO', 0.029], ['OR', 0], ['IL', 0.0885], ['MA', 0.0625], ['GA', 0.04], ['CA', 0.0725], ['NC', 0.0475], ['TN', 0.07], ['OH', 0.0575], ['AZ', 0.056]]) await prisma.stateTaxRate.upsert({ where: { stateCode }, update: { rate }, create: { stateCode, rate } });
  return { sellers, methods };
}

async function seedCatalog(taxonomy, sellerData, admin) {
  const products = []; const inventories = []; const prices = []; const variants = [];
  const childCategories = taxonomy.categories.filter((category) => category.level === 1);
  for (let index = 0; index < 360; index += 1) {
    const category = childCategories[index % childCategories.length];
    const parentName = categoryDefinitions.find((definition) => definition[1].some((name) => name === category.name))?.[0] || 'Marketplace';
    const sellerDataItem = sellerData.sellers[index % sellerData.sellers.length];
    const templates = productTemplates[category.name] || [`${category.name} Everyday Essential`, `${category.name} Premium Selection`, `${category.name} Modern Collection`];
    const baseName = templates[index % templates.length];
    const name = `${baseName} ${index + 1}`;
    const status = index % 36 === 0 ? 'DRAFT' : index % 37 === 0 ? 'PENDING_REVIEW' : index % 41 === 0 ? 'OUT_OF_STOCK' : 'ACTIVE';
    const productType = index % 5 === 0 ? 'VARIABLE' : 'SIMPLE';
    const basePrice = money(9.99 + ((index * 17) % 1750) + (index % 4) * 0.99);
    const product = await prisma.product.create({ data: {
      sellerId: sellerDataItem.seller.id, storeId: sellerDataItem.store.id, categoryId: category.id, brandId: taxonomy.brands[index % taxonomy.brands.length].id,
      name, slug: `${slugify(name)}-${index + 1}`, shortDescription: `Reliable ${category.name.toLowerCase()} for everyday use.`, description: `${name} is a development catalog item from the ${parentName} collection. Designed for realistic product discovery, filtering, pricing, and checkout testing.`,
      status, visibility: status === 'DRAFT' ? 'PRIVATE' : 'PUBLIC', productType, condition: index % 23 === 0 ? 'REFURBISHED' : 'NEW', sku: `DEV-${slugify(category.name).slice(0, 6).toUpperCase()}-${String(index + 1).padStart(6, '0')}`,
      barcode: `890${String(100000000 + index).padStart(9, '0')}`, modelNumber: `MD-${String(index + 1).padStart(5, '0')}`, manufacturer: taxonomy.brands[index % taxonomy.brands.length].name,
      countryOfOrigin: 'US', warrantyInformation: index % 3 === 0 ? '12-month development warranty' : '30-day development warranty', weight: 0.2 + (index % 20) / 10, weightUnit: 'kg',
      seoTitle: name, seoDescription: `Shop ${name} in the development marketplace catalog.`, seoKeywords: `${category.name}, ${parentName}, marketplace, wireless, quality`,
      submittedAt: status === 'DRAFT' ? null : dateDaysAgo(100 - index % 90), publishedAt: status === 'ACTIVE' || status === 'OUT_OF_STOCK' ? dateDaysAgo(index % 45) : null,
      reviewedAt: status === 'ACTIVE' || status === 'OUT_OF_STOCK' ? dateDaysAgo(80 - index % 50) : null, reviewedById: status === 'ACTIVE' || status === 'OUT_OF_STOCK' ? admin.id : null, createdAt: dateDaysAgo(index % 180),
    } });
    products.push(product);
    await prisma.productAuditEvent.create({ data: { productId: product.id, actorId: admin.id, action: 'SEEDED_DEVELOPMENT_PRODUCT', metadata: JSON.stringify({ status }) } });
    const color = taxonomy.attributeValues.color[index % taxonomy.attributeValues.color.length];
    await prisma.productAttributeValue.create({ data: { productId: product.id, attributeId: taxonomy.attributes.color.id, attributeValueId: color.id, value: color.label } });
    await prisma.productSpecificationValue.createMany({ data: [{ productId: product.id, label: 'Material', value: index % 2 ? 'Premium composite' : 'Reinforced natural material', group: 'GENERAL' }, { productId: product.id, label: 'Key feature', value: index % 2 ? 'Wireless ready and lightweight' : 'Durable everyday construction', group: 'TECHNICAL' }] });
    const mediaUrl = IMAGE_URL(name);
    await prisma.productMedia.create({ data: { productId: product.id, type: 'IMAGE', url: mediaUrl, storageKey: `seed/products/${product.slug}.png`, originalFileName: `${product.slug}.png`, fileName: `${product.slug}.png`, mimeType: 'image/png', fileSize: 24576, width: 800, height: 800, altText: name, title: name, isPrimary: true } });
    if (index % 3 === 0) await prisma.productMedia.create({ data: { productId: product.id, type: 'IMAGE', url: BANNER_URL(name), storageKey: `seed/products/${product.slug}-detail.png`, originalFileName: `${product.slug}-detail.png`, fileName: `${product.slug}-detail.png`, mimeType: 'image/png', fileSize: 32768, width: 1600, height: 500, altText: `${name} detail` } });
    if (productType === 'VARIABLE') {
      const variantCount = 2 + index % 3;
      for (let variantIndex = 0; variantIndex < variantCount; variantIndex += 1) {
        const optionCodes = category.name.toLowerCase().includes('shoe') || category.name === 'T-Shirts' ? ['color', 'size'] : ['color'];
        const selectedOptions = optionCodes.map((code) => taxonomy.variantOptions[code][(index + variantIndex) % taxonomy.variantOptions[code].length]);
        const variant = await prisma.variantCombination.create({ data: { productId: product.id, name: `${name} Variant ${variantIndex + 1}`, sku: `${product.sku}-V${variantIndex + 1}`, price: basePrice + variantIndex * 5, status: 'ACTIVE' } });
        await prisma.variantCombinationOption.createMany({ data: selectedOptions.map((option) => ({ combinationId: variant.id, variantOptionId: option.id })) });
        const quantity = status === 'OUT_OF_STOCK' ? 0 : variantIndex === 0 && index % 7 === 0 ? 3 : 20 + ((index + variantIndex * 13) % 180);
        const inventory = await prisma.inventory.create({ data: { productId: product.id, variantId: variant.id, sellerId: sellerDataItem.seller.id, storeId: sellerDataItem.store.id, sku: variant.sku, quantity, lowStockThreshold: 8, reorderPoint: 15, status: quantity === 0 ? 'OUT_OF_STOCK' : quantity <= 8 ? 'LOW_STOCK' : 'IN_STOCK' } });
        inventories.push(inventory); variants.push(variant);
        await prisma.stockMovement.create({ data: { inventoryId: inventory.id, type: 'INITIAL_STOCK', quantity, previousQuantity: 0, newQuantity: quantity, reason: 'Development seed inventory', performedById: admin.id } });
        const price = await prisma.productPrice.create({ data: { productId: product.id, variantId: variant.id, sellerId: sellerDataItem.seller.id, storeId: sellerDataItem.store.id, currency: 'USD', basePrice: basePrice + variantIndex * 5, compareAtPrice: index % 3 === 0 ? basePrice + variantIndex * 5 + 15 : null, costPrice: money(basePrice * 0.55), minimumPrice: basePrice + variantIndex * 5, maximumPrice: basePrice + variantIndex * 5 } });
        prices.push(price); await prisma.priceHistory.create({ data: { priceId: price.id, changeType: 'INITIAL_PRICE', newValue: price.basePrice, reason: 'Development seed price', changedById: admin.id } });
      }
    } else {
      const quantity = status === 'OUT_OF_STOCK' ? 0 : index % 9 === 0 ? 2 + index % 5 : 25 + ((index * 7) % 250);
      const inventory = await prisma.inventory.create({ data: { productId: product.id, sellerId: sellerDataItem.seller.id, storeId: sellerDataItem.store.id, sku: product.sku, quantity, lowStockThreshold: 8, reorderPoint: 15, status: quantity === 0 ? 'OUT_OF_STOCK' : quantity <= 8 ? 'LOW_STOCK' : 'IN_STOCK' } });
      inventories.push(inventory); await prisma.stockMovement.create({ data: { inventoryId: inventory.id, type: 'INITIAL_STOCK', quantity, previousQuantity: 0, newQuantity: quantity, reason: 'Development seed inventory', performedById: admin.id } });
      const price = await prisma.productPrice.create({ data: { productId: product.id, sellerId: sellerDataItem.seller.id, storeId: sellerDataItem.store.id, currency: 'USD', basePrice, compareAtPrice: index % 3 === 0 ? basePrice + 20 : null, costPrice: money(basePrice * 0.55), minimumPrice: basePrice, maximumPrice: basePrice } });
      prices.push(price); await prisma.priceHistory.create({ data: { priceId: price.id, changeType: 'INITIAL_PRICE', newValue: price.basePrice, reason: 'Development seed price', changedById: admin.id } });
    }
  }
  return { products, inventories, prices, variants };
}

async function seedDeals(catalog, sellerData) {
  const deals = [];
  for (let index = 0; index < 3; index += 1) {
    const startAt = index === 1 ? dateDaysAgo(-7) : index === 2 ? dateDaysAgo(30) : dateDaysAgo(3);
    const endAt = index === 2 ? dateDaysAgo(1) : dateDaysAgo(-14);
    const deal = await prisma.deal.create({ data: { sellerId: sellerData.sellers[index].seller.id, name: index === 0 ? 'Weekend Discovery Deals' : index === 1 ? 'Scheduled Summer Preview' : 'Expired Archive Promotion', description: 'Development marketplace promotion.', startAt, endAt, isEnabled: true } });
    deals.push(deal);
    const sellerProducts = catalog.products.filter((product) => product.sellerId === sellerData.sellers[index].seller.id).slice(0, 8);
    for (const product of sellerProducts) {
      const price = catalog.prices.find((item) => item.productId === product.id && item.variantId === null) || catalog.prices.find((item) => item.productId === product.id);
      if (!price) continue;
      await prisma.discount.create({ data: { dealId: deal.id, priceId: price.id, productId: product.id, sellerId: product.sellerId, storeId: product.storeId, type: 'PERCENTAGE', value: 10 + (product.id % 4) * 5, startAt, endAt, isEnabled: true } });
    }
  }
  return deals;
}

async function seedCustomersAndOrders(users, catalog, sellerData) {
  const addresses = []; const carts = []; const buyerAddresses = new Map();
  for (let index = 0; index < users.buyers.length; index += 1) {
    const buyer = users.buyers[index]; const location = locations[index % locations.length];
    const address = await prisma.address.create({ data: { userId: buyer.id, label: 'HOME', firstName: buyer.firstName, lastName: buyer.lastName, addressLine1: `${500 + index} Development Avenue`, addressLine2: index % 3 === 0 ? `Unit ${index + 2}` : null, city: location[0], stateCode: location[1], stateName: location[2], postalCode: location[3], phone: buyer.phone, deliveryInstructions: index % 4 === 0 ? 'Leave package at the front desk.' : null, isDefault: true } });
    addresses.push(address); buyerAddresses.set(buyer.id, address);
    if (index < 12) {
      const cart = await prisma.cart.create({ data: { userId: buyer.id, status: 'ACTIVE', currency: 'USD', selectedAddressId: address.id } });
      const selected = catalog.products.filter((product) => product.status === 'ACTIVE').slice(index * 2, index * 2 + 3);
      for (const product of selected) { const variant = catalog.variants.find((item) => item.productId === product.id); await prisma.cartItem.create({ data: { cartId: cart.id, productId: product.id, variantId: variant?.id || null, quantity: 1 + index % 2 } }); }
      for (const seller of sellerData.sellers.slice(0, 2)) await prisma.cartShippingSelection.create({ data: { cartId: cart.id, storeId: seller.store.id, shippingMethodId: sellerData.methods[0].id, price: 6.99, currency: 'USD', minDays: 3, maxDays: 7 } });
      carts.push(cart);
    }
  }
  const activeProducts = catalog.products.filter((product) => product.status === 'ACTIVE' && catalog.inventories.some((inventory) => inventory.productId === product.id && inventory.quantity > 10));
  for (let orderIndex = 0; orderIndex < 240; orderIndex += 1) {
    const buyer = users.buyers[orderIndex % users.buyers.length]; const address = buyerAddresses.get(buyer.id); const sessionCart = await prisma.cart.create({ data: { userId: buyer.id, status: 'CONVERTED', currency: 'USD', selectedAddressId: address.id, createdAt: dateDaysAgo(orderIndex % 180) } });
    const selected = [0, 1, 2].map((offset) => activeProducts[(orderIndex * 3 + offset) % activeProducts.length]);
    const cartItems = [];
    for (const product of selected) { const variant = catalog.variants.find((item) => item.productId === product.id); const item = await prisma.cartItem.create({ data: { cartId: sessionCart.id, productId: product.id, variantId: variant?.id || null, quantity: 1 + (orderIndex + product.id) % 2 } }); cartItems.push({ item, product, variant }); }
    const subtotal = cartItems.reduce((sum, line) => { const price = catalog.prices.find((item) => item.productId === line.product.id && item.variantId === (line.variant?.id || null)) || catalog.prices.find((item) => item.productId === line.product.id); return sum + Number(price.basePrice) * line.item.quantity; }, 0);
    const discount = orderIndex % 3 === 0 ? money(subtotal * 0.1) : 0; const shipping = orderIndex % 4 === 0 ? 0 : 6.99; const taxRate = 0.0725; const tax = money((subtotal - discount) * taxRate); const grandTotal = money(subtotal - discount + shipping + tax);
    const session = await prisma.checkoutSession.create({ data: { userId: buyer.id, cartId: sessionCart.id, status: 'CONVERTED', addressId: address.id, currency: 'USD', itemsSubtotal: money(subtotal), discountTotal: discount, shippingTotal: shipping, taxTotal: tax, grandTotal, taxStateCode: address.stateCode, taxRateSnapshot: taxRate, snapshotJson: JSON.stringify({ development: true, cartId: sessionCart.id }), reservationExpiresAt: dateDaysAgo(-1), expiresAt: dateDaysAgo(-1), convertedAt: dateDaysAgo(orderIndex % 180), createdAt: dateDaysAgo(orderIndex % 180) } });
    for (const line of cartItems.slice(0, 2)) {
      const inventory = catalog.inventories.find((item) => item.productId === line.product.id && item.variantId === (line.variant?.id || null)) || catalog.inventories.find((item) => item.productId === line.product.id && item.variantId === null);
      await prisma.checkoutInventoryReservation.create({ data: { checkoutSessionId: session.id, inventoryId: inventory.id, quantity: line.item.quantity, releasedAt: dateDaysAgo(Math.max(1, orderIndex % 30)) } });
    }
    const bySeller = new Map(); for (const line of cartItems) { if (!bySeller.has(line.product.sellerId)) bySeller.set(line.product.sellerId, []); bySeller.get(line.product.sellerId).push(line); }
    const sessionTotals = { itemsSubtotal: 0, discountTotal: 0, shippingTotal: 0, taxTotal: 0, grandTotal: 0 };
    let sellerSequence = 0;
    for (const [sellerId, lines] of bySeller) {
      const seller = sellerData.sellers.find((item) => item.seller.id === sellerId); const sellerSubtotal = lines.reduce((sum, line) => { const price = catalog.prices.find((item) => item.productId === line.product.id && item.variantId === (line.variant?.id || null)) || catalog.prices.find((item) => item.productId === line.product.id); return sum + Number(price.basePrice) * line.item.quantity; }, 0); const sellerDiscount = orderIndex % 3 === 0 ? money(sellerSubtotal * 0.1) : 0; const sellerShipping = sellerSequence === 0 ? shipping : 0; const sellerTax = money((sellerSubtotal - sellerDiscount) * taxRate); const sellerTotal = money(sellerSubtotal - sellerDiscount + sellerShipping + sellerTax);
      const statuses = ['DELIVERED', 'SHIPPED', 'PROCESSING', 'PAID', 'PENDING_PAYMENT', 'CANCELLED', 'REFUNDED']; const status = statuses[orderIndex % statuses.length];
      const order = await prisma.order.create({ data: { orderNumber: `ORD-${dateDaysAgo(orderIndex % 180).toISOString().slice(0, 10).replace(/-/g, '')}-${String(orderIndex + 1).padStart(5, '0')}-${sellerSequence}`, checkoutSessionId: session.id, userId: buyer.id, sellerId, storeId: seller.store.id, status, paymentStatus: status === 'PENDING_PAYMENT' ? 'PENDING' : status === 'REFUNDED' ? 'REFUNDED' : status === 'CANCELLED' ? 'FAILED' : 'PAID', itemsSubtotal: money(sellerSubtotal), discountTotal: sellerDiscount, shippingTotal: sellerShipping, taxTotal: sellerTax, grandTotal: sellerTotal, shippingMethodCode: sellerShipping ? 'STANDARD' : 'FREE', shippingMethodName: sellerShipping ? 'Standard Delivery' : 'Free Delivery', estimatedMinDays: sellerShipping ? 3 : 5, estimatedMaxDays: sellerShipping ? 7 : 9, shipFirstName: address.firstName, shipLastName: address.lastName, shipAddressLine1: address.addressLine1, shipAddressLine2: address.addressLine2, shipCity: address.city, shipStateCode: address.stateCode, shipPostalCode: address.postalCode, shipPhone: address.phone, deliveredAt: status === 'DELIVERED' ? dateDaysAgo(Math.max(1, orderIndex % 90)) : null, cancelledAt: status === 'CANCELLED' ? dateDaysAgo(2) : null, cancelReason: status === 'CANCELLED' ? 'Development cancellation example.' : null, createdAt: dateDaysAgo(orderIndex % 180) } });
      sessionTotals.itemsSubtotal += sellerSubtotal; sessionTotals.discountTotal += sellerDiscount; sessionTotals.shippingTotal += sellerShipping; sessionTotals.taxTotal += sellerTax; sessionTotals.grandTotal += sellerTotal;
      for (const line of lines) { const inventory = catalog.inventories.find((item) => item.productId === line.product.id && item.variantId === (line.variant?.id || null)) || catalog.inventories.find((item) => item.productId === line.product.id && item.variantId === null); const price = catalog.prices.find((item) => item.productId === line.product.id && item.variantId === (line.variant?.id || null)) || catalog.prices.find((item) => item.productId === line.product.id); await prisma.orderItem.create({ data: { orderId: order.id, productId: line.product.id, variantId: line.variant?.id || null, inventoryId: inventory.id, productName: line.product.name, variantName: line.variant?.name || null, sku: price ? line.variant?.sku || line.product.sku : line.product.sku, unitPrice: price.basePrice, quantity: line.item.quantity, lineSubtotal: money(Number(price.basePrice) * line.item.quantity), imageUrl: IMAGE_URL(line.product.name), createdAt: dateDaysAgo(orderIndex % 180) } }); }
      await prisma.orderStatusEvent.create({ data: { orderId: order.id, fromStatus: null, toStatus: status, actor: 'SYSTEM', note: 'Development seed order status.' } });
      sellerSequence += 1;
    }
    await prisma.checkoutSession.update({ where: { id: session.id }, data: { itemsSubtotal: money(sessionTotals.itemsSubtotal), discountTotal: money(sessionTotals.discountTotal), shippingTotal: money(sessionTotals.shippingTotal), taxTotal: money(sessionTotals.taxTotal), grandTotal: money(sessionTotals.grandTotal) } });
  }
  return { addresses, carts };
}

async function seedReviewsWishlistsNotifications(users, catalog) {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' }, take: 500 });
  const reviewBodies = [
    ['Excellent quality', 'The product arrived quickly and works exactly as described. The finish feels durable and the setup was straightforward.'],
    ['Great value', 'A strong everyday purchase with good packaging and reliable performance. I would recommend it for the price.'],
    ['Good but imperfect', 'The product is useful and matches the listing, although there are a few small details that could be improved.'],
    ['Could be better', 'It works, but the materials and delivery experience were below what I expected from the listing.'],
    ['Not for me', 'The product did not suit my needs. This is development review data for testing varied ratings and moderation.'],
  ];
  let reviewCount = 0;
  for (const order of orders) {
    for (const item of order.items.slice(0, 1)) {
      const rating = [5, 4, 3, 2, 1][reviewCount % 5]; const copy = reviewBodies[reviewCount % reviewBodies.length];
      await prisma.review.create({ data: { productId: item.productId, userId: order.userId, orderId: order.id, variantId: item.variantId, rating, title: copy[0], body: copy[1], helpfulCount: (reviewCount * 17) % 140, isVerifiedPurchase: true, images: reviewCount % 9 === 0 ? JSON.stringify([`https://placehold.co/600x600/png?text=Review+${reviewCount + 1}`]) : null, status: reviewCount % 23 === 0 ? 'FLAGGED' : 'PUBLISHED', createdAt: order.createdAt } });
      reviewCount += 1;
    }
  }
  for (let index = 0; index < users.buyers.length; index += 1) {
    const buyer = users.buyers[index]; const selected = catalog.products.filter((product) => product.status === 'ACTIVE').slice(index * 4, index * 4 + 4);
    for (const product of selected) await prisma.wishlistItem.create({ data: { userId: buyer.id, productId: product.id } });
    const notifications = [
      ['ORDER', 'Order delivered', 'Your development order has been delivered.'],
      ['PROMOTION', 'New marketplace deal', 'A new development promotion is available.'],
      ['SECURITY', 'Security reminder', 'This account contains development-only data.'],
    ];
    for (let itemIndex = 0; itemIndex < notifications.length; itemIndex += 1) {
      const notification = notifications[itemIndex];
      await prisma.notification.create({ data: { userId: buyer.id, type: notification[0], title: notification[1], message: notification[2], metadata: JSON.stringify({ development: true }), readAt: itemIndex === 0 && index % 2 === 0 ? dateDaysAgo(2) : null, createdAt: dateDaysAgo(index + itemIndex) } });
    }
  }
  return { reviewCount, wishlistCount: users.buyers.length * 4, notificationCount: users.buyers.length * 3 };
}

async function main() {
  await resetDatabase();
  const users = await seedUsers();
  const taxonomy = await seedTaxonomy();
  const sellerData = await seedSellers(users);
  const catalog = await seedCatalog(taxonomy, sellerData, users.admins[0]);
  await seedDeals(catalog, sellerData);
  const customerData = await seedCustomersAndOrders(users, catalog, sellerData);
  const socialData = await seedReviewsWishlistsNotifications(users, catalog);
  for (let index = 0; index < 30; index += 1) await prisma.orderNumberSequence.create({ data: { dateKey: dateDaysAgo(index).toISOString().slice(0, 10).replace(/-/g, ''), lastValue: 10 + index } });
  const counts = {};
  for (const model of ['user', 'seller', 'store', 'sellerApplication', 'category', 'brand', 'product', 'productMedia', 'variantCombination', 'inventory', 'productPrice', 'priceHistory', 'deal', 'discount', 'cart', 'cartItem', 'address', 'shippingMethod', 'shippingRate', 'stateTaxRate', 'checkoutSession', 'checkoutInventoryReservation', 'order', 'orderItem', 'orderStatusEvent', 'orderNumberSequence', 'review', 'wishlistItem', 'notification']) counts[model] = await prisma[model].count();
  console.log('\nDevelopment seed complete.');
  console.log(JSON.stringify(counts, null, 2));
  console.log('\nSafe development credentials (never use in production):');
  console.log(`Admin: admin1@marketplace.test / ${PASSWORD}`);
  console.log(`Seller: seller01@marketplace.test / ${PASSWORD}`);
  console.log(`Buyer: buyer01@marketplace.test / ${PASSWORD}`);
  console.log(`Addresses: ${customerData.addresses.length}, active carts: ${customerData.carts.length}`);
  console.log(`Reviews: ${socialData.reviewCount}, wishlists: ${socialData.wishlistCount}, notifications: ${socialData.notificationCount}`);
}

main().catch((error) => { console.error('Development seed failed:', error); process.exitCode = 1; }).finally(() => prisma.$disconnect());