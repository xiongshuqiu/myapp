const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // 用户唯一编号 S002
  account: { type: String, required: true },
  userName: { type: String, required: true },
  passWord: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Elderly Schema
const elderlySchema = new mongoose.Schema({
  elderlyId: { type: String, required: true, unique: true }, // 老人唯一编号 E001
  elderlyName: { type: String, required: true }, // 老人姓名
  elderlyPhophe: { type: String, required: true },
  emergencyContactName: { type: String, required: true }, // 家庭紧急情况联系人姓名
  userId: { type: String, ref: 'User' }, // 家属登录 Id 唯一编号 F001
  employeeId: { type: String, ref: 'Employee' }, // 关联负责的医生S002
});
const Elderly = mongoose.model('Elderly', elderlySchema);

// Bed Assignment Schema
const bedAssignmentSchema = new mongoose.Schema({
  assignmentId: { type: String, required: true, unique: true }, // 分配编号 A001
  bedId: { type: String, ref: 'BedStatus', required: true }, // 床位引用 3-7-701-B01
  elderlyId: { type: String, ref: 'Elderly', required: true }, // 老人引用 E001
  assignedDate: { type: Date, default: Date.now }, // 分配日期
  releaseDate: { type: Date } // 释放日期
});
const BedAssignment = mongoose.model('BedAssignment', bedAssignmentSchema);

// BedStatus Schema
const bedStatusSchema = new mongoose.Schema({
  bedId: { type: String, required: true, unique: true }, // 床位编号 3-1-101s-01
  building: { type: Number, required: true }, // 楼栋号 3
  floor: { type: Number, required: true }, // 楼层1
  room: { type: String, required: true }, // 房间号101
  roomType: { type: String, enum: ['s', 'b'], default: 's' }, // 房型s或b
  bedNumber: { type: String, required: true }, // 床位编号01/02/03/04/05
  status: { type: String, required: true }, // occupied/available/reserved/maintenance
});
const BedStatus = mongoose.model('BedStatus', bedStatusSchema);
// Employee Schema
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true }, // 员工唯一编号
  employeeName: { type: String, required: true }, // 员工姓名
  position: { type: String, required: true }, // 员工职位
  contactNumber: { type: String, required: true }, // 联系电话
});
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = { User, Elderly, BedAssignment, BedStatus, Employee };
