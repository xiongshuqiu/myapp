// #frontend routes
const express = require('express');
const router = express.Router();
const elderlyRecordRoutes = require('./elderlyRecordRoutes.js');
// const elderlyLeaveRoutes = require('./elderlyLeaveRoutes.js');
 const elderlyResidentRoutes = require('./elderlyResidentRoutes.js');

router.use('/record',elderlyRecordRoutes);
// router.use('/leave', elderlyLeaveRoutes);
 router.use('/resident',elderlyResidentRoutes);
module.exports = router;


