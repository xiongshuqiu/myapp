const mongoose = require('mongoose');
// ElderlyResident Schema
const elderlyResidentSchema = new mongoose.Schema({
  residentId: { type: String, required: true, unique: true }, // 老人唯一编号 R001
  elderlyId: { type: String, ref: 'Elderly', required: true }, // 老人引用 E001
  checkInTime: { type: Date, required: true }, // 入住时间
  checkOutTime: { type: Date }, // 退住时间
  status: { type: String, required: true }, // 状态: Active/Inactive
});

const ElderlyResident = mongoose.model(
  'ElderlyResident',
  elderlyResidentSchema,
);
module.exports = ElderlyResident;
