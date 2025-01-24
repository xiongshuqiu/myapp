// initializeDatabase.js

const { User, Elderly, BedAssignment, BedStatus,Employee } = require('./models/allModels');
const users = require('./data/usersData');
const elderlies = require('./data/elderliesData');
const bedStatuses = require('./data/bedStatusesData');
const bedAssignments = require('./data/bedAssignmentsData');
const employees =require('./data/employeesData');
// 初始化数据库
const initializeDatabase = async () => {
  try {
    await User.deleteMany({});
    await Elderly.deleteMany({});
    await BedStatus.deleteMany({});
    await BedAssignment.deleteMany({});
    await Employee.deleteMany({});

    await User.insertMany(users);
    await Elderly.insertMany(elderlies);
    await BedStatus.insertMany(bedStatuses);
    await BedAssignment.insertMany(bedAssignments);
    await Employee.insertMany(employees);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = initializeDatabase;
