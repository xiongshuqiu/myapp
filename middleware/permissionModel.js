//1.导入 Mongoose 模块：引入 Mongoose 模块以便与 MongoDB 数据库进行交互。
const mongoose = require('mongoose');

//用户权限模型
const permissionSchema = new mongoose.Schema({
  permissionId: { type: String, required: true, unique: true },
  roleId: { type: String, required: true, ref: 'Role' },
  service: { type: String, required: true },
  subService: { type: String, required: true },
  actions: {
    add: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    view: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
});
const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;
