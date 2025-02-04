const EmployeeShiftSchedule = require('../models/EmployeeShiftSchedule');
const Employee = require('../models/Employee');
//1.获取所有值班安排
const getAllEmployeeShiftSchedules = async (req, res) => {
  console.log('Received request to get all employee shift schedules'); // 调试信息
  
  try {
    const employeeShiftSchedules = await EmployeeShiftSchedule.aggregate([
      {
        $lookup: {
          from: 'employees', // 从 employees 集合中查找员工信息
          localField: 'employeeId', // 当前集合中的字段
          foreignField: 'employeeId', // 关联集合中的字段
          as: 'employeeDetails', // 结果保存字段
        },
      },
      {
        $unwind: '$employeeDetails', // 展开数组字段
      },
      {
        $match: {
          'employeeDetails.status': 'Active', // 筛选员工状态为 Active
        },
      },
    ]);
    console.log(employeeShiftSchedules);
    res.status(200).json({
      success: true,
      message: 'Employee shift schedules retrieved successfully',
      data: employeeShiftSchedules,
    });
  } catch (err) {
    console.error('Error retrieving employee shift schedules:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};

// 定义生成唯一排班表ID的函数
const generateUniqueShiftScheduleId = async () => {
  // 查询当前最大的 shiftScheduleId
  const lastSchedule = await EmployeeShiftSchedule.findOne()
    .sort({ shiftScheduleId: -1 })
    .exec();
  let shiftCounter = 1;

  if (lastSchedule && lastSchedule.shiftScheduleId) {
    // 提取数字部分并递增
    shiftCounter = parseInt(lastSchedule.shiftScheduleId.slice(2)) + 1;
  }

  // 生成新的 shiftScheduleId
  const shiftScheduleId = `SS${shiftCounter.toString().padStart(4, '0')}`;
  return shiftScheduleId;
};

// 获取最新的排班信息
const getLastShiftInfo = async () => {
  const lastSchedule = await EmployeeShiftSchedule.findOne()
    .sort({ endTime: -1 })
    .exec();
  const lastEmployeeId = lastSchedule ? lastSchedule.employeeId : null;
  const lastEndDate = lastSchedule
    ? new Date(lastSchedule.endTime)
    : new Date();
  return {
    lastEndDate,
    lastEmployeeId,
    lastScheduleId: lastSchedule ? lastSchedule.shiftScheduleId : 'SS0000',
  };
};

// 根据时间来确定班次类型
const getShiftType = (startTime) => {
  const hour = startTime.getHours();
  if (hour >= 0 && hour < 8) {
    return 'Night';
  } else if (hour >= 8 && hour < 16) {
    return 'Morning';
  } else {
    return 'Evening';
  }
};

// 生成一个月的排班表
const generateShiftSchedules = async (
  startDate,
  endDate,
  lastEmployeeId,
  shiftCounter = 1, // 这里给 shiftCounter 赋予初始值
) => {
  const employees = await Employee.find({ status: 'Active' });
  const newShiftSchedules = [];

  // 找到最后一个排班的员工的索引
  let lastEmployeeIndex = lastEmployeeId
    ? employees.findIndex((emp) => emp.employeeId === lastEmployeeId) + 1
    : 0;

  // 开始日期设置为最后结束时间
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const startTime = new Date(currentDate);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 8);

    const shiftType = getShiftType(startTime);
    const employee = employees[lastEmployeeIndex % employees.length];

    const shiftScheduleId = `SS${(shiftCounter++).toString().padStart(4, '0')}`;
    newShiftSchedules.push(
      new EmployeeShiftSchedule({
        shiftScheduleId,
        employeeId: employee.employeeId,
        shiftType,
        startTime,
        endTime,
      }),
    );

    // 更新 currentDate 到班次结束时间
    currentDate = new Date(endTime);
    lastEmployeeIndex++;
  }

  return newShiftSchedules;
};

// 将新排班表保存到数据库
const saveShiftSchedules = async (shiftSchedules, res) => {
  try {
    await EmployeeShiftSchedule.insertMany(shiftSchedules);
    res.json({ success: true, message: 'Shift schedules saved successfully' });
  } catch (err) {
    console.error('Error saving shift schedules:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error saving shift schedules',
      details: err.message,
    });
  }
};

// 生成按月的排班表
const generateMonthlyShiftSchedule = async (req, res) => {
  const { lastEndDate, lastEmployeeId, lastScheduleId } =
    await getLastShiftInfo(); // 获取最新的排班日期和员工编号
  const startDate = new Date(lastEndDate);
  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    0,
  ); // 设定结束日期为下个月的最后一天

  let shiftCounter = parseInt(lastScheduleId.slice(2)) + 1; // 获取最新的编号并递增

  try {
    const newShiftSchedules = await generateShiftSchedules(
      startDate,
      endDate,
      lastEmployeeId,
      shiftCounter,
    );
    await saveShiftSchedules(newShiftSchedules, res);
  } catch (err) {
    console.error('Error generating monthly shift schedules:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error generating monthly shift schedules',
      details: err.message,
    });
  }
};

// // 获取最近一周的起始日期
// const getWeekStart = (currentDate) => {
//   const weekStart = new Date(
//     currentDate.setDate(currentDate.getDate() - currentDate.getDay())
//   );
//   return new Date(weekStart.setHours(0, 0, 0, 0));
// };

// // 获取最近一周的结束日期
// const getWeekEnd = (weekStart) => {
//   const weekEnd = new Date(weekStart);
//   weekEnd.setDate(weekEnd.getDate() + 6);
//   return new Date(weekEnd.setHours(23, 59, 59, 999));
// };

// // 获取本周排班表
// const getCurrentWeekShiftSchedule = async (req, res) => {
//   const currentDate = new Date();
//   const weekStart = getWeekStart(currentDate);
//   const weekEnd = getWeekEnd(weekStart);

//   try {
//     const currentWeekSchedules = await EmployeeShiftSchedule.find({
//       startTime: { $gte: weekStart, $lt: weekEnd },
//       employeeId: {
//         $in: (await Employee.find({ status: "Active" })).map((emp) => emp.employeeId)
//       }
//     });

//     res.json({
//       success: true,
//       data: currentWeekSchedules,
//       message: "Current week shift schedules retrieved successfully"
//     });
//   } catch (err) {
//     console.error(
//       "Error retrieving current week shift schedules:",
//       err.message
//     );
//     res.status(500).json({
//       success: false,
//       message: "Error retrieving current week shift schedules",
//       details: err.message
//     });
//   }
// };

// // 确保索引创建
// EmployeeShiftSchedule.createIndexes([
//   { key: { shiftScheduleId: 1 }, unique: true }
// ]);

// 3. 更新特定值班安排
// (1) 查找特定值班安排
const getEmployeeShiftScheduleById = async (req, res) => {
  const { _id } = req.params;
  console.log(`Received request to get bed assignment by ID: ${_id}`); // 调试信息
  try {
    // 根据ID查找值班安排
    const bedAssignment = await BedAssignment.findById(_id);
    if (bedAssignment) {
      console.log('Bed assignment retrieved successfully:', bedAssignment); // 调试信息

      // 查找所有的 bedId
      const bedIds = await BedStatus.find().select('bedId status');
      // 查找所有老人信息
      const elderlyIds = await Elderly.find().select('elderlyId elderlyName');
      return res.status(200).json({
        success: true,
        message:
          'Bed assignment, available bedIds, and elderlyIds retrieved successfully',
        data: {
          bedAssignment,
          bedIds, //包括bedId、status
          elderlyIds, //包括elderlyId、elderlyName
        },
      });
    } else {
      console.warn(`Bed assignment not found with ID: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'Bed assignment not found' });
    }
  } catch (err) {
    console.error('Error retrieving bed assignment:', err.message); // 调试信息
    return res.status(500).json({ success: false, message: err.message });
  }
};
// (2) 提交更新后的值班安排数据
const updateEmployeeShiftSchedule = async (req, res) => {
  const { _id } = req.params; // 从 URL 参数中获取 assignmentId
  const { bedId, elderlyId, assignmentId, assignedDate, releaseDate } =
    req.body;

  console.log('Received request to update bed assignment with data:', req.body); // 调试信息

  try {
    // 查找现有值班安排记录
    const existingBedAssignment = await BedAssignment.findOne({ _id });
    if (!existingBedAssignment) {
      console.warn(`Bed assignmentId not found: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'Bed assignmentId not found' });
    }

    // 如果 bedId 发生变化，则更新旧床位和新床位的状态
    if (existingBedAssignment.bedId !== bedId) {
      // 更新旧床位状态为 available
      await BedStatus.updateOne(
        { bedId: existingBedAssignment.bedId },
        { status: 'available' },
      );

      // 更新新床位状态为 occupied
      await BedStatus.updateOne({ bedId: bedId }, { status: 'occupied' });
    }

    // 更新值班安排记录
    existingBedAssignment.bedId = bedId;
    existingBedAssignment.elderlyId = elderlyId;
    existingBedAssignment.assignmentId = assignmentId;
    existingBedAssignment.assignedDate = assignedDate;
    existingBedAssignment.releaseDate = releaseDate;
    await existingBedAssignment.save();

    console.log('Bed assignment updated successfully:', existingBedAssignment); // 调试信息
    return res.status(200).json({
      success: true,
      message: 'Bed assignment updated successfully',
      data: existingBedAssignment,
    });
  } catch (error) {
    console.error('Error updating bed assignment:', error.message); // 调试信息
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// 4. 删除特定值班安排
const deleteEmployeeShiftSchedule = async (req, res) => {
  const { _id } = req.params;

  try {
    await BedAssignment.findByIdAndDelete(_id); // 根据ID删除值班安排
    console.log('Bed status deleted successfully:', _id); // 调试信息
    return res
      .status(200)
      .json({ success: true, message: 'Bed status deleted successfully' });
  } catch (error) {
    console.error('Error deleting bed status:', error.message); // 调试信息
    return res.status(400).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// 6. 导出模块
module.exports = {
  getAllEmployeeShiftSchedules,
  generateMonthlyShiftSchedule,
  getEmployeeShiftScheduleById,
  updateEmployeeShiftSchedule,
  deleteEmployeeShiftSchedule,
};

// getCurrentWeekShiftSchedule,
