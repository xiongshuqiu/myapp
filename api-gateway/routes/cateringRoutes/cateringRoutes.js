// #frontend routes
const express = require('express');
const router = express.Router();
const mealSchedulingRoutes = require('./mealSchedulingRoutes.js');
const mealPlanningRoutes = require('./mealPlanningRoutes.js');
const personalizedDietRoutes = require('./personalizedDietRoutes.js');

router.use('/schedule-meals', mealSchedulingRoutes);
router.use('/plan-meals', mealPlanningRoutes);
router.use('/personalize-diet', personalizedDietRoutes);
module.exports = router;

