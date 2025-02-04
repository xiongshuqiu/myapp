const mongoose = require('mongoose');

// EmployeeShiftSchedule Schema
const employeeShiftScheduleSchema = new mongoose.Schema({
  shiftScheduleId: { type: String, required: true, unique: true }, // 值班编号
  employeeId: { type: String, ref: 'Employee', required: true }, // 员工编号，字符串类型
  shiftType: { type: String, enum: ['Morning', 'Evening', 'Night'], required: true }, // 班次类型
  startTime: { type: Date, required: true }, // 开始时间
  endTime: { type: Date, required: true } // 结束时间
});

const EmployeeShiftSchedule = mongoose.model(
  'EmployeeShiftSchedule',
  employeeShiftScheduleSchema
);

module.exports = EmployeeShiftSchedule;
