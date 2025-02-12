const mongoose = require('mongoose');
const CareProjectSchema = new Schema({
  careProjectId: { type: String, required: true }, // 护理项目记录 ID，必须填写CP1
  projectName: { type: String, required: true }, // 项目名称，必须填写
  description: { type: String }, // 项目描述，可选字段
  careLevelId: {
    type: String,
    ref: 'CareLevel',
    required: true,
  }, // 关联 CareLevel
  createdAt: { type: Date, default: Date.now }, // 记录创建时间，默认值为当前日期和时间
});
const CareProject = mongoose.model('CareProject', CareProjectSchema);

module.exports = CareProject;
