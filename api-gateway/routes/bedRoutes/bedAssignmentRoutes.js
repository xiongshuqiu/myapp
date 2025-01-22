// #frontend routes
const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../../../middleware/authMiddleware');
const {
  bntLinkVisibility,
} = require('../../visibilityMiddleware/bntLinkVisibility');
const {
  getAllBedStatuses,
  renderNewBedStatusForm,
  createBedStatus,
  getBedStatusById,
  updateBedStatus,
  deleteBedStatus,
} = require('../../controllers/bedController/bedStatusController');

// 1. 获取所有床位状态
router.get('/', bntLinkVisibility, getAllBedStatuses);

// 2. 创建新的床位状态
// (1) 显示新增床位状态表单
router.get('/new', renderNewBedStatusForm);
// (2) 提交新的床位状态数据
router.post('/create', createBedStatus);

// 3. 更新特定床位状态
// (1) 查找特定床位状态并显示编辑表单
router.get('/:_id/update', getBedStatusById);
// (2) 提交更新后的床位状态数据
router.put('/:_id', updateBedStatus);

// 4. 删除特定床位状态
router.delete('/:_id/delete', deleteBedStatus);

module.exports = router;
