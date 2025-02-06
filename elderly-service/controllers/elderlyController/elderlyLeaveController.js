// const {
//   User,
//   Elderly,
//   BedAssignment,
// } = require('../models/bedAssignmentModel');
const User = require('../models/userModel');
const Elderly = require('../models/elderlyModel');
const BedAssignment = require('../models/bedAssignmentModel');
const BedStatus = require('../models/bedStatusModel');

// 1.获取所有床位分配
const getAllBedAssignments = async (req, res) => {
  console.log('Received request to get all bed statuses'); // 调试信息
  const { _id, role } = req.query;
  console.log('Query parameters:', _id, role); // 调试信息

  if (!_id || !role) {
    return res.status(400).json({
      success: false,
      message: 'Missing required query parameters _id or role',
    });
  }
  try {
    // 首先根据 _id 查找用户的 userId
    if (role === 'medical' || role === 'family') {
      const user = await User.findById({ _id });
      if (!user) throw new Error('User not found');

      const userId = user.userId; // 获取用户的 userId

      // 使用聚合管道进行后续查询
      const bedAssignments = await Elderly.aggregate([
        {
          $match: { userId: userId }, // 根据 userId 查找家庭成员
        },
        {
          $lookup: {
            from: 'bedassignments', // 从 bedassignments 集合中查找与家庭成员关联的床位分配
            localField: 'elderlyId', // 当前集合中的字段
            foreignField: 'elderlyId', // 关联集合中的字段
            as: 'bedassignmentDetails', // 结果保存字段
          },
        },
        {
          $unwind: '$bedassignmentDetails', // 展开数组字段
        },
        {
          $lookup: {
            from: 'bedstatuses', // 从 bedstatuses 集合中查找与床位分配关联的床位信息
            localField: 'bedassignmentDetails.bedId', // 当前集合中的字段
            foreignField: 'bedId', // 关联集合中的字段
            as: 'bedStatusDetails', // 结果保存字段
          },
        },
        {
          $unwind: '$bedStatusDetails', // 展开数组字段
        },
      ]);
      res.status(200).json({
        success: true,
        message: 'Bed assignments retrieved successfully',
        data: bedAssignments,
      });
      console.log(bedAssignments);
    } else if (role === 'admin') {
      const bedAssignments = await Elderly.aggregate([
        {
          $lookup: {
            from: 'bedassignments', // 从 bedassignments 集合中查找与家庭成员关联的床位分配
            localField: 'elderlyId', // 当前集合中的字段
            foreignField: 'elderlyId', // 关联集合中的字段
            as: 'bedassignmentDetails', // 结果保存字段
          },
        },
        {
          $unwind: '$bedassignmentDetails', // 展开数组字段
        },
        {
          $lookup: {
            from: 'bedstatuses', // 从 bedstatuses 集合中查找与床位分配关联的床位信息
            localField: 'bedassignmentDetails.bedId', // 当前集合中的字段
            foreignField: 'bedId', // 关联集合中的字段
            as: 'bedStatusDetails', // 结果保存字段
          },
        },
        {
          $unwind: '$bedStatusDetails', // 展开数组字段
        },
      ]);
      console.log(bedAssignments);
      res.status(200).json({
        success: true,
        message: 'Bed assignments retrieved successfully',
        data: bedAssignments,
      });
    }
  } catch (err) {
    console.error('Error retrieving bed assignments:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. 创建新的床位分配
// (1) 显示新增床位分配表单(查找available的bedId、未分配床位的elderlyId)
const renderNewBedAssignmentForm = async (req, res) => {
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
// (2) 提交新的床位分配数据
const createBedAssignment = async (req, res) => {
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
const getBedAssignmentById = async (req, res) => {
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
const updateBedAssignment = async (req, res) => {
  const { _id } = req.params; // 从 URL 参数中获取 assignmentId
  const { bedId, elderlyId, assignmentId, assignedDate,releaseDate } =
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
      await BedStatus.updateOne(
        { bedId: bedId },
        { status: 'occupied' },
      );
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
const deleteBedAssignment = async (req, res) => {
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
  getAllBedAssignments,
  renderNewBedAssignmentForm,
  createBedAssignment,
  getBedAssignmentById,
  updateBedAssignment,
  deleteBedAssignment,
};
