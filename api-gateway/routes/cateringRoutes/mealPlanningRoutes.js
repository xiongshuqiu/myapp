// #frontend routes
const express = require('express');
const router = express.Router();

const {
  getAllMealPlannings,
  renderNewMealPlanningForm,
  createMealPlanning,
  getMealPlanningById,
  updateMealPlanning,
  deleteMealPlanning,
} = require('../../controllers/cateringController/MealPlanningController');
// 1. 获取所有膳食计划
router.get('/',getAllMealPlannings);

// 2. 创建新的膳食计划
// (1) 显示新增膳食计划表单
router.get('/new', renderNewMealPlanningForm);
// (2) 提交新的膳食计划
router.post('/create', createMealPlanning);

// 3. 更新特定膳食计划
// (1) 查找特定膳食计划并显示编辑表单
router.get('/:_id/update', getMealPlanningById);
// (2) 提交更新后的膳食计划
router.put('/:_id', updateMealPlanning);

// 4. 删除特定膳食计划
router.delete('/:_id/delete', deleteMealPlanning);

module.exports = router;
