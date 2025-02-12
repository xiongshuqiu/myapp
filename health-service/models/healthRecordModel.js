const mongoose = require('mongoose');
// 5-1健康档案模型
const HealthRecordSchema = new Schema({
  healthRecordId: { type: String, required: true }, // 健康记录 ID，必须填写HR1
  elderlyId: { type: String, ref: 'Elderly', required: true }, // 老人引用，必须填写
  medicalHistory: [{ type: String, trim: true }], // 患者病史，可选字段，存储多个病史条目，示例：["高血压", "糖尿病", "心脏病"]
  allergies: [{ type: String, trim: true }], // 患者过敏史，可选字段，存储多个过敏条目，示例：["花生", "青霉素", "尘螨"]
  medications: [{ type: String, trim: true }], // 患者正在服用的药物，可选字段，存储多个药物条目，示例：["阿司匹林", "二甲双胍", "依那普利"]
  createdAt: { type: Date, default: Date.now }, // 记录创建时间，默认值为当前日期和时间
});
const HealthRecord = mongoose.model('HealthRecord', HealthRecordSchema);
module.exports =  HealthRecord
