//1.导入 Mongoose 模块：引入 Mongoose 模块以便与 MongoDB 数据库进行交互。
const mongoose = require('mongoose');

// 5-5 护理任务模型
const CareTaskSchema =  new mongoose.Schema({
  careTaskId: { type: String, required: true }, // 护理任务 ID，必须填写（例如 CT1）
  taskName: { type: String, required: true }, // 任务名称，必须填写
  description: { type: String }, // 任务描述，可选
  dueDate: { type: Date, required: true }, // 截止日期，必须填写
  carePlanId: { type: String, ref: 'CarePlan', required: true }, // 关联的护理计划 ID，必须填写
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'], // 任务状态，可以是"Pending"（待处理）,"In Progress"（进行中）或"Completed"（已完成）
    default: 'Pending', // 默认状态为"Pending"
  },
  elderlyId: { type: String, ref: 'Elderly', required: true }, //老人唯一编号 E001
  employeeId: { type: String, ref: 'Employee', required: true }, //  员工唯一编号S001
  createdAt: { type: Date, default: Date.now }, // 创建时间，默认为当前时间
});

const CareTask = mongoose.model('CareTask', CareTaskSchema);
module.exports = CareTask;
