// #frontend routes
const express = require('express');
const router = express.Router();
const bedStatusRoutes = require('./bedStatusRoutes.js');
const bedAssignmentRoutes = require('./bedAssignmentRoutes.js');

router.use('/status',bedStatusRoutes);
router.use('/assignment',bedAssignmentRoutes);
module.exports = router;




