// #frontend routes
const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../../../middleware/authMiddleware');
const {
  bntLinkVisibility,
} = require('../../middleware/bntLinkVisibility');
const {
  getAllElderlyLeaveRequests,
  renderNewElderlyLeaveRequestForm,
  createElderlyLeaveRequest,
  getElderlyLeaveRequestById,
  updateElderlyLeaveRequest,
  deleteElderlyLeaveRequest
} = require('../../controllers/elderlyController/elderlyLeaveController');
// 1. 获取所有老人请假请求
router.get('/', bntLinkVisibility, getAllElderlyLeaveRequests);

// 2. 创建新的老人请假请求
// (1) 显示老人申请请假表单(查找elderlyId)
router.get('/new', renderNewElderlyLeaveRequestForm);
// (2) 提交老人请假请求数据
router.post('/create', createElderlyLeaveRequest);

// 3. 管理员批复老人请假请求
// (1) 查找特定老人请假请求并进行批复
router.get('/:_id/update', getElderlyLeaveRequestById);
// (2) 提交更新后的老人请假请求数据
router.put('/:_id', updateElderlyLeaveRequest);
//4.老人删除请假请求
router.delete('/:_id/delete', deleteElderlyLeaveRequest);
module.exports = router;
