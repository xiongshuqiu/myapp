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
  Notification
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


// 初始化数据库
const initializeDatabase = async () => {
  try {
      // 定义需要清空数据的模型数组
      const modelsToClear = [
          User,
          Elderly,
          BedStatus,
          BedAssignment,
          Employee,
          EmployeeShiftSchedule,
          ElderlyResident,
          ElderlyLeave,
          HealthRecord,
          CareLevel,
          CareProject,
          CarePlan,
          CareTask,
          HealthCheckup,
          MealSchedule,
          MealPlan
      ];

      // 清空所有指定模型的数据
      for (const model of modelsToClear) {
          await model.deleteMany({});
          console.log(`Cleared data from ${model.modelName} collection.`);
      }

      // 定义需要插入数据的模型和对应数据数组的映射
      const dataToInsert = [
          { model: User, data: users },
          { model: Elderly, data: elderlies },
          { model: BedStatus, data: bedstatuses },
          { model: BedAssignment, data: bedassignments },
          { model: Employee, data: employees },
          { model: ElderlyResident, data: elderlyresidents },
          { model: ElderlyLeave, data: elderlyleaves },
          { model: HealthRecord, data: healthrecords },
          { model: CareLevel, data: carelevels },
          { model: CareProject, data: careprojects },
          { model: CarePlan, data: careplans },
          { model: CareTask, data: caretasks },
          { model: HealthCheckup, data: healthcheckups },
          { model: MealSchedule, data: mealSchedules }
      ];

      // 插入所有指定的数据
      for (const { model, data } of dataToInsert) {
          await model.insertMany(data);
          console.log(`Inserted data into ${model.modelName} collection.`);
      }

      // 生成员工班次数据
      const startDate = new Date();
      const numWeeks = 1; // 可根据需要调整周数
      const employeeShiftSchedules = await generateWeeklyShifts(
          startDate,
          numWeeks
      );
      console.log(
          `Generated Employee Shifts: ${JSON.stringify(employeeShiftSchedules)}`
      );
      await EmployeeShiftSchedule.insertMany(employeeShiftSchedules);
      console.log('Inserted employee shift schedules into collection.');

      console.log('Database initialized successfully');
  } catch (error) {
      console.error('Error initializing database:', error);
  }
};

module.exports = initializeDatabase;