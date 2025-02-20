// #frontend routes
const express = require('express');
const router = express.Router();

const {
  getAllAppointmentSchedulings,
  renderNewAppointmentSchedulingForm,
  createAppointmentScheduling,
  getAppointmentSchedulingById,
  updateAppointmentScheduling,
  deleteAppointmentScheduling
} = require('../../controllers/visitorController/appointmentSchedulingController');

// 1. 获取所有预约登记
router.get('/',getAllAppointmentSchedulings);

// 2. 创建新的预约登记
// (1) 显示新增预约登记表单
router.get('/new', renderNewAppointmentSchedulingForm);
// (2) 提交新的预约登记数据
router.post('/create', createAppointmentScheduling);

// 3. 更新特定预约登记
// (1) 查找特定预约登记并显示编辑表单
router.get('/:_id/update', getAppointmentSchedulingById);
// (2) 提交更新后的预约登记数据
router.put('/:_id', updateAppointmentScheduling);

// 4. 删除特定预约登记
router.delete('/:_id/delete', deleteAppointmentScheduling);

module.exports = router;
