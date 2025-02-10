const mongoose = require('mongoose');
// ElderlyLeave Schema
const elderlyLeaveSchema = new mongoose.Schema({
  leaveId: { type: String, required: true },//LR001
  elderlyId: { type: String, required: true, ref: 'Elder' },
  reason: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  type: { type: String, enum: ['leave', 'return'], required: true }, // 新增字段，用于区分请假和销假
  additionalNotes: { type: String, default: '' }, // 存储附加说明
  applicationDate: { type: Date, default: Date.now },
});
const ElderlyLeave = mongoose.model('ElderlyLeave', elderlyLeaveSchema);

module.exports = ElderlyLeave;
