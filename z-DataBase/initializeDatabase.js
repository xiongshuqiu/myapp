// initializeDatabase.js

const  { User, Elderly, BedAssignment, BedStatus, Employee,EmployeeShiftSchedule } = require('./models/allModels');
const users = require('./data/usersData');
const elderlies = require('./data/elderliesData');
const bedStatuses = require('./data/bedStatusesData');
const bedAssignments = require('./data/bedAssignmentsData');
const employees = require('./data/employeesData');
const generateWeeklyShifts = require('./data/employeeShiftSchedulesData'); // 导入数据生成函数
// 初始化数据库
const initializeDatabase = async () => {
  try {
    await User.deleteMany({});
    await Elderly.deleteMany({});
    await BedStatus.deleteMany({});
    await BedAssignment.deleteMany({});
    await Employee.deleteMany({});
    await EmployeeShiftSchedule.deleteMany({});

    await User.insertMany(users);
    await Elderly.insertMany(elderlies);
    await BedStatus.insertMany(bedStatuses);
    await BedAssignment.insertMany(bedAssignments);
    await Employee.insertMany(employees);
    await EmployeeShiftSchedule.deleteMany({}); 

    const startDate = new Date();
    const numWeeks = 1; // 可根据需要调整周数
    const employeeShiftSchedules = await generateWeeklyShifts(startDate, numWeeks); // 生成班次数据

    console.log(`Generated Employee Shifts: ${JSON.stringify(employeeShiftSchedules)}`);

    await EmployeeShiftSchedule.insertMany(employeeShiftSchedules);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = initializeDatabase;