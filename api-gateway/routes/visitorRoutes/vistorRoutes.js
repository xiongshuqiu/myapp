// #frontend routes
const express = require('express');
const router = express.Router();
const visitorRegistrationRoutes = require('./visitorRegistrationRoutes.js');
const appointmentSchedulingRoutes = require('./appointmentSchedulingRoutes.js');

router.use('/vistor-management/register-visitor', visitorRegistrationRoutes); // /vistor-management/来访登记
router.use('/vistor-management/schedule-appointment', appointmentSchedulingRoutes); // /vistor-management/来访预约
module.exports = router;
