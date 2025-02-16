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

// 获取老人所有的健康体检
const getAllHealthCheckups = async (req, res) => {
  console.log('Received request to get all health checkups'); // 调试信息
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
      // } else if (role === 'medical') {
      //   query = await User.aggregate([
      //     {
      //       $match: { _id: new mongoose.Types.ObjectId(_id) }, // 使用 new 关键字实例化 ObjectId
      //     },
      //     {
      //       $lookup: {
      //         from: 'employees',
      //         localField: 'userId',
      //         foreignField: 'userId',
      //         as: 'employeeDetails',
      //       },
      //     },
      //     { $unwind: '$employeeDetails' },
      //     {
      //       $lookup: {
      //         from: 'elderlies',
      //         localField: 'employeeDetails.employeeId',
      //         foreignField: 'employeeId',
      //         as: 'elderlyDetails',
      //       },
      //     },
      //     { $unwind: '$elderlyDetails' },
      //     {
      //       $project: {
      //         elderlyId: '$elderlyDetails.elderlyId',
      //       },
      //     },
      //   ]);
      //   query = { elderlyId: { $in: query.map((item) => item.elderlyId) } };
    } else if (role === 'admin' || role === 'medical') {
      query = {}; // 管理员可以查看所有数据
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role', // 错误信息改为英文
      });
    }

    // 使用聚合管道进行后续查询
    const healthCheckups = await HealthCheckup.aggregate([
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
      {
        $unwind: {
          path: '$elderlyDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          // 从 'employees' 集合中查找与 'employeeId' 关联的数据
          from: 'employees',
          localField: 'employeeId',
          foreignField: 'employeeId',
          as: 'employeeDetails',
        },
      },
      {
        $unwind: {
          path: '$employeeDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          // 投影所需的字段
          checkupId: 1,
          checkupName: 1,
          description: 1,
          checkupDate: {
            $dateToString: { format: '%Y-%m-%d', date: '$checkupDate' },
          },
          createdAt: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          elderlyId: 1,
          elderlyName: '$elderlyDetails.elderlyName', // 获取 elderlyDetails中的 elderlyName
          employeeId: 1,
          employeeName: '$employeeDetails.employeeName', // 获取 employeeDetails 集合中的 employeeName
          careLevelId: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Health checkups retrieved successfully', // 成功信息改为英文
      data: healthCheckups,
    });
    console.log(healthCheckups); // 调试信息
  } catch (err) {
    console.error('Error retrieving health checkups:', err.message); // 错误信息改为英文
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. 创建新的健康体检
// (1) 显示新增健康体检表单(查找available的bedId、未分配床位的elderlyId)
const renderNewHealthCheckupForm = async (req, res) => {
  try {
    // 顺序查找 employeeId
    // 聚合管道查找未进行健康体检 elderlyId
    const unCheckupedElderlyIds = await Elderly.aggregate([
      {
        $lookup: {
          from: 'healthcheckups',
          localField: 'elderlyId',
          foreignField: 'elderlyId',
          as: 'healthcheckupDetails',
        },
      },
      {
        $match: {
          'healthcheckupDetails.elderlyId': { $exists: false },
        },
      },
      {
        $project: {
          elderlyId: 1,
          elderlyName: 1, // 您可以根据需要选择其他字段
        },
      },
    ]);
    console.log(unCheckupedElderlyIds);
    const employeeIds = await Employee.find().select('employeeId employeeName');
    console.log(employeeIds);
    const careLevelIds = await CareLevel.find().select(' careLevelId level ');
    console.log(careLevelIds);
    return res.status(200).json({
      success: true,
      message: 'UnCheckupedElderlyIds retrieved successfully',
      data: { unCheckupedElderlyIds, employeeIds, careLevelIds },
    });
  } catch (err) {
    console.error('Error retrieving UnCheckupedElderlyIds:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};
// (2) 提交新的健康体检数据
const createHealthCheckup = async (req, res) => {
  const checkupId = await getNextId('HealthCheckup', 'HC', 'checkupId');
  const {
    checkupName,
    description,
    checkupDate,
    createdAt,
    elderlyId,
    employeeId,
    careLevelId,
  } = req.body;
  console.log(
    'Received request to create elderly resident with data:',
    req.body,
  ); // 调试信息
  try {
    // 检查是否存在相同床位编号的记录
    const existingHealthCheckup = await HealthCheckup.findOne({
      checkupId,
    });
    if (existingHealthCheckup) {
      console.warn(`Resident id already exists: ${checkupId}`); // 调试信息
      return res
        .status(400)
        .json({ success: false, message: 'Resident id already exists' });
    }

    // 创建并保存新健康体检数据
    const newHealthCheckup = new HealthCheckup({
      checkupId,
      checkupName,
      description,
      checkupDate,
      createdAt,
      elderlyId,
      employeeId,
      careLevelId,
    });

    await newHealthCheckup.save();
    console.log(' Health checkup created successfully:', newHealthCheckup); // 调试信息
    return res.status(201).json({
      success: true,
      message: 'Health checkup created successfully',
      data: newHealthCheckup,
    });
  } catch (error) {
    console.error('Error creating elderly resident:', error.message); // 调试信息
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// 3. 更新特定健康体检数据
// (1) 查找特定健康体检数据
const getHealthCheckupById = async (req, res) => {
  const { _id } = req.params;
  console.log(`Received request to get elderly resident by ID: ${_id}`); // 调试信息
  try {
    // 根据ID查找健康体检数据
    const healthCheckups = await HealthCheckup.aggregate([
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
          checkupName: 1,
          description: 1,
          checkupDate: {
            $dateToString: { format: '%Y-%m-%d', date: '$checkupDate' },
          }, // 格式化 createdAt
          createdAt: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          }, // 格式化 createdAt
        },
      },
    ]);

    console.log(healthCheckups);

    // 查找所有员工的employeeIds
    const employeeIds = await Employee.find().select('employeeId employeeName');
    console.log(employeeIds);
    // 查找所有员工的employeeIds
    const careLevelIds = await CareLevel.find().select('careLevelId level');
    console.log(careLevelIds);

    return res.status(200).json({
      success: true,
      message: ' elderlyIds retrieved successfully',
      data: {
        healthCheckups,
        employeeIds,
        careLevelIds,
      },
    });
  } catch (err) {
    console.error('Error retrieving elderly resident:', err.message); // 调试信息
    return res.status(500).json({ success: false, message: err.message });
  }
};

// (2) 提交更新后的健康体检数据
const updateHealthCheckup = async (req, res) => {
  const { _id } = req.params; // 从 URL 参数中获取 assignmentId
  const {
    checkupName,
    description,
    checkupDate,
    createdAt,
    elderlyId,
    employeeId,
    careLevelId,
  } = req.body;

  console.log(
    'Received request to update elderly resident with data:',
    req.body,
  ); // 调试信息

  try {
    // 查找现有老人健康体检
    const existingHealthCheckup = await HealthCheckup.findOne({ _id });
    if (!existingHealthCheckup) {
      console.warn(`Elderly _id not found: ${_id}`); // 调试信息
      return res.status(404).json({
        success: false,
        message: 'existingHealthCheckup _id  not found',
      });
    }

    // 更新老人健康体检
    Object.assign(existingHealthCheckup, {
      checkupName,
      description,
      checkupDate,
      createdAt,
      elderlyId,
      employeeId,
      careLevelId,
    });

    await existingHealthCheckup.save();

    console.log('Health checkup updated successfully:', existingHealthCheckup); // 调试信息
    return res.status(200).json({
      success: true,
      message: 'Health checkup updated successfully',
      data: existingHealthCheckup,
    });
  } catch (error) {
    console.error('Error updating elderly resident:', error.message); // 调试信息
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// 4. 删除特定健康体检
const deleteHealthCheckup = async (req, res) => {
  const { _id } = req.params;

  try {
    await HealthCheckup.findByIdAndDelete(_id); // 根据ID删除健康体检
    console.log('Health checkup deleted successfully:', _id); // 调试信息
    return res
      .status(200)
      .json({ success: true, message: 'Health checkup deleted successfully' });
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
  getAllHealthCheckups,
  renderNewHealthCheckupForm,
  createHealthCheckup,
  getHealthCheckupById,
  updateHealthCheckup,
  deleteHealthCheckup,
};
