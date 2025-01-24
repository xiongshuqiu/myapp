const mongoose = require('mongoose');
// User Schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },//U001
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
  eldlyName: { type: String, required: true }, // 老人姓名
  elderlyId: { type: String, required: true, unique: true }, // 老人唯一编号E001
  elderlyPhophe: { type: String, required: true }, 
  FamilyMemberName: { type: String, required: true }, // 家属姓名
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 家属登录Id唯一编号U001
});
const Elderly = mongoose.model('Elderly', elderlySchema);
// Bed Assignment Schema
const bedAssignmentSchema = new mongoose.Schema({
  assignmentId: { type: String, required: true, unique: true }, // 分配编号A001
  bedId: { type: mongoose.Schema.Types.ObjectId, ref: 'BebedStatusd', required: true }, // 床位引用3-7-701-B01
  elderly: { type: mongoose.Schema.Types.ObjectId, ref: 'Elderly', required: true }, // 老人引用
  assignedDate: { type: Date, default: Date.now }, // 分配日期
});
const BedAssignment = mongoose.model('BedAssignment', bedAssignmentSchema);

// BedStatus Schema
const bedStatusSchema = new mongoose.Schema({
  
    bedId: { type: String, required: true }, // 床位编号 3-7-701-B01
    building: { type: String, required: true, index: true }, // 楼栋号
    floor: { type: String, required: true }, // 楼层
    room: { type: String, required: true }, // 房间号
    status: { type: String, required: true }, // 占用状态
  });
  
  const BedStatus = mongoose.model('BedStatus', bedStatusSchema);
  

// Module Exports
module.exports = { User,Elderly,BedAssignment,BedStatus };
