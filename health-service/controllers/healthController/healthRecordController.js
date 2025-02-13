const mongoose = require('mongoose');
const getNextId = require('./genericController.js');
const CareLevel = require('../../models/careLevelModel.js');
const CarePlan = require('../../models/carePlanModel.js');
const CareProject = require('../../models/careProjectModel.js');
const CareTask = require('../../models/careTaskModel.js');
const Elderly = require('../../models/elderlyModel.js');
const Employee = require('../../models/employeeModel.js');
const HealthCheckup = require('../../models/healthCheckupModel.js');
const HealthRecord = require('../../models/healthRecordModel.js');
const User = require('../../models/userModel.js');


// 1. 获取所有老人请假请求
const getAllHealthRecords = async (req, res) => {
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
          startDate: {
            $dateToString: { format: '%Y-%m-%d', date: '$startDate' },
          }, // 格式化 startDate
          endDate: { $dateToString: { format: '%Y-%m-%d', date: '$endDate' } },
          status: 1,
          type: 1,
          additionalNotes: 1,
          applicationDate: {
            $dateToString: { format: '%Y-%m-%d', date: '$applicationDate' },
          },
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

// 2. 创建新的老人请假请求
// (1) 显示老人申请请假表单(查找elderlyId)
const renderNewHealthRecordForm = async (req, res) => {
  try {
    // 顺序查找elderlyIds
    const elderlyIds = await Elderly.find({}).select('elderlyId elderlyName');

    console.log('Elderly IDs:', elderlyIds);

    return res.status(200).json({
      success: true,
      message: 'ElderlyIds retrieved successfully',
      data: { elderlyIds },
    });
  } catch (err) {
    console.error('Error retrieving  elderlyIds:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};
// (2) 提交老人请假请求数据
const createHealthRecord = async (req, res) => {
  // 生成新的 leaveId
  const leaveId = await getNextId('ElderlyLeave', 'LR', 'leaveId');
  const {
    elderlyId,
    reason,
    startDate,
    endDate,
    status,
    type,
    additionalNotes,
    applicationDate,
  } = req.body;
  console.log(
    'Received request to create  elderly leave request with data:',
    req.body,
  ); // 调试信息
  try {
    // 创建并保存请假申请
    const newElderlyLeave = new ElderlyLeave({
      leaveId,
      elderlyId,
      reason,
      startDate,
      endDate,
      status,
      type,
      additionalNotes,
      applicationDate,
    });
    await newElderlyLeave.save();

    console.log('Elderly leave created  successfully:', newElderlyLeave); // 调试信息
    return res.status(201).json({
      success: true,
      message: 'Elderly leave created successfully',
      data: newElderlyLeave,
    });
  } catch (error) {
    console.error('Error creating elderly leave:', error.message); // 调试信息
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// 3. 管理员批复老人请假请求
// (1) 查找特定老人请假请求并进行批复
const getHealthRecordById = async (req, res) => {
  const { _id } = req.params;
  console.log(`Received request to get elderly leave by ID: ${_id}`); // 调试信息
  try {
      // 使用聚合管道进行后续查询
      const elderlyLeaves = await ElderlyLeave.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(_id) }, // 使用 new 关键字实例化 ObjectId
        },
        {
          $lookup: {
            // 从 'elderlies' 集合中查找与 'elderlyId' 关联的数据
            from: 'elderlies',
            localField: 'elderlyId', // 当前集合中的字段
            foreignField: 'elderlyId',
            as: 'elderlyDetails',
          },
        },
        {
          $unwind: {
            path: '$elderlyDetails',
            preserveNullAndEmptyArrays: true,
          },
        }, // 展开 elderlyDetails 数组
        {
          $project: {
            // 投影所需的字段
            elderlyId: 1,
            elderlyName: '$elderlyDetails.elderlyName', // 获取 elderlies 集合中的 elderlyName
            reason: 1,
            startDate: {
              $dateToString: { format: '%Y-%m-%d', date: '$startDate' },
            }, // 格式化 startDate
            endDate: {
              $dateToString: { format: '%Y-%m-%d', date: '$endDate' },
            },
            status: 1,
            type: 1,
            additionalNotes: 1,
            applicationDate: {
              $dateToString: { format: '%Y-%m-%d', date: '$applicationDate' },
            },
          },
        },
      ]);
      console.log(elderlyLeaves);
      return res.status(200).json({
        success: true,
        message: 'ElderlyLeave and elderlyIds retrieved successfully',
        data: elderlyLeaves,
      });
     
  } catch (err) {
    console.error('Error retrieving elderly leave:', err.message); // 调试信息
    return res.status(500).json({ success: false, message: err.message });
  }
};
// (2) 提交更新后的老人请假请求数据
const updateHealthRecord = async (req, res) => {
  const { _id } = req.params;
  const {
    elderlyId,
    reason,
    startDate,
    endDate,
    status,
    type,
    additionalNotes,
    applicationDate,
  } = req.body;

  console.log('Received request to update elderly leavewith data:', req.body); // 调试信息

  try {
    // 查找现有的请假记录
    const existingElderlyLeave = await ElderlyLeave.findOne({ _id });
    if (!existingElderlyLeave) {
      console.warn(`Elderly leave not found: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'Elderly leave not found' });
    }

    // 更新请假记录
    Object.assign(existingElderlyLeave, {
      elderlyId,
      reason,
      startDate,
      endDate,
      status,
      type,
      additionalNotes,
      applicationDate,
    });

    await existingElderlyLeave.save();

    console.log('Elderly leave updated successfully:', existingElderlyLeave); // 调试信息
    return res.status(200).json({
      success: true,
      message: 'Elderly leave updated successfully',
      data: existingElderlyLeave,
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
const deleteHealthRecord = async (req, res) => {
  const { _id } = req.params;

  try {
    await ElderlyLeave.findByIdAndDelete(_id); // 根据ID删除床位分配
    console.log('Elderly leave deleted successfully:', _id); // 调试信息
    return res
      .status(200)
      .json({ success: true, message: 'Elderly leave deleted successfully' });
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
  getAllHealthRecords,
  renderNewHealthRecordForm,
  createHealthRecord,
  getHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord
};
