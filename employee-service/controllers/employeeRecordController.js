const User = require('../models/User');
const Employee = require('../models/Employee');
// 1. 获取所有员工档案
const getAllEmployeeRecords = async (req, res) => {
  try {
    const employeeRecords = await Employee.find();
    console.log(employeeRecords);
    res.status(200).json({
      success: true,
      message: 'Employee ecords retrieved successfully',
      data: employeeRecords,
    });
  } catch (err) {
    console.error('Error retrieving bed statuses:', err.message);
    res
      .status(500)
      .json({ success: false, message: 'Error retrieving bed statuses' });
  }
};

// 2. 创建新的员工档案
// (1) 显示新增员工档案表单
const renderNewEmployeeRecordForm = async (req, res) => {
  try {
    // 聚合管道查找未分配的 userId
    const unassignedUserIds = await User.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'userId',
          foreignField: 'userId',
          as: 'employeeRecord',
        },
      },
      {
        $match: {
          'employeeRecord.userId': { $exists: false },
          role: { $ne: 'family' }, // 过滤掉角色为 family 的用户
        },
      },
      {
        $project: {
          userId: 1,
          userName: 1, // 您可以根据需要选择其他字段
          role: 1,
        },
      },
    ]);
    console.log('Unassigned User IDs:', unassignedUserIds);
    return res.status(200).json({
      success: true,
      message: 'bedId and unassigned userId retrieved successfully',
      data: { unassignedUserIds },
    });
  } catch (err) {
    console.error('Error retrieving bedId and unassigned userId:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};

// (2) 提交新的员工档案数据
// (2) 提交新的员工档案数据
const createEmployeeRecord = async (req, res) => {
  const {
    employeeId,
    employeeName,
    position,
    contactNumber,
    email,
    unassignedUserId,
    status,
  } = req.body;
  console.log(
    'Received request to create employee record with data:',
    req.body,
  ); // 调试信息
  try {
    // 检查是否存在相同员工编号的记录
    const existingEmployeeRecord = await Employee.findOne({ employeeId });
    if (existingEmployeeRecord) {
      console.warn(`EmployeeId already exists: ${employeeId}`); // 调试信息
      return res
        .status(400)
        .json({ success: false, message: 'employeeId already exists' });
    }

    // 创建并保存员工档案
    const newEmployee = new Employee({
      employeeId,
      employeeName,
      position,
      contactNumber,
      email,
      userId: unassignedUserId, // 直接使用前端传输过来的 userId
      status,
    });
    await newEmployee.save();

    console.log('Employee record created successfully:', newEmployee); // 调试信息
    return res.status(201).json({
      success: true,
      message: 'Employee record created successfully',
      data: newEmployee,
    });
  } catch (error) {
    console.error('Error creating employee record:', error.message); // 调试信息
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// 3. 更新特定员工档案
// (1) 查找特定员工档案并显示编辑表单
const getEmployeeRecordById = async (req, res) => {
  const { _id } = req.params;

  try {
    const employeeRecord = await Employee.findById(_id);
    if (employeeRecord) {
      // 查找所有的 userId(过滤角色为family的userId)
      const userIds = await User.find({ role: { $ne: 'family' } }).select(
        'userId status',
      );
      return res.status(200).json({
        success: true,
        message: 'Employee record retrieved successfully',
        data: { employeeRecord, userIds },
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'Employee record not found' });
    }
  } catch (err) {
    console.error('Error retrieving employee record:', err.message);
    return res
      .status(500)
      .json({ success: false, message: 'Error retrieving employee record' });
  }
};

// (2) 提交更新后的员工档案数据
const updateEmployeeRecord = async (req, res) => {
  const { _id } = req.params;
  const {
    employeeId,
    employeeName,
    position,
    contactNumber,
    email,
    userId,
    status,
  } = req.body;

  console.log(
    'Received request to update employee record with data:',
    req.body,
  ); // 调试信息
  try {
    const existingEmployee = await Employee.findById(_id);
    if (!existingEmployee) {
      console.warn(`Employee record not found with ID: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'Employee record not found' });
    }

    // 如果 userId 改变，更新原来的 userId 状态为 'Available'
    //为存储数据前，如果Employee中的userId值不等于新的userId值，及发生了改变，把现有的User模型中userId状态变为Available
    if (existingEmployee.userId && existingEmployee.userId !== userId) {
      await User.findOneAndUpdate(
        { userId: existingEmployee.userId },
        { status: 'Available' },
      );
    }

    // 如果新的 userId 被使用，更新 userId 状态为 'Occupied'
    if (userId) {
      await User.findOneAndUpdate({ userId: userId }, { status: 'Occupied' });
    }

    // 更新员工档案
    existingEmployee.employeeId = employeeId;
    existingEmployee.employeeName = employeeName;
    existingEmployee.position = position;
    existingEmployee.contactNumber = contactNumber;
    existingEmployee.email = email;
    existingEmployee.userId = userId;
    existingEmployee.status = status;

    await existingEmployee.save();

    console.log('Employee record updated successfully:', existingEmployee); // 调试信息
    return res.status(200).json({
      success: true,
      message: 'Employee record updated successfully',
      data: existingEmployee,
    });
  } catch (error) {
    console.error('Error updating employee record:', error.message); // 调试信息
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// 4. 删除特定员工档案
const deleteEmployeeRecord = async (req, res) => {
  const { _id } = req.params;

  try {
    const employeeRecord = await Employee.findByIdAndDelete(_id);
    if (bedStatus) {
      return res
        .status(200)
        .json({
          success: true,
          message: 'Employee record  deleted successfully',
        });
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'Employee record not found' });
    }
  } catch (error) {
    console.error('Error deleting employee record:', error.message);
    return res
      .status(500)
      .json({ success: false, message: 'Error deleting employee record' });
  }
};

// 导出模块
module.exports = {
  getAllEmployeeRecords,
  renderNewEmployeeRecordForm,
  createEmployeeRecord,
  getEmployeeRecordById,
  updateEmployeeRecord,
  deleteEmployeeRecord,
};
