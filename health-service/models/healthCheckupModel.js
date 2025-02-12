const mongoose = require('mongoose');

// 5-6 健康体检模型
const HealthCheckupSchema = new Schema({
  checkupId: { type: String, required: true }, // 健康体检 ID，必须填写（例如 HC1）
  checkupName: { type: String, required: true }, // 健康体检名称，必须填写
  description: { type: String }, // 健康体检描述，可选
  checkupDate: { type: Date, required: true }, // 健康体检日期，必须填写
  createdAt: { type: Date, default: Date.now }, // 创建时间，默认为当前时间
  elderlyId: { type: String, ref: 'Elderly', required: true }, //老人唯一编号 E001
  employeeId: { type: String, ref: 'Employee', required: true }, // 员工编号，字符串类型 员工唯一编号S001
  careLevelId: { type: String, required: true }, // 护理任务 ID，必须填写（例如 CL1）
});

// 创建并导出健康体检模型
const HealthCheckup = mongoose.model('HealthCheckup', HealthCheckupSchema);
module.exports = HealthCheckup;
