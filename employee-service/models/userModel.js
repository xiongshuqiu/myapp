//1.导入 Mongoose 模块：引入 Mongoose 模块以便与 MongoDB 数据库进行交互。
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // 用户唯一编号 管理员U001，医护U002（员工）、家属F001
  status: { type: String, required: true },//status:Occupied/Available
  userName: { type: String, required: true },
  passWord: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);


module.exports = User;
