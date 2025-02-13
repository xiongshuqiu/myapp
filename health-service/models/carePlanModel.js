const mongoose = require('mongoose');
// 5-4护理计划模型
const CarePlanSchema =  new mongoose.Schema({
  carePlanId: { type: String, required: true }, // 护理计划记录 ID，必须填写PL1
  planName: { type: String, required: true }, // 计划名称，必须填写
  description: { type: String }, // 计划描述，可选字段
  startDate: { type: Date, required: true }, // 开始日期，必须填写
  endDate: { type: Date }, // 结束日期，可选字段
  careProjectId: { type: String, ref: 'CareProject', required: true }, // 关联 CareProject
  createdAt: { type: Date, default: Date.now }, // 记录创建时间，默认值为当前日期和时间
});
const CarePlan = mongoose.model('CarePlan', CarePlanSchema);
module.exports = CarePlan;
