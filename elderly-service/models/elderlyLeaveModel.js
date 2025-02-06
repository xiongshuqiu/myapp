const mongoose = require('mongoose');
// LeaveResident Schema
const elderlyLeaveSchema = new mongoose.Schema({
  leaveId: { type: String, required: true, unique: true }, // 申请编号 L001
  elderlyId: { type: String, ref: 'Elderly', required: true }, // 老人引用 E001
  type: { type: String, required: true, enum: ['Leave', 'CancelLeave'] }, // 申请类型: Leave 或 CancelLeave
  startDate: { type: Date, required: true }, // 请假开始日期
  endDate: { type: Date, required: true }, // 请假结束日期或销假日期
  reason: { type: String, required: true }, // 原因
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'Rejected'],
  }, // 状态：Pending（待处理）, Approved（批准）, Rejected（拒绝）
  appliedDate: { type: Date, default: Date.now }, // 申请日期
});

const ElderlyLeave = mongoose.model('ElderlyLeave', elderlyLeaveSchema);

module.exports = ElderlyLeave;
