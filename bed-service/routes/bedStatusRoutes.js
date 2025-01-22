// #frontend routes
const express = require('express');
const router = express.Router();
const {
  getAllBedStatuses,
  createBedStatus,
  getBedStatusById,
  updateBedStatus,
  deleteBedStatus
} = require('../controllers/bedStatusController');


// 1. 获取所有床位状态
router.get('/',getAllBedStatuses);

// 2. 创建新的床位状态
router.post('/create', createBedStatus);

// 3. 更新特定床位状态
// (1) 查找特定床位状态并显示编辑表单
router.get('/:_id/update', getBedStatusById);
// (2) 提交更新后的床位状态数据
router.put('/:_id', updateBedStatus);

// 4. 删除特定床位状态
router.delete('/:_id/delete', deleteBedStatus);

module.exports = router;
