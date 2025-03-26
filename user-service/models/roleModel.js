//1.导入 Mongoose 模块：引入 Mongoose 模块以便与 MongoDB 数据库进行交互。
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleId: { type: String, required: true, unique: true }, // 角色唯一编号管理员R001，医护角色R002，家属角色R003
  role: { type: String, required: true, enum: ['admin', 'family', 'medical'] },
});
const Role = mongoose.model('Role', roleSchema);

//4.导出模型：导出 User 模型，以便在其他文件中可以通过 require 语句引入并使用该模型进行数据库操作。
module.exports = Role;


   
   