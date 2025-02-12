// #frontend routes
const express = require('express');
const router = express.Router();
const healthRecordRoutes = require('./healthRecordRoutes.js');
const careManagementRoutes = require('./careManagementRoutes.js');
const healthCheckupRoutes = require('./healthCheckupRoutes.js');

router.use('/record', healthRecordRoutes);
router.use('/care', careManagementRoutes);
router.use('/checkup', healthCheckupRoutes);
module.exports = router;
