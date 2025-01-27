// #frontend routes
const express = require('express');
const router = express.Router();
const {
  getAllBedAssignments,
  renderNewBedAssignmentForm,
  createBedAssignment,
  getBedAssignmentById,
  updateBedAssignment,
  deleteBedAssignment
} = require('../../controllers/bedController/bedAssignmentController');

// 1. 获取所有床位分配
router.get('/', getAllBedAssignments);

// 2. 创建新的床位分配
// (1) 显示新增床位分配表单(查找可用的bedId、elderlyId)
router.get('/new', renderNewBedAssignmentForm);
// (2) 提交新的床位分配数据
router.post('/create', createBedAssignment);

// 3. 更新特定床位分配
// (1) 查找特定床位分配
router.get('/:_id/update', getBedAssignmentById);
// (2) 提交更新后的床位分配数据
router.put('/:_id', updateBedAssignment);

// 4. 删除特定床位分配
router.delete('/:_id/delete', deleteBedAssignment);

module.exports = router;
