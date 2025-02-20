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

// 1. 获取所有健康档案
const getAllHealthRecords = async (req, res) => {
  console.log('Received request to get all health records'); // 调试信息
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
    const healthRecords = await HealthRecord.aggregate([
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
          healthRecordId: 1,
          elderlyId: 1,
          elderlyName: '$elderlyDetails.elderlyName', // 获取 elderlies 集合中的 elderlyName
          medicalHistory: 1,
          allergies: 1,
          medications: 1,
          createdAt: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: 'health records retrieved successfully', // 成功信息改为英文
      data: healthRecords,
    });
    console.log(healthRecords); // 调试信息
  } catch (err) {
    console.error('Error retrieving health records:', err.message); // 错误信息改为英文
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. 创建新的健康档案
// (1) 显示老人申请请假表单(查找elderlyId)
const renderNewHealthRecordForm = async (req, res) => {
  try {
    // 顺序查找elderlyIds
    // 聚合管道查找没有记录健康的老人 elderlyId、elderlyName
    const unrecordedElderlyIds = await Elderly.aggregate([
      {
        $lookup: {
          from: 'healthrecords',
          localField: 'elderlyId',
          foreignField: 'elderlyId',
          as: 'healthRecordDetails',
        },
      },
      {
        $match: {
          'healthRecordDetails.elderlyId': { $exists: false },
        },
      },
      {
        $project: {
          elderlyId: 1,
          elderlyName: 1, // 您可以根据需要选择其他字段
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'ElderlyIds retrieved successfully',
      data: unrecordedElderlyIds,
    });
  } catch (err) {
    console.error('Error retrieving  elderlyIds:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};
// (2) 提交健康档案数据
const createHealthRecord = async (req, res) => {
  try {
    // 生成新的 healthRecordId
    const healthRecordId = await getNextId(
      'HealthRecord',
      'HR',
      'healthRecordId',
    );
    const { elderlyId, medicalHistory, allergies, medications, createdAt } =
      req.body;
    console.log(
      'Received request to create health record with data:',
      req.body,
    ); // 调试信息

    // 创建并保存健康档案
    const newHealthRecord = new HealthRecord({
      healthRecordId,
      elderlyId,
      medicalHistory,
      allergies,
      medications,
      createdAt,
    });
    await newHealthRecord.save();

    console.log('Health record created successfully:', newHealthRecord); // 调试信息
    return res.status(201).json({
      success: true,
      message: 'Health record created successfully',
      data: newHealthRecord,
    });
  } catch (error) {
    console.error('Error creating health record:', error.message); // 调试信息
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// 3. 管理员批复健康档案
// (1) 查找特定健康档案并进行批复
const getHealthRecordById = async (req, res) => {
  const { _id } = req.params;
  console.log(`Received request to get elderly leave by ID: ${_id}`); // 调试信息
  try {
    // 使用聚合管道进行后续查询
    const healthRecords = await HealthRecord.aggregate([
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
          medicalHistory: 1,
          allergies: 1,
          medications: 1,
          createdAt: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          }, // 格式化 createdAt
        },
      },
      // { $sort: { healthRecordId: 1 } }, // 按 healthRecordId 排序
    ]);
    console.log(healthRecords);
    return res.status(200).json({
      success: true,
      message: 'HealthRecord and elderlyIds retrieved successfully',
      data: healthRecords,
    });
  } catch (err) {
    console.error('Error retrieving elderly leave:', err.message); // 调试信息
    return res.status(500).json({ success: false, message: err.message });
  }
};
// (2) 提交更新后的健康档案数据
const updateHealthRecord = async (req, res) => {
  const { _id } = req.params;
  const { elderlyId, medicalHistory, allergies, medications, createdAt } =
    req.body;

  console.log('Received request to update elderly leavewith data:', req.body); // 调试信息

  try {
    // 查找现有的请假记录
    const existingHealthRecord = await HealthRecord.findOne({ _id });
    if (!existingHealthRecord) {
      console.warn(`Health record not found: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'Health record not found' });
    }

    // 更新请假记录
    Object.assign(existingHealthRecord, {
      elderlyId,
      medicalHistory,
      allergies,
      medications,
      createdAt,
    });

    await existingHealthRecord.save();

    console.log('Health record updated successfully:', existingHealthRecord); // 调试信息
    return res.status(200).json({
      success: true,
      message: 'Health record updated successfully',
      data: existingHealthRecord,
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
    await HealthRecord.findByIdAndDelete(_id); // 根据ID删除床位分配
    console.log('Health record deleted successfully:', _id); // 调试信息
    return res
      .status(200)
      .json({ success: true, message: 'Health record deleted successfully' });
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
  deleteHealthRecord,
};

   