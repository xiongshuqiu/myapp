// #frontend routes
const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../../../middleware/authMiddleware');
const {
  bntLinkVisibility,
} = require('../../middleware/bntLinkVisibility');
const {
  getAllHealthCheckups,
  renderNewHealthCheckupForm,
  createHealthCheckup,
  getHealthCheckupById,
  updateHealthCheckup,
  deleteHealthCheckup,
} = require('../../controllers/healthController/healthCheckupController');
// 1. 获取所有健康体检
router.get('/',bntLinkVisibility,getAllHealthCheckups);

// 2. 创建新的健康体检
// (1) 显示新增老人入住退住表单
router.get('/new', renderNewHealthCheckupForm);
// (2) 提交新的健康体检
router.post('/create', createHealthCheckup);

// 3. 更新特定健康体检
// (1) 查找特定老人入住退住并显示编辑表单
router.get('/:_id/update', getHealthCheckupById);
// (2) 提交更新后的健康体检
router.put('/:_id', updateHealthCheckup);

// 4. 删除特定健康体检
router.delete('/:_id/delete', deleteHealthCheckup);

module.exports = router;
