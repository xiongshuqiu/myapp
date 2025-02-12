const mongoose = require('mongoose');

// 5-2护理等级模型
const CareLevelSchema = new Schema({
  careLevelId: { type: String, required: true }, // 护理等级记录 ID，必须填写CL1
  level: { type: String, required: true }, // 护理等级，必须填写
  description: { type: String }, // 护理等级的描述，可选字段
  createdAt: { type: Date, default: Date.now }, // 记录创建时间，默认值为当前日期和时间
});
const CareLevel = mongoose.model('CareLevel', CareLevelSchema);
module.exports =  CareLevel
   
  
