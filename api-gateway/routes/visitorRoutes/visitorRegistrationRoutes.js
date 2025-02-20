// #frontend routes
const express = require('express');
const router = express.Router();

const {
  getAllVisitorRegistrations,
  renderNewVisitorRegistrationForm,
  createVisitorRegistration,
  getVisitorRegistrationById,
  updateVisitorRegistration,
  deleteVisitorRegistration
} = require('../../controllers/visitorController/visitorRegistrationController');

// 1. 获取所有员工档案
router.get('/',getAllVisitorRegistrations);

// 2. 创建新的员工档案
// (1) 显示新增员工档案表单
router.get('/new', renderNewVisitorRegistrationForm);
// (2) 提交新的员工档案数据
router.post('/create', createVisitorRegistration);

// 3. 更新特定员工档案
// (1) 查找特定员工档案并显示编辑表单
router.get('/:_id/update', getVisitorRegistrationById);
// (2) 提交更新后的员工档案数据
router.put('/:_id', updateVisitorRegistration);

// 4. 删除特定员工档案
router.delete('/:_id/delete', deleteVisitorRegistration);

module.exports = router;
