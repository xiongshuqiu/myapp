const mongoose = require('mongoose');
const Employee = require('../models/allModels').Employee; // 导入 Employee 模型
const EmployeeShiftSchedule = require('../models/allModels').EmployeeShiftSchedule; // 导入 EmployeeShiftSchedule 模型

let shiftCounter = 1; // 初始计数器

async function generateWeeklyShifts(startDate, numWeeks) {
  const shifts = [];
  const shiftTypes = ['Night', 'Morning', 'Evening'];

  // 获取状态为 Active 的员工的 employeeId
  const employees = await Employee.find({ status: 'Active' }).select('employeeId');
  const employeeIds = employees.map(emp => emp.employeeId);

  console.log(`Employee IDs: ${employeeIds}`);

  // 从2月3日（周一）开始
  startDate.setFullYear(2025, 1, 3); // 2025年2月3日，注意月份索引从0开始，所以2月为1

  for (let week = 0; week < numWeeks; week++) {
    for (let day = 0; day < 7; day++) {
      shiftTypes.forEach((shiftType, index) => {
        const start = new Date(startDate.getTime());
        start.setDate(start.getDate() + week * 7 + day);

        // 确保 Night 班次从 0:00:00 开始，Morning 班次从 8:00:00 开始，Evening 班次从 16:00:00 开始
        if (shiftType === 'Night') {
          start.setHours(3, 0, 0, 0);
        } else if (shiftType === 'Morning') {
          start.setHours(11, 0, 0, 0);
        } else if (shiftType === 'Evening') {
          start.setHours(19, 0, 0, 0);
        }

        const end = new Date(start);
        end.setHours(start.getHours() + 8); // 确保每个班次持续 8 小时

        const employeeIndex = (week * 21 + day * 3 + index) % employeeIds.length; // 循环分配员工ID

        const shift = {
          shiftScheduleId: `SS${shiftCounter.toString().padStart(4, '0')}`, // 从 SS0001 开始编号，依次递增
          employeeId: employeeIds[employeeIndex], // 使用从数据库中获取的员工ID
          shiftType: shiftType, // 确保正确地分配班次类型
          startTime: start, // 确保从0点起算
          endTime: end, // 确保分配结束时间
        };

        // 递增计数器
        shiftCounter++;

        // 打印调试信息
        console.log(`Generated Shift: ${JSON.stringify(shift)}`);

        shifts.push(shift);
      });
    }
  }
  return shifts;
}

module.exports = generateWeeklyShifts;
