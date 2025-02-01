//1.导入 Mongoose 模块：引入 Mongoose 模块以便与 MongoDB 数据库进行交互。
const mongoose = require('mongoose');


// Employee Schema
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true }, // 员工唯一编号S001
  employeeName: { type: String, required: true }, // 员工姓名
  position: { type: String, required: true }, // 员工职位
  contactNumber: { type: String, required: true }, // 联系电话
  email: { type: String, required: true, unique: true }, // 电子邮件
  userId: { type: String, ref: 'User' }, // 医护登录 Id 唯一编号 U002
});
const Employee = mongoose.model('Employee', employeeSchema);
 

//4.导出模型：导出 User 模型，以便在其他文件中可以通过 require 语句引入并使用该模型进行数据库操作。
module.exports = {  Employee };
