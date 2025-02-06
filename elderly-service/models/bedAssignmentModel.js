const mongoose = require('mongoose');
// Bed Assignment Schema
const bedAssignmentSchema = new mongoose.Schema({
  assignmentId: { type: String, required: true, unique: true }, // 分配编号 A001
  bedId: { type: String, ref: 'BedStatus', required: true }, // 床位引用 3-1-101s-01
  elderlyId: { type: String, ref: 'Elderly', required: true }, // 老人引用 E001
  assignedDate: { type: Date, default: Date.now }, // 分配日期
  releaseDate: { type: Date }, // 释放日期
});
const BedAssignment = mongoose.model('BedAssignment', bedAssignmentSchema);
module.exports = BedAssignment;
