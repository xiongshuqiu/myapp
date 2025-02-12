const express = require('express');
const router = express.Router();
const careLevelRoutes = require('./careManagementRoutes/careLevelRoutes.js');
const careProjectRoutes = require('./careManagementRoutes/careProjectRoutes.js');
const carePlanRoutes = require('./careManagementRoutes/carePlanRoutes.js');
const careTaskRoutes = require('./careManagementRoutes/careTaskRoutes.js');

router.use('/level', careLevelRoutes);
router.use('/project', careProjectRoutes);
router.use('/plan', carePlanRoutes);
router.use('/task', careTaskRoutes);
module.exports = router;

