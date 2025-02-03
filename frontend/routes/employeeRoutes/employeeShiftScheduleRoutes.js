// #frontend routes
const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../../../middleware/authMiddleware');
const {
  bntLinkVisibility,
} = require('../../visibilityMiddleware/bntLinkVisibility');
const {
  getAllEmployeeShiftSchedules,
  generateMonthlyShiftSchedule,
  getCurrentWeekShiftSchedule,
  getEmployeeShiftScheduleById,
  updateEmployeeShiftSchedule,
  deleteEmployeeShiftSchedule
} = require('../../controllers/elderlyController/employeeShiftScheduleController');

// 1. 获取所有值班安排
router.get('/', bntLinkVisibility, getAllEmployeeShiftSchedules);

// 2. 创建新的值班安排
// (1) 生成按月的排班表
router.post('/generate-monthly-schedule', generateMonthlyShiftSchedule);
// (2) 获取本周排班表
router.get('/current-week-schedule', getCurrentWeekShiftSchedule);


// 3. 更新特定值班安排
// (1) 查找特定值班安排并显示编辑表单
router.get('/:_id/update', getEmployeeShiftScheduleById);
// (2) 提交更新后的值班安排数据
router.put('/:_id', updateEmployeeShiftSchedule);

// 4. 删除特定值班安排
router.delete('/:_id/delete', deleteEmployeeShiftSchedule);

module.exports = router;
