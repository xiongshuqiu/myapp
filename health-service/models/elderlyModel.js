const mongoose = require('mongoose');
// Elderly Schema
const elderlySchema = new mongoose.Schema({
  elderlyId: { type: String, required: true, unique: true }, // 老人唯一编号 E001
  elderlyName: { type: String, required: true }, // 老人姓名
  elderlyPhone: { type: String, required: true }, // 老人电话
  dateOfBirth: { type: Date, required: true }, // 生日
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] }, // 性别
  address: { type: String, required: true }, // 地址
  medicalHistory: { type: String }, // 医疗史
  allergies: { type: String }, // 过敏史
  emergencyContactName: { type: String, required: true }, // 紧急联系人姓名
  emergencyContactPhone: { type: String, required: true }, // 紧急联系人电话
  userId: { type: String, ref: 'User' }, // 家属登录 Id 唯一编号 F001
  employeeId: { type: String, ref: 'Employee' }, // 关联负责的医生S002
});

const Elderly = mongoose.model('Elderly', elderlySchema);

module.exports = Elderly;
