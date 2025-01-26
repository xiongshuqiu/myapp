//1.导入 Mongoose 模块：引入 Mongoose 模块以便与 MongoDB 数据库进行交互。
const mongoose = require('mongoose');

 //2. BedStatus Schema
 const bedStatusSchema = new mongoose.Schema({
   bedId: { type: String, required: true, unique: true }, // 床位编号 3-1-101s-01
   building: { type: Number, required: true }, // 楼栋号 3
   floor: { type: Number, required: true }, // 楼层1
   room: { type: String, required: true }, // 房间号101
   roomType: { type: String, enum: ['s', 'b'], default: 's' }, // 房型s或b
   bedNumber: { type: String, required: true }, // 床位编号01/02/03/04/05
   status: { type: String, required: true }, // occupied/available/reserved/maintenance
 });
 
 module.exports = mongoose.model('BedStatus', bedStatusSchema);
 

//3.创建模型 (Model)：使用 mongoose.model 方法基于定义的模式创建一个名为 bedStatus 的模型。
//该模型代表数据库中的 users 集合，Mongoose 会将模型名称自动转换为小写复数形式。
//模型名称通常使用单数形式的名词，并且首字母大写。
const BedStatus = mongoose.model('BedStatus', bedStatusSchema);

//4.导出模型：导出 User 模型，以便在其他文件中可以通过 require 语句引入并使用该模型进行数据库操作。
module.exports = BedStatus;
