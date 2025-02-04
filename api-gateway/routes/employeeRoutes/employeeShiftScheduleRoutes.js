
const express = require('express');
const router = express.Router();

const {
  getAllEmployeeShiftSchedules,
  getShiftInitialValues,
  generateMonthlyShiftSchedule,
  getEmployeeShiftScheduleById,
  updateEmployeeShiftSchedule,
  deleteEmployeeShiftSchedule
} = require('../../controllers/employeeController/employeeShiftScheduleController');
// 1. 获取所有值班安排
router.get('/',getAllEmployeeShiftSchedules);

// 2. 创建新的值班安排
//(1)获取新的排班初始值
router.get('/new', getShiftInitialValues);
// (2) 生成新的排班表
router.post('/create', generateMonthlyShiftSchedule);
// 3. 更新特定值班安排
// (1) 查找特定值班安排并显示编辑表单
router.get('/:_id/update', getEmployeeShiftScheduleById);
// (2) 提交更新后的值班安排数据
router.put('/:_id', updateEmployeeShiftSchedule);

// 4. 删除特定值班安排
router.delete('/:_id/delete', deleteEmployeeShiftSchedule);

module.exports = router;
