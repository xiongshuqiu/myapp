const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // 用户唯一编号 管理员U001，医护U002（员工）、家属F001
  status: { type: String, required: true }, //status:Occupied/Available
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
  elderlyPhone: { type: String, required: true }, // 老人电话
  dateOfBirth: { type: Date, required: true }, // 生日
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] }, // 性别
  address: { type: String, required: true }, // 地址
  medicalHistory: { type: String }, // 医疗史
  allergies: { type: String }, // 过敏史
  emergencyContactName: { type: String, required: true }, // 紧急联系人姓名
  emergencyContactPhone: { type: String, required: true }, // 紧急联系人电话
  userId: { type: String, ref: 'User' }, // 家属登录 Id 唯一编号 F001
  employeeId: { type: String, ref: 'Employee' }, // 关联负责的医生S002
});

const Elderly = mongoose.model('Elderly', elderlySchema);

// Bed Assignment Schema
const bedAssignmentSchema = new mongoose.Schema({
  assignmentId: { type: String, required: true, unique: true }, // 分配编号 A001
  bedId: { type: String, ref: 'BedStatus', required: true }, // 床位引用 3-1-101s-01
  elderlyId: { type: String, ref: 'Elderly', required: true }, // 老人引用 E001
  assignedDate: { type: Date, default: Date.now }, // 分配日期
  releaseDate: { type: Date }, // 释放日期
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
  employeeId: { type: String, required: true, unique: true }, // 员工唯一编号S001
  employeeName: { type: String, required: true }, // 员工姓名
  position: { type: String, required: true }, // 员工职位:Management\Doctor\Catering\Finance\Other
  contactNumber: { type: String, required: true }, // 联系电话
  email: { type: String, required: true, unique: true }, // 电子邮件
  userId: { type: String, ref: 'User' }, // 医护登录 Id 唯一编号 U002
  status: { type: String, required: true }, //status:Active/Inactive
});
const Employee = mongoose.model('Employee', employeeSchema);

// EmployeeShiftSchedule Schema
const employeeShiftScheduleSchema = new mongoose.Schema({
  shiftScheduleId: { type: String, required: true, unique: true }, // 值班编号
  employeeId: { type: String, ref: 'Employee', required: true }, // 员工编号，字符串类型
  shiftType: {
    type: String,
    enum: ['Morning', 'Evening', 'Night'],
    required: true,
  }, // 班次类型
  startTime: { type: Date, required: true }, // 开始时间
  endTime: { type: Date, required: true }, // 结束时间
});

const EmployeeShiftSchedule = mongoose.model(
  'EmployeeShiftSchedule',
  employeeShiftScheduleSchema,
);
// ElderlyResident Schema
const elderlyResidentSchema = new mongoose.Schema({
  residentId: { type: String, required: true, unique: true }, // 老人唯一编号 R001
  elderlyId: { type: String, ref: 'Elderly', required: true }, // 老人引用 E001
  checkInTime: { type: Date, required: true }, // 入住时间
  checkOutTime: { type: Date }, // 退住时间
  status: { type: String, required: true }, // 状态: Active/Inactive
});

const ElderlyResident = mongoose.model(
  'ElderlyResident',
  elderlyResidentSchema,
);

// ElderlyLeave Schema
const elderlyLeaveSchema = new mongoose.Schema({
  leaveId:{ type: String, required: true },
  elderlyId: {type: String, required: true, ref: 'Elder' },
  reason: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  type: { type: String, enum: ['leave', 'return'], required: true },  // 新增字段，用于区分请假和销假
  additionalNotes: { type: String, default: '' },  // 存储附加说明
  applicationDate: { type: Date, default: Date.now }
});
const ElderlyLeave = mongoose.model('ElderlyLeave', elderlyLeaveSchema);

module.exports = {
  User,
  Elderly,
  BedAssignment,
  BedStatus,
  Employee,
  EmployeeShiftSchedule,
  ElderlyResident,
  ElderlyLeave,
};
