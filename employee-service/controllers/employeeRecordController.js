const  { Employee } = require('../models/employeeRecordModel');
// 1. 获取所有员工档案
const getAllEmployeeRecords = async (req, res) => {
  try {
    const employeeRecords = await Employee.find();
    console.log(employeeRecords);
    res
      .status(200)
      .json({
        success: true,
        message: 'Employee records retrieved successfully',
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
    // 顺序查找可用的 bedId
    const availableBedIds = await BedStatus.find({
      status: 'available',
    }).select('bedId');

    // 聚合管道查找未分配床位的 elderlyId
    const unassignedElderlyIds = await Elderly.aggregate([
      {
        $lookup: {
          from: 'bedassignments',
          localField: 'elderlyId',
          foreignField: 'elderlyId',
          as: 'bedAssignment',
        },
      },
      {
        $match: {
          'bedAssignment.elderlyId': { $exists: false },
        },
      },
      {
        $project: {
          elderlyId: 1,
          elderlyName: 1, // 您可以根据需要选择其他字段
        },
      },
    ]);

    console.log('Available Bed IDs:', availableBedIds);
    console.log('Unassigned Elderly IDs:', unassignedElderlyIds);

    return res.status(200).json({
      success: true,
      message: 'bedId and unassigned elderlyId retrieved successfully',
      data: { availableBedIds, unassignedElderlyIds },
    });
  } catch (err) {
    console.error(
      'Error retrieving bedId and unassigned elderlyId:',
      err.message,
    ); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};
// (2) 提交新的员工档案数据
const createEmployeeRecord = async (req, res) => {
  const {
    availableBedId,
    unassignedElderlyId,
    assignmentId,
    assignedDate,
    releaseDate,
  } = req.body;
  console.log('Received request to create bed status with data:', req.body); // 调试信息
  try {
    // 检查是否存在相同床位编号的记录
    const existingBedAssignment = await BedAssignment.findOne({ assignmentId });
    if (existingBedAssignment) {
      console.warn(`Bed assignmentId already exists: ${assignmentId}`); // 调试信息
      return res
        .status(400)
        .json({ success: false, message: 'Bed assignmentId already exists' });
    }

    // 创建并保存新床位分配
    const newBedAssignment = new BedAssignment({
      bedId: availableBedId,
      elderlyId: unassignedElderlyId,
      assignmentId,
      assignedDate,
      releaseDate,
    });
    await newBedAssignment.save();

    // 更新床位状态为 occupied
    await BedStatus.updateOne(
      { bedId: availableBedId }, // 查找条件
      { status: 'occupied' }, // 更新内容
    );

    console.log(
      'Bed assignment created and bed status updated successfully:',
      newBedAssignment,
    ); // 调试信息
    return res.status(201).json({
      success: true,
      message: 'Bed assignment created and bed status updated successfully',
      data: newBedAssignment,
    });
  } catch (error) {
    console.error('Error creating bed assignment:', error.message); // 调试信息
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
