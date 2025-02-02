const  { User, Employee } = require('../models/employeeRecordModel');
// 1. 获取所有员工档案
const getAllEmployeeRecords = async (req, res) => {
  try {
    const employeeRecords = await Employee.find();
    console.log(employeeRecords);
    res
      .status(200)
      .json({
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
          role: { $ne: 'family' } // 过滤掉角色为 family 的用户
        },
      },
      {
        $project: {
          userId: 1,
          userName: 1, // 您可以根据需要选择其他字段
          role:1
        },
      },
    ]);
    console.log('Unassigned User IDs:', unassignedUserIds);
    return res.status(200).json({
      success: true,
      message: 'bedId and unassigned userId retrieved successfully',
      data: {  unassignedUserIds },
    });
  } catch (err) {
    console.error(
      'Error retrieving bedId and unassigned userId:',
      err.message,
    ); // 调试信息
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
    unassignedUserId
  } = req.body;
  console.log('Received request to create employee record with data:', req.body); // 调试信息
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
      userId: unassignedUserId // 直接使用前端传输过来的 userId
    });
    await newEmployee.save();

    console.log(
      'Employee record created successfully:',
      newEmployee,
    ); // 调试信息
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
    const bedStatus = await BedStatus.findById(_id);
    if (bedStatus) {
      return res
        .status(200)
        .json({
          success: true,
          message: 'Bed status retrieved successfully',
          data: bedStatus,
        });
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'Bed status not found' });
    }
  } catch (err) {
    console.error('Error retrieving bed status:', err.message);
    return res
      .status(500)
      .json({ success: false, message: 'Error retrieving bed status' });
  }
};

// (2) 提交更新后的员工档案数据
const updateEmployeeRecord = async (req, res) => {
  const { bedId, building, floor, room, roomType, bedNumber, status } = req.body;
  const { _id } = req.params;

  try {
    const bedStatus = await BedStatus.findById(_id);
    if (!bedStatus) {
      return res
        .status(404)
        .json({ success: false, message: 'Bed status not found' });
    }

    const updatedData = { bedId, building, floor, room, roomType, bedNumber, status };
    const updatedBedStatus = await BedStatus.findByIdAndUpdate(
      _id,
      updatedData,
      { new: true, runValidators: true },
    );

    return res
      .status(200)
      .json({
        success: true,
        message: 'Bed status updated successfully',
        data: updatedBedStatus,
      });
  } catch (err) {
    console.error('Error updating bed status:', err.message);
    return res
      .status(500)
      .json({ success: false, message: 'Error updating bed status' });
  }
};

// 4. 删除特定员工档案
const deleteEmployeeRecord = async (req, res) => {
  const { _id } = req.params;

  try {
    const bedStatus = await BedStatus.findByIdAndDelete(_id);
    if (bedStatus) {
      return res
        .status(200)
        .json({ success: true, message: 'Bed status deleted successfully' });
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'Bed status not found' });
    }
  } catch (error) {
    console.error('Error deleting bed status:', error.message);
    return res
      .status(500)
      .json({ success: false, message: 'Error deleting bed status' });
  }
};

// 导出模块
module.exports = {
  getAllEmployeeRecords,
  renderNewEmployeeRecordForm,
  createEmployeeRecord,
  getEmployeeRecordById,
  updateEmployeeRecord,
  deleteEmployeeRecord
};
