const { User, Elderly, BedAssignment, BedStatus } = require('../models/bedAssignmentModel');

const getAllBedAssignments = async (req, res) => {
  console.log('Received request to get all bed statuses'); // 调试信息
  const { _id,role } = req.body;
  const userRole = role;
  try {
    // 首先根据 _id 查找用户的 userId
    if (userRole === medical || falmily) {
      const user = await User.findById(_id);
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
    }
  } catch (err) {
    console.error('Error retrieving bed assignments:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. 创建新的床位分配
const createBedAssignment = async (req, res) => {
  const { bedNumber, status } = req.body;
  console.log('Received request to create bed status with data:', req.body); // 调试信息

  try {
    // 检查是否存在相同床位编号的记录
    const existingBedStatus = await BedStatus.findOne({ bedNumber });
    if (existingBedStatus) {
      console.warn(`Bed number already exists: ${bedNumber}`); // 调试信息
      return res
        .status(400)
        .json({ success: false, message: 'Bed number already exists' });
    }

    // 创建并保存新床位分配
    const newBedStatus = new BedStatus({ bedNumber, status });
    await newBedStatus.save();
    console.log('Bed status created successfully:', newBedStatus); // 调试信息
    return res.status(201).json({
      success: true,
      message: 'Bed status created successfully',
      data: newBedStatus,
    });
  } catch (error) {
    console.error('Error creating bed status:', error.message); // 调试信息
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
  console.log(`Received request to get bed status by ID: ${_id}`); // 调试信息
  try {
    // 根据ID查找床位分配
    const bedStatus = await BedStatus.findById(_id);
    if (bedStatus) {
      console.log('Bed status retrieved successfully:', bedStatus); // 调试信息
      return res.status(200).json({
        success: true,
        message: 'Bed status retrieved successfully',
        data: bedStatus,
      });
    } else {
      console.warn(`Bed status not found with ID: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'Bed status not found' });
    }
  } catch (err) {
    console.error('Error retrieving bed status:', err.message); // 调试信息
    return res.status(500).json({ success: false, message: err.message });
  }
};

// (2) 提交更新后的床位分配数据
const updateBedAssignment = async (req, res) => {
  const { bedNumber, status } = req.body;
  const { _id } = req.params;

  try {
    // 查找特定床位分配
    const bedStatus = await BedStatus.findById(_id);
    if (!bedStatus) {
      console.warn(`Bed status not found with ID: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'Bed status not found' });
    }

    // 更新床位分配字段
    bedStatus.bedNumber = bedNumber;
    bedStatus.status = status;
    const updatedBedStatus = await bedStatus.save(); // 保存更新后的床位分配

    console.log('Bed status updated successfully:', updatedBedStatus); // 调试信息
    return res.status(200).json({
      success: true,
      message: 'Bed status updated successfully',
      data: updatedBedStatus,
    });
  } catch (err) {
    console.error('Error updating bed status:', err.message); // 调试信息
    return res.status(400).json({ success: false, message: err.message });
  }
};

// 4. 删除特定床位分配
const deleteBedAssignment = async (req, res) => {
  const { _id } = req.params;

  try {
    await BedStatus.findByIdAndDelete(_id); // 根据ID删除床位分配
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
  createBedAssignment,
  getBedAssignmentById,
  updateBedAssignment,
  deleteBedAssignment,
};
