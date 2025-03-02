const mongoose = require('mongoose');
//1-1 用户模型
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

//用户权限模型
const permissionSchema = new mongoose.Schema({
  role: { type: String, required: true },
  service: { type: String, required: true },
  subService: { type: String, required: true },
  add: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  delete: { type: Boolean, default: false }
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;

// 2-1老人信息模型
const elderlySchema = new mongoose.Schema({
  elderlyId: { type: String, required: true, unique: true }, // 老人唯一编号 E001
  elderlyName: { type: String, required: true }, // 老人姓名
  elderlyPhone: { type: String, required: true }, // 老人电话
  dateOfBirth: { type: Date, required: true }, // 生日
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] }, // 性别
  address: { type: String, required: true }, // 地址
  photo: { type: String, required: true }, // 老人照片
  emergencyContactName: { type: String, required: true }, // 紧急联系人姓名
  emergencyContactPhone: { type: String, required: true }, // 紧急联系人电话
  userId: { type: String, ref: 'User' }, // 家属登录 Id 唯一编号 F001
  employeeId: { type: String, ref: 'Employee' }, // 关联负责的医生S002
});

const Elderly = mongoose.model('Elderly', elderlySchema);

// 2-2老人入住退住模型
const elderlyResidentSchema = new mongoose.Schema({
  residentId: { type: String, required: true, unique: true }, // 住宿编号 R001
  elderlyId: { type: String, ref: 'Elderly', required: true }, // 老人引用 E001
  checkInTime: { type: Date, required: true }, // 入住时间
  checkOutTime: { type: Date, default: null }, // 退住时间
  status: { type: String, required: true }, // 状态: Active/Inactive
});

const ElderlyResident = mongoose.model(
  'ElderlyResident',
  elderlyResidentSchema,
);

// 2-3老人请假模型
const elderlyLeaveSchema = new mongoose.Schema({
  leaveId: { type: String, required: true }, //LR001
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
//3-1 员工信息模型
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true }, // 员工唯一编号S001
  employeeName: { type: String, required: true }, // 员工姓名
  photo: { type: String, required: true }, // 员工照片
  position: { type: String, required: true }, // 员工职位:Management\Doctor\Catering\Finance\Other
  contactNumber: { type: String, required: true }, // 联系电话
  email: { type: String, required: true, unique: true }, // 电子邮件
  userId: { type: String, ref: 'User' }, // 医护登录 Id 唯一编号 U002
  status: { type: String, required: true }, //status:Active/Inactive
});
const Employee = mongoose.model('Employee', employeeSchema);
//3-2员工值班模型
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

//4-1 床位状态模型
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
//4-2床位分配模型
const bedAssignmentSchema = new mongoose.Schema({
  assignmentId: { type: String, required: true, unique: true }, // 分配编号 A001
  bedId: { type: String, ref: 'BedStatus', required: true }, // 床位引用 3-1-101s-01
  elderlyId: { type: String, ref: 'Elderly', required: true }, // 老人引用 E001
  assignedDate: { type: Date, default: Date.now }, // 分配日期
  releaseDate: { type: Date }, // 释放日期
});
const BedAssignment = mongoose.model('BedAssignment', bedAssignmentSchema);
const Schema = mongoose.Schema;

// 5-1健康档案模型
const HealthRecordSchema = new mongoose.Schema({
  healthRecordId: { type: String, required: true }, // 健康记录 ID，必须填写HR1
  elderlyId: { type: String, ref: 'Elderly', required: true }, // 老人引用，必须填写
  medicalHistory: [{ type: String, trim: true }], // 患者病史，可选字段，存储多个病史条目，示例：["高血压", "糖尿病", "心脏病"]
  allergies: [{ type: String, trim: true }], // 患者过敏史，可选字段，存储多个过敏条目，示例：["花生", "青霉素", "尘螨"]
  medications: [{ type: String, trim: true }], // 患者正在服用的药物，可选字段，存储多个药物条目，示例：["阿司匹林", "二甲双胍", "依那普利"]
  createdAt: { type: Date, default: Date.now }, // 记录创建时间，默认值为当前日期和时间
});
const HealthRecord = mongoose.model('HealthRecord', HealthRecordSchema);

// 5-2护理等级模型
const CareLevelSchema = new mongoose.Schema({
  careLevelId: { type: String, required: true }, // 护理等级记录 ID，必须填写CL1
  level: { type: String, required: true }, // 护理等级，必须填写
  description: { type: String }, // 护理等级的描述，可选字段
  createdAt: { type: Date, default: Date.now }, // 记录创建时间，默认值为当前日期和时间
});
const CareLevel = mongoose.model('CareLevel', CareLevelSchema);

// 5-3护理项目模型
const CareProjectSchema = new mongoose.Schema({
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

// 5-4护理计划模型
const CarePlanSchema = new mongoose.Schema({
  carePlanId: { type: String, required: true }, // 护理计划记录 ID，必须填写PL1
  planName: { type: String, required: true }, // 计划名称，必须填写
  description: { type: String }, // 计划描述，可选字段
  startDate: { type: Date, required: true }, // 开始日期，必须填写
  endDate: { type: Date }, // 结束日期，可选字段
  careProjectId: { type: String, ref: 'CareProject', required: true }, // 关联 CareProject
  createdAt: { type: Date, default: Date.now }, // 记录创建时间，默认值为当前日期和时间
});
const CarePlan = mongoose.model('CarePlan', CarePlanSchema);

// 5-5 护理任务模型
const CareTaskSchema = new mongoose.Schema({
  careTaskId: { type: String, required: true }, // 护理任务 ID，必须填写（例如 CT1）
  taskName: { type: String, required: true }, // 任务名称，必须填写
  description: { type: String }, // 任务描述，可选
  dueDate: { type: Date, required: true }, // 截止日期，必须填写
  carePlanId: { type: String, ref: 'CarePlan', required: true }, // 关联的护理计划 ID，必须填写
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'], // 任务状态，可以是"Pending"（待处理）,"In Progress"（进行中）或"Completed"（已完成）
    default: 'Pending', // 默认状态为"Pending"
  },
  elderlyId: { type: String, ref: 'Elderly', required: true }, //老人唯一编号 E001
  employeeId: { type: String, ref: 'Employee', required: true }, //  员工唯一编号S001
  createdAt: { type: Date, default: Date.now }, // 创建时间，默认为当前时间
});

const CareTask = mongoose.model('CareTask', CareTaskSchema);

// 5-6 健康体检模型
const HealthCheckupSchema = new mongoose.Schema({
  checkupId: { type: String, required: true }, // 健康体检 ID，必须填写（例如 HC1）
  checkupName: { type: String, required: true }, // 健康体检名称，必须填写
  description: { type: String }, // 健康体检描述，可选
  checkupDate: { type: Date, required: true }, // 健康体检日期，必须填写
  createdAt: { type: Date, default: Date.now }, // 创建时间，默认为当前时间
  elderlyId: { type: String, ref: 'Elderly', required: true }, //老人唯一编号 E001
  employeeId: { type: String, ref: 'Employee', required: true }, // 员工编号，字符串类型 员工唯一编号S001
  careLevelId: { type: String, required: true }, // 护理任务 ID，必须填写（例如 CL1）
});

// 创建并导出健康体检模型
const HealthCheckup = mongoose.model('HealthCheckup', HealthCheckupSchema);

const MealScheduleSchema = new mongoose.Schema({
  mealScheduleId: { type: String, required: true },
  mealType: { type: String, required: true },
  mealContent: { type: String, required: true },
  nutritionType: {
    type: String,
    enum: ['carbohydrate', 'protein', 'vegetable', 'beverage', 'fruit', 'fat'], // 确保包含 'fat'
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const MealSchedule = mongoose.model('MealSchedule', MealScheduleSchema);

//膳食计划模型
const MealPlanSchema = new mongoose.Schema({
  mealPlanId: { type: String, required: true }, // 膳食计划ID（例如 MP001）
  mealDate: { type: Date, required: true }, // 膳食日期，必须填写
  breakfast: { type: String, required: true }, // 早餐内容
  lunch: { type: String, required: true }, // 午餐内容
  dinner: { type: String, required: true }, // 晚餐内容
  createdAt: { type: Date, default: Date.now }, // 创建时间
});

// 创建并导出膳食计划模型
const MealPlan = mongoose.model('MealPlan', MealPlanSchema);

//膳食个性化定制
const PersonalizedDietSchema = new mongoose.Schema({
  userID: { type: String, required: true }, // 用户ID，必须填写
  userName: { type: String, required: true }, // 用户姓名，必须填写
  dietPreferences: { type: [String], required: true }, // 饮食偏好，必须填写
  allergies: { type: [String], required: true }, // 过敏原，必须填写
  mealPlan: {
    breakfast: { type: String, required: true }, // 早餐，必须填写
    lunch: { type: String, required: true }, // 午餐，必须填写
    dinner: { type: String, required: true } // 晚餐，必须填写
  }
});

const PersonalizedDiet = mongoose.model('PersonalizedDiet', PersonalizedDietSchema);

module.exports = PersonalizedDiet;


//来访预约登记模型
const VisitAppointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true }, // 预约ID，必须填写（例如 VA001）
  visitorName: { type: String, required: true }, // 来访者姓名，必须填写
  visitorPhone: { type: String, required: true }, // 来访者电话，必须填写
  visitDate: { type: Date, required: true }, // 预约来访日期，必须填写
  visitTime: { type: String, required: true }, // 预约来访时间，必须填写（例如 8:00 - 10:00）
  purpose: { type: String, required: true }, // 预约目的，必须填写
  elderlyId: { type: String, ref: 'Elderly', required: true }, // 关联的老人ID，必须填写
  createdAt: { type: Date, default: Date.now }, // 创建时间，默认为当前时间
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  }, // 预约状态，默认为待审核
});

// 创建并导出来访预约登记模型
const VisitAppointment = mongoose.model(
  'VisitAppointment',
  VisitAppointmentSchema,
);

//来访登记模型
const VisitRecordSchema = new mongoose.Schema({
  recordId: { type: String, required: true }, // 登记ID，必须填写（例如 VR001）
  visitorName: { type: String, required: true }, // 来访者姓名，必须填写
  visitorPhone: { type: String, required: true }, // 来访者电话，必须填写
  visitDateTime: { type: Date, required: true }, // 实际来访日期时间，必须填写
  purpose: { type: String, required: true }, // 来访目的，必须填写
  elderlyId: { type: String, ref: 'Elderly', required: true }, // 关联的老人ID，必须填写
  createdAt: { type: Date, default: Date.now }, // 创建时间，默认为当前时间
  status: {
    type: String,
    enum: ['checked-in', 'checked-out'],
    default: 'checked-in',
  }, // 来访状态，默认为已到访
});

// 创建并导出来访登记模型
const VisitRecord = mongoose.model('VisitRecord', VisitRecordSchema);

//财务管理交易模型
const PaymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true }, // 交易 ID，必须填写（例如 T001）
  userId: { type: String, ref: 'User', required: true }, // 用户ID，必须填写，关联用户模型
  amount: { type: Number, required: true }, // 金额，必须填写
  type: { type: String, enum: ['payment', 'refund'], required: true }, // 类型（缴费或退费），必须填写
  method: {
    type: String,
    enum: ['cash', 'credit card', 'bank transfer'],
    required: true,
  }, // 支付方式，必须填写
  description: { type: String }, // 描述，可选
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  }, // 状态，默认为待处理
  transactionDate: { type: Date, required: true }, // 交易日期，必须填写
  createdAt: { type: Date, default: Date.now }, // 创建时间，默认为当前时间
});
// 创建并导出缴费与退费模型
const Payment = mongoose.model('Payment', PaymentSchema);


//工资模型
// 工资查询模型
const SalaryQuerySchema = new mongoose.Schema({
  salaryId: { type: String, required: true }, // SQ000001
  employeeId: { type: String, required: true }, // 员工ID，必须填写
  basicSalary: { type: Number, required: true }, // 基本工资，必须填写
  bonus: { type: Number, default: 0 }, // 奖金，默认为0
  deductions: { type: Number, default: 0 }, // 扣款，默认为0
  salaryMonth: { type: String, required: true }, // 工资月份，必须填写（格式：YYYY-MM）
  createdAt: { type: Date, default: Date.now }, // 创建时间，默认为当前时间
});

// 计算总工资
SalaryQuerySchema.pre('save', function (next) {
  this.totalSalary = this.basicSalary + this.bonus - this.deductions;
  next();
});

const SalaryQuery = mongoose.model('SalaryQuery', SalaryQuerySchema);



// 通知模型
const NotificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true }, // 通知 ID，必须填写（例如 N001）
  title: { type: String, required: true }, // 通知标题，必须填写
  content: { type: String, required: true }, // 通知内容，必须填写
  roles: [
    { type: String, enum: ['medical', 'family', 'admin'], required: true },
  ], // 角色码，必须填写，可以是多个角色
  sendDateTime: { type: Date, required: true }, // 发送日期时间，必须填写
  createdAt: { type: Date, default: Date.now }, // 创建时间，默认为当前时间
  attachments: [{ type: String }], // 附件，可选，可以是多个文件路径或URL
  userId: { type: String, ref: 'User', required: true }, // 发布通知的用户ID，必须填写
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = {
  User,
  Permission,
  Elderly,
  ElderlyResident,
  ElderlyLeave,
  Employee,
  EmployeeShiftSchedule,
  BedStatus,
  BedAssignment,
  HealthRecord,
  CareLevel,
  CareProject,
  CarePlan,
  CareTask,
  HealthCheckup,
  MealSchedule,
  MealPlan,
  PersonalizedDiet,
  Payment,
  SalaryQuery,
  VisitAppointment,
  VisitRecord,
  Notification,
};
