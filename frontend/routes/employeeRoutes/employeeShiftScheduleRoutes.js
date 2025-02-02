// #frontend routes
const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../../../middleware/authMiddleware');
const {
  bntLinkVisibility,
} = require('../../visibilityMiddleware/bntLinkVisibility');
const {
  getAllEmployeeShiftSchedules,
  renderNewEmployeeShiftScheduleForm,
  createEmployeeShiftSchedule,
  getEmployeeShiftScheduleById,
  updateEmployeeShiftSchedule,
  deleteEmployeeShiftSchedule
} = require('../../controllers/elderlyController/employeeShiftScheduleController');

// 1. 获取所有值班安排
router.get('/', bntLinkVisibility, getAllEmployeeShiftSchedules);

// 2. 创建新的值班安排
// (1) 显示新增值班安排表单
router.get('/new', renderNewEmployeeShiftScheduleForm);
// (2) 提交新的值班安排数据
router.post('/create', createEmployeeShiftSchedule);

// 3. 更新特定值班安排
// (1) 查找特定值班安排并显示编辑表单
router.get('/:_id/update', getEmployeeShiftScheduleById);
// (2) 提交更新后的值班安排数据
router.put('/:_id', updateEmployeeShiftSchedule);

// 4. 删除特定值班安排
router.delete('/:_id/delete', deleteEmployeeShiftSchedule);

module.exports = router;
