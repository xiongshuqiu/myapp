const mongoose = require('mongoose');
const elderlySchema = new mongoose.Schema({
  elderlyId: { type: String, required: true, unique: true, trim: true },
  elderlyName: { type: String, required: true, trim: true },
  elderlyPhone: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  photo: { type: String, required: true, trim: true },
  userId: { type: String, ref: 'User', trim: true },
  employeeId: { type: String, ref: 'Employee', trim: true },
});
const Elderly = mongoose.model('Elderly', elderlySchema);
module.exports = Elderly;
