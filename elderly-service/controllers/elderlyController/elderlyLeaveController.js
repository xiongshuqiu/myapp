const BedAssignment = require('../../models/bedAssignmentModel');
const BedStatus = require('../../models/bedStatusModel');
const ElderlyLeave = require('../../models/elderlyLeaveModel');
const Elderly = require('../../models/elderlyModel');
const ElderlyResident = require('../../models/elderlyResidentModel');
const Employee = require('../../models/employeeModel');
const User = require('../../models/userModel');
// 1. 获取所有老人请假请求
const getAllElderlyLeaveRequests = async (req, res) => {
  console.log('Received request to get all elderly leaves'); // 调试信息
  const { _id, role } = req.query;
  console.log('Query parameters:', _id, role); // 调试信息

  if (!_id || !role) {
    return res.status(400).json({
      success: false,
      message: 'Missing required query parameters _id or role', // 错误信息改为英文
    });
  }
  try {
    // 查找用户，确认用户存在
    const user = await User.findById(_id);
    console.log('Found user:', user); // 调试信息

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found', // 错误信息改为英文
      });
    }

    let query = {};
    // 如果角色是 'medical' 或 'family'，根据 _id 查找 userId
    if (role === 'family') {
      query = await User.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(_id) }, // 使用 new 关键字实例化 ObjectId
        },
        {
          $lookup: {
            from: 'elderlies',
            localField: 'userId',
            foreignField: 'userId',
            as: 'elderlyDetails',
          },
        },
        { $unwind: '$elderlyDetails' },
        {
          $project: {
            elderlyId: '$elderlyDetails.elderlyId',
          },
        },
      ]);
      query = { elderlyId: { $in: query.map((item) => item.elderlyId) } };
    } else if (role === 'medical') {
      query = await User.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(_id) }, // 使用 new 关键字实例化 ObjectId
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'userId',
            foreignField: 'userId',
            as: 'employeeDetails',
          },
        },
        { $unwind: '$employeeDetails' },
        {
          $lookup: {
            from: 'elderlies',
            localField: 'employeeDetails.employeeId',
            foreignField: 'employeeId',
            as: 'elderlyDetails',
          },
        },
        { $unwind: '$elderlyDetails' },
        {
          $project: {
            elderlyId: '$elderlyDetails.elderlyId',
          },
        },
      ]);
      query = { elderlyId: { $in: query.map((item) => item.elderlyId) } };
    } else if (role === 'admin') {
      query = {}; // 管理员可以查看所有数据
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role', // 错误信息改为英文
      });
    }

    // 使用聚合管道进行后续查询
    const elderlyLeaves = await ElderlyLeave.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          // 从 'elderlies' 集合中查找与 'elderlyId' 关联的数据
          from: 'elderlies',
          localField: 'elderlyId',
          foreignField: 'elderlyId',
          as: 'elderlyDetails',
        },
      },
      { $unwind: '$elderlyDetails' }, // 展开 elderlyDetails 数组
      {
        $project: {
          // 投影所需的字段
          leaveId: 1,
          elderlyId: 1,
          elderlyName: '$elderlyDetails.elderlyName', // 获取 elderlies 集合中的 elderlyName
          reason: 1,
          startDate: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } }, // 格式化 startDate
          endDate: { $dateToString: { format: "%Y-%m-%d", date: "$endDate" } },
          status: 1,
          type: 1,
          additionalNotes: 1,
          applicationDate: { $dateToString: { format: "%Y-%m-%d", date: "$applicationDate" } },
          
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: 'elderly leaves retrieved successfully', // 成功信息改为英文
      data: elderlyLeaves,
    });
    console.log(elderlyLeaves); // 调试信息
  } catch (err) {
    console.error('Error retrieving elderly leaves:', err.message); // 错误信息改为英文
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. 创建新的床位分配
// (1) 显示新增床位分配表单(查找available的bedId、未分配床位的elderlyId)
const renderNewElderlyLeaveRequestForm = async (req, res) => {
  try {
    // 顺序查找可用的 bedId
    const availableBedIds = await BedStatus.find({
      status: 'available',
    }).select('bedId');

    // 聚合管道查找未分配床位的 elderlyId
    const unassignedElderlyIds = await Elderly.aggregate([
      {
        $lookup: {
          from: 'elderlyLeaves',
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
// (2) 提交新的床位分配数据
const createElderlyLeaveRequest = async (req, res) => {
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

// 3. 更新特定床位分配
// (1) 查找特定床位分配
const getElderlyLeaveRequestById = async (req, res) => {
  const { _id } = req.params;
  console.log(`Received request to get bed assignment by ID: ${_id}`); // 调试信息
  try {
    // 根据ID查找床位分配
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
// (2) 提交更新后的床位分配数据
const updateElderlyLeaveRequest = async (req, res) => {
  const { _id } = req.params; // 从 URL 参数中获取 assignmentId
  const { bedId, elderlyId, assignmentId, assignedDate, releaseDate } =
    req.body;

  console.log('Received request to update bed assignment with data:', req.body); // 调试信息

  try {
    // 查找现有床位分配记录
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

    // 更新床位分配记录
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

// 4. 删除特定床位分配
const deleteElderlyLeaveRequest = async (req, res) => {
  const { _id } = req.params;

  try {
    await BedAssignment.findByIdAndDelete(_id); // 根据ID删除床位分配
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
  getAllElderlyLeaveRequests,
  renderNewElderlyLeaveRequestForm,
  createElderlyLeaveRequest,
  getElderlyLeaveRequestById,
  updateElderlyLeaveRequest,
  deleteElderlyLeaveRequest,
};
