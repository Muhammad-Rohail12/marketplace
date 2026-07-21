const express = require('express');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

// Mounted future routes will follow this pattern:
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/orders', orderRoutes);

router.use('/', healthRoutes);

module.exports = router;