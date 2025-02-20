// #frontend routes
const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../../../middleware/authMiddleware.js');
const {
  bntLinkVisibility,
} = require('../../visibilityMiddleware/bntLinkVisibility.js');
const {
  getAllMealSchedulings,
  renderNewMealSchedulingForm,
  createMealScheduling,
  getMealSchedulingById,
  updateMealScheduling,
  deleteMealScheduling
} = require('../../controllers/cateringController/mealSchedulingController.js');
// 1. 获取所有膳食安排
router.get('/', bntLinkVisibility, getAllMealSchedulings);

// 2. 创建新的膳食安排
// (1) 显示膳食安排表单
router.get('/new', renderNewMealSchedulingForm);
// (2) 提交膳食安排数据
router.post('/create', createMealScheduling);

// 3. 更新膳食安排
// (1) 查找特定膳食安排数据
router.get('/:_id/update', getMealSchedulingById);
// (2) 提交更新后的膳食安排数据
router.put('/:_id', updateMealScheduling);
//4.删除膳食安排
router.delete('/:_id/delete', deleteMealScheduling);
module.exports = router;
