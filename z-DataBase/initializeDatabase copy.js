// initializeDatabase.js

const {
  User,
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
  Payment,
  VisitAppointment,
  VisitRecord,
  Notification,
} = require('./models/allModels');
const users = require('./data/usersData');
const elderlies = require('./data/elderliesData');
const bedstatuses = require('./data/bedStatusesData');
const bedassignments = require('./data/bedAssignmentsData');
const employees = require('./data/employeesData');
const generateWeeklyShifts = require('./data/employeeShiftSchedulesData'); // 导入数据生成函数
const elderlyresidents = require('./data/elderlyResidentData');
const elderlyleaves = require('./data/elderlyLeaveData');
const healthrecords = require('./data/healthRecordData');
const carelevels = require('./data/careLevelData');
const careprojects = require('./data/careProjectData');
const careplans = require('./data/carePlanData');
const caretasks = require('./data/careTaskData');
const healthcheckups = require('./data/healthCheckupData');
const mealSchedules = require('./data/mealScheduleData');
const {
  groupMealsByDate,
  generateMealPlans,
} = require('./data/mealPlanGenerator');

// 初始化数据库
const initializeDatabase = async () => {
  try {
    await User.deleteMany({});
    await Elderly.deleteMany({});
    await BedStatus.deleteMany({});
    await BedAssignment.deleteMany({});
    await Employee.deleteMany({});
    await EmployeeShiftSchedule.deleteMany({});
    await EmployeeShiftSchedule.deleteMany({});
    await ElderlyResident.deleteMany({});
    await ElderlyLeave.deleteMany({});
    await HealthRecord.deleteMany({});
    await CareLevel.deleteMany({});
    await CareProject.deleteMany({});
    await CarePlan.deleteMany({});
    await CareTask.deleteMany({});
    await HealthCheckup.deleteMany({});
    await MealSchedule.deleteMany({}); 
    await MealPlan.deleteMany({});

    await User.insertMany(users);
    await Elderly.insertMany(elderlies);
    await BedStatus.insertMany(bedstatuses);
    await BedAssignment.insertMany(bedassignments);
    await Employee.insertMany(employees);
    await ElderlyResident.insertMany(elderlyresidents);
    await ElderlyLeave.insertMany(elderlyleaves);
    await HealthRecord.insertMany(healthrecords);
    await CareLevel.insertMany(carelevels);
    await CareProject.insertMany(careprojects);
    await CarePlan.insertMany(careplans);
    await CareTask.insertMany(caretasks);
    await HealthCheckup.insertMany(healthcheckups);
    await MealSchedule.insertMany(mealschedules);
  

    const startDate = new Date();
    const numWeeks = 1; // 可根据需要调整周数
    const employeeShiftSchedules = await generateWeeklyShifts(
      startDate,
      numWeeks,
    ); // 生成班次数据

    console.log(
      `Generated Employee Shifts: ${JSON.stringify(employeeShiftSchedules)}`,
    );

    await EmployeeShiftSchedule.insertMany(employeeShiftSchedules);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = initializeDatabase;
