const EmployeeShiftSchedule = require('../models/employeeShiftScheduleModel');
const Employee = require('../models/employeeModel');
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

// 2. 创建新的值班安排
//(1)获取新的排班初始值
const getShiftInitialValues = async (req, res) => {
  try {
    // 获取所有在岗员工
    const employees = await Employee.find({ status: 'Active' }).select(
      'employeeId employeeName',
    );
    console.log(employees);
    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (err) {
    console.error('Error retrieving initial values:', err.message);
    res
      .status(500)
      .json({ success: false, message: 'Error retrieving initial values' });
  }
};
// (2) 生成新的排班表

const generateMonthlyShiftSchedule = async (req, res) => {
  try {
    const { startDate, days, startShiftType, startEmployeeId } = req.body;

    // 数据库查询现有的排班表
    const existingShiftSchedules = await EmployeeShiftSchedule.find().sort({
      shiftScheduleId: -1,
    });

    let newShiftScheduleId;
    if (existingShiftSchedules.length > 0) {
      // 获取最后一个排班表的编号
      const lastId = existingShiftSchedules[0].shiftScheduleId;
      // 提取编号中的数字部分，并增加1
      const numericPart = parseInt(lastId.slice(2)) + 1;
      newShiftScheduleId = `SS${numericPart.toString().padStart(4, '0')}`;
    } else {
      newShiftScheduleId = 'SS0001';
    }

    // 获取在岗员工列表
    const activeEmployees = await Employee.find({ status: 'Active' });

    // 查找起始员工索引
    const startEmployeeIndex = activeEmployees.findIndex(
      (emp) => emp.employeeId === startEmployeeId,
    );
    if (startEmployeeIndex === -1) {
      return res.status(400).json({ message: 'Start employee not found' });
    }

    // 班次类型
    const shiftTypes = ['Morning', 'Evening', 'Night'];
    let currentShiftIndex = shiftTypes.indexOf(startShiftType);
    if (currentShiftIndex === -1) {
      return res.status(400).json({ message: 'Invalid start shift type' });
    }

    // 生成排班表
    for (let i = 0; i < days; i++) {
      const employeeIndex = (startEmployeeIndex + i) % activeEmployees.length;
      const employee = activeEmployees[employeeIndex];
      const shiftType = shiftTypes[currentShiftIndex];

      // 计算开始时间和结束时间
      const startTime = new Date(startDate);
      startTime.setDate(startTime.getDate() + i);
      startTime.setHours(8 * currentShiftIndex, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 8);

      const shiftSchedule = new EmployeeShiftSchedule({
        shiftScheduleId: newShiftScheduleId,
        employeeId: employee.employeeId,
        shiftType: shiftType,
        startTime: startTime,
        endTime: endTime,
      });

      await shiftSchedule.save();

      // 班次轮换
      currentShiftIndex = (currentShiftIndex + 1) % shiftTypes.length;
    }

    res.status(201).json({ message: 'Shift schedule created successfully' });
  } catch (error) {
    console.error('Error generating shift schedule:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



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
  getShiftInitialValues,
  generateMonthlyShiftSchedule,
  getEmployeeShiftScheduleById,
  updateEmployeeShiftSchedule,
  deleteEmployeeShiftSchedule,
};
