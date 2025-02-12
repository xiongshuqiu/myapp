// #frontend routes
const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../../../middleware/authMiddleware');
const {
  bntLinkVisibility,
} = require('../../visibilityMiddleware/bntLinkVisibility');
const {
  getAllHealthRecords,
  renderNewHealthRecordForm,
  createHealthRecord,
  getHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord
} = require('../../controllers/healthController/healthRecordController.js');
// 1. 获取所有老人健康档案
router.get('/', bntLinkVisibility, getAllHealthRecords);

// 2. 创建新的老人健康档案
// (1) 显示老人申请请假表单
router.get('/new', renderNewHealthRecordForm);
// (2) 提交老人健康档案数据
router.post('/create', createHealthRecord);

// 3. 更新老人健康档案
// (1) 查找特定老人健康档案数据
router.get('/:_id/update', getHealthRecordById);
// (2) 提交更新后的老人健康档案数据
router.put('/:_id', updateHealthRecord);
//4.删除老人健康档案
router.delete('/:_id/delete', deleteHealthRecord);
module.exports = router;
