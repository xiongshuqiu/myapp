//1.导入 Mongoose 模块：引入 Mongoose 模块以便与 MongoDB 数据库进行交互。
const mongoose = require('mongoose');

//2.定义用户模式 (Schema)：使用 Mongoose 的 Schema 类定义用户模式。模式描述了用户文档的结构。
const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    account: { type: String, required: true },
    userName: { type: String, required: true },
    passWord: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
});

//3.创建模型 (Model)：使用 mongoose.model 方法基于定义的模式创建一个名为 User 的模型。
//该模型代表数据库中的 users 集合，Mongoose 会将模型名称自动转换为小写复数形式。
//模型名称通常使用单数形式的名词，并且首字母大写。
const User = mongoose.model('User', userSchema);

//4.导出模型：导出 User 模型，以便在其他文件中可以通过 require 语句引入并使用该模型进行数据库操作。
module.exports = User;


   
   