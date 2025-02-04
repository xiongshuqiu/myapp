// #frontend routes
const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../../../middleware/authMiddleware');
const {
  bntLinkVisibility,
} = require('../../visibilityMiddleware/bntLinkVisibility');
const {
  getAllEmployeeRecords,
  renderNewEmployeeRecordForm,
  createEmployeeRecord,
  getEmployeeRecordById,
  updateEmployeeRecord,
  deleteEmployeeRecord
} = require('../../controllers/employeeController/employeeRecordController');

// 1. 获取所有员工档案
router.get('/',bntLinkVisibility,getAllEmployeeRecords);

// 2. 创建新的员工档案
// (1) 显示新增员工档案表单
router.get('/new', renderNewEmployeeRecordForm);
// (2) 提交新的员工档案数据
router.post('/create', createEmployeeRecord);

// 3. 更新特定员工档案
// (1) 查找特定员工档案并显示编辑表单
router.get('/:_id/update', getEmployeeRecordById);
// (2) 提交更新后的员工档案数据
router.put('/:_id', updateEmployeeRecord);

// 4. 删除特定员工档案
router.delete('/:_id/delete', deleteEmployeeRecord);

module.exports = router;
