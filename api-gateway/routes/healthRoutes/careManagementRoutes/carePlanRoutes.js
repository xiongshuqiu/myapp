// #frontend routes
const express = require('express');
const router = express.Router();
const {
  getAllCarePlans,
  renderNewCarePlanForm,
  createCarePlan,
  getCarePlanById,
  updateCarePlan,
  deleteCarePlan
} = require('../../../controllers/healthController/careManagementController/carePlanController');
// 1. 获取所有护理计划
router.get('/', bntLinkVisibility, getAllCarePlans);

// 2. 创建新的护理计划
// (1) 显示新增护理计划表单(查找可用的bedId、elderlyId)
router.get('/new', renderNewCarePlanForm);
// (2) 提交新的护理计划数据
router.post('/create', createCarePlan);

// 3. 更新特定护理计划
// (1) 查找特定护理计划并显示编辑表单
router.get('/:_id/update', getCarePlanById);
// (2) 提交更新后的护理计划数据
router.put('/:_id', updateCarePlan);

// 4. 删除特定护理计划
router.delete('/:_id/delete', deleteCarePlan);

module.exports = router;
