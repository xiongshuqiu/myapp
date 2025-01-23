const BedStatus = require('../models/bedStatusModel');

// 获取所有床位状态
const getAllBedStatuses = async (req, res) => {
  try {
    const bedStatuses = await BedStatus.find();
    console.log(bedStatuses);
    res
      .status(200)
      .json({
        success: true,
        message: 'Bed statuses retrieved successfully',
        data: bedStatuses,
      });
  } catch (err) {
    console.error('Error retrieving bed statuses:', err.message);
    res
      .status(500)
      .json({ success: false, message: 'Error retrieving bed statuses' });
  }
};

// 创建新的床位状态
const createBedStatus = async (req, res) => {
  const { bedId, status } = req.body;

  // 验证输入字段
  if (!bedId || !status) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required fields' });
  }

  try {
    const existingBedStatus = await BedStatus.findOne({ bedId });
    if (existingBedStatus) {
      return res
        .status(400)
        .json({ success: false, message: 'BedId already exists' });
    }

    const bedStatus = new BedStatus({ bedId, status });
    const newBedStatus = await bedStatus.save();
    return res
      .status(201)
      .json({
        success: true,
        message: 'Bed status created successfully',
        data: newBedStatus,
      });
  } catch (error) {
    console.error('Error creating bed status:', error.message);
    return res
      .status(500)
      .json({
        success: false,
        message: 'An error occurred while creating bed status',
        error: error.message,
      });
  }
};

// 查找特定床位状态并显示编辑表单
const getBedStatusById = async (req, res) => {
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

// 提交更新后的床位状态数据
const updateBedStatus = async (req, res) => {
  const { bedId, status } = req.body;
  const { _id } = req.params;

  try {
    const bedStatus = await BedStatus.findById(_id);
    if (!bedStatus) {
      return res
        .status(404)
        .json({ success: false, message: 'Bed status not found' });
    }

    const updatedData = { bedId, status };
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

// 删除特定床位状态
const deleteBedStatus = async (req, res) => {
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
  getAllBedStatuses,
  createBedStatus,
  getBedStatusById,
  updateBedStatus,
  deleteBedStatus,
};
