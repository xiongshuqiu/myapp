const BedStatus = require('../models/bedStatusModel');

// 1. 获取所有床位状态
const getAllBedStatuses = async (req, res) => {
  console.log('Received request to get all bed statuses'); // 调试信息
  try {
    // 从数据库中获取所有床位状态
    const bedStatuses = await BedStatus.find();
    res.status(200).json({
      success: true,
      message: 'Bed statuses retrieved successfully',
      data: bedStatuses,
    });
  } catch (err) {
    console.error('Error retrieving bed statuses:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. 创建新的床位状态
const createBedStatus = async (req, res) => {
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

    // 创建并保存新床位状态
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

// 3. 获取特定床位状态
const getBedStatusById = async (req, res) => {
  const { _id } = req.params;
  console.log(`Received request to get bed status by ID: ${_id}`); // 调试信息
  try {
    // 根据ID查找床位状态
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

// 4. 更新特定床位状态
const updateBedStatus = async (req, res) => {
  const { bedNumber, status } = req.body;
  const { _id } = req.params;

  try {
    // 查找特定床位状态
    const bedStatus = await BedStatus.findById(_id);
    if (!bedStatus) {
      console.warn(`Bed status not found with ID: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'Bed status not found' });
    }

    // 更新床位状态字段
    bedStatus.bedNumber = bedNumber;
    bedStatus.status = status;
    const updatedBedStatus = await bedStatus.save(); // 保存更新后的床位状态

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

// 5. 删除特定床位状态
const deleteBedStatus = async (req, res) => {
  const { _id } = req.params;

  try {
    await BedStatus.findByIdAndDelete(_id); // 根据ID删除床位状态
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
  getAllBedStatuses,
  createBedStatus,
  getBedStatusById,
  updateBedStatus,
  deleteBedStatus,
};
