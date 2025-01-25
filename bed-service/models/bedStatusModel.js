//1.导入 Mongoose 模块：引入 Mongoose 模块以便与 MongoDB 数据库进行交互。
const mongoose = require('mongoose');

 //2. BedStatus Schema
const bedStatusSchema = new mongoose.Schema({
  bedId: { type: String, required: true }, // 床位编号 3-7-701s-01
  building: { type: String, required: true, index: true }, // 楼栋号
  floor: { type: String, required: true }, // 楼层
  room: { type: String, required: true }, // 房间号
  status: { type: String, required: true }, // 占用状态
});

//3.创建模型 (Model)：使用 mongoose.model 方法基于定义的模式创建一个名为 bedStatus 的模型。
//该模型代表数据库中的 users 集合，Mongoose 会将模型名称自动转换为小写复数形式。
//模型名称通常使用单数形式的名词，并且首字母大写。
const BedStatus = mongoose.model('BedStatus', bedStatusSchema);

//4.导出模型：导出 User 模型，以便在其他文件中可以通过 require 语句引入并使用该模型进行数据库操作。
module.exports = BedStatus;
