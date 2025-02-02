// #frontend routes
const express = require('express');
const router = express.Router();
const employeeRecordRoutes = require('./employeeRecordRoutes.js');
const employeeShiftScheduleRoutes = require('./employeeShiftScheduleRoutes.js');

router.use('/record',employeeRecordRoutes);
router.use('/shiftSchedule',employeeShiftScheduleRoutes);
module.exports = router;




