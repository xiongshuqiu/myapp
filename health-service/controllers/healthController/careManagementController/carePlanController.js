const mongoose = require('mongoose');
const getNextId = require('../genericController.js');
const Elderly = require('../../../models/elderlyModel.js');
const Employee = require('../../../models/employeeModel.js');
const User = require('../../../models/userModel.js');

// 1.获取所有老人档案
const getAllCarePlans = async (req, res) => {
  console.log('Received request to get all elderly records'); // 调试信息
  const { _id, role } = req.query;
  console.log('Query parameters:', _id, role); // 调试信息

  if (!_id || !role) {
    return res.status(400).json({
      success: false,
      message: 'Missing required query parameters _id or role',
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
    const elderlyRecords = await Elderly.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: 'users', // 从 bedstatuses 集合中查找与老人档案关联的床位信息
          localField: 'userId', // 当前集合中的字段
          foreignField: 'userId', // 关联集合中的字段
          as: 'userDetails', // 结果保存字段
        },
      },
      {
        $unwind: '$userDetails', // 展开数组字段
      },
      {
        $lookup: {
          from: 'employees', // 从 bedstatuses 集合中查找与老人档案关联的床位信息
          localField: 'employeeId', // 当前集合中的字段
          foreignField: 'employeeId', // 关联集合中的字段
          as: 'employeeDetails', // 结果保存字段
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
          elderlyId: 1, // 保留 elderlyId 字段
          elderlyName: 1, // 保留 elderlyName 字段
          elderlyPhone: 1, // 保留 elderlyPhone 字段
          dateOfBirth: 1, // 保留 dateOfBirth 字段
          age: {
            $subtract: [
              { $year: new Date() }, // 当前年份
              { $year: '$dateOfBirth' }, // 出生年份
            ],
          },
          gender: 1, // 保留 gender 字段
          address: 1, // 保留 address 字段
          medicalHistory: 1, // 保留 medicalHistory 字段
          allergies: 1, // 保留 allergies 字段
          emergencyContactName: 1, // 保留 emergencyContactName 字段
          emergencyContactPhone: 1, // 保留 emergencyContactPhone 字段
          userId: '$userDetails.userId', // 保留 userDetails 中的 userId 字段
          userName: '$userDetails.userName', // 保留 userDetails 中的 userName 字段
          employeeId: '$employeeDetails.employeeId', // 保留 employeeDetails 中的 employeeId 字段
          employeeName: '$employeeDetails.employeeName', // 保留 employeeDetails 中的 name 字段
          employeeContactNumber: '$employeeDetails.contactNumber', // 保留 employeeDetails 中的 contactNumber 字段
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: 'Elderly records retrieved successfully',
      data: elderlyRecords,
    });
    console.log(elderlyRecords);
  } catch (err) {
    console.error('Error retrieving elderly records:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. 创建新的老人档案
// (1) 显示新增老人档案表单(查找available的bedId、未分配床位的elderlyId)
const renderNewCarePlanForm = async (req, res) => {
  try {
    // 顺序查找 userId
    const userIds = await User.find({ role: 'family' }).select('userId role');

    // 顺序查找 employeeId
    const employeeIds = await Employee.find().select('employeeId employeeName');
    console.log('User IDs:', userIds);
    console.log(' Employee IDs:', employeeIds);

    return res.status(200).json({
      success: true,
      message: 'UserIds and employeeIds retrieved successfully',
      data: { employeeIds, userIds },
    });
  } catch (err) {
    console.error('Error retrieving userIds and employeeIds:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};
// (2) 提交新的老人档案数据
const createCarePlan = async (req, res) => {
  const elderlyId = await getNextId('Elderly', 'E', 'elderlyId');
  const {
    elderlyName,
    elderlyPhone,
    dateOfBirth,
    gender,
    address,
    medicalHistory,
    allergies,
    emergencyContactName,
    emergencyContactPhone,
    userId,
    employeeId,
  } = req.body;
  console.log('Received request to create elderly record with data:', req.body); // 调试信息
  try {
    // 检查是否存在相同床位编号的记录
    const existingElderly = await Elderly.findOne({ elderlyId });
    if (existingElderly) {
      console.warn(`Elderly id already exists: ${elderlyId}`); // 调试信息
      return res
        .status(400)
        .json({ success: false, message: 'Elderly id already exists' });
    }

    // 创建并保存新老人档案

    const newElderly = new Elderly({
      elderlyId,
      elderlyName,
      elderlyPhone,
      dateOfBirth,
      gender,
      address,
      medicalHistory,
      allergies,
      emergencyContactName,
      emergencyContactPhone,
      userId,
      employeeId,
    });

    await newElderly.save();
    console.log(' Elderly record created successfully:', newElderly); // 调试信息
    return res.status(201).json({
      success: true,
      message: 'Elderly record created successfully',
      data: newElderly,
    });
  } catch (error) {
    console.error('Error creating elderly record:', error.message); // 调试信息
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// 3. 更新特定老人档案
// (1) 查找特定老人档案
const getCarePlanById = async (req, res) => {
  const { _id } = req.params;
  console.log(`Received request to get elderly record by ID: ${_id}`); // 调试信息
  try {
    // 根据ID查找老人档案
    const elderlyRecord = await Elderly.findById(_id);
    if (elderlyRecord) {
      console.log('Elderly record retrieved successfully:', elderlyRecord); // 调试信息

      // 查找所有的 userId
      const userIds = await User.find().select('userId role');
      // 查找所有老人档案
      const employeeIds = await Employee.find().select(
        'employeeId employeeName',
      );
      return res.status(200).json({
        success: true,
        message:
          'Elderly record, userIds and employeeIds retrieved successfully',
        data: {
          elderlyRecord,
          userIds, //包括bedId、status
          employeeIds, //包括elderlyId、elderlyName
        },
      });
    } else {
      console.warn(`Elderly record not found with ID: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'Elderly record not found' });
    }
  } catch (err) {
    console.error('Error retrieving elderly record:', err.message); // 调试信息
    return res.status(500).json({ success: false, message: err.message });
  }
};
// (2) 提交更新后的老人档案数据
const updateCarePlan = async (req, res) => {
  const { _id } = req.params; // 从 URL 参数中获取 assignmentId
  const {
    elderlyName,
    elderlyPhone,
    dateOfBirth,
    gender,
    address,
    medicalHistory,
    allergies,
    emergencyContactName,
    emergencyContactPhone,
    userId,
    employeeId,
  } = req.body;

  console.log('Received request to update elderly record with data:', req.body); // 调试信息

  try {
    // 查找现有老人档案记录
    const existingElderly = await Elderly.findOne({ _id });
    if (!existingElderly) {
      console.warn(`Elderly _id not found: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'Elderly _id  not found' });
    }

    // 更新老人档案记录
    //Object.assign() 方法将新的字段值合并到现有对象中，从而避免了逐一赋值的冗长代码。
    Object.assign(existingElderly, {
      elderlyName, // 老人姓名
      elderlyPhone, // 老人电话
      dateOfBirth, // 生日
      gender, // 性别
      address, // 地址
      medicalHistory, // 医疗史
      allergies, // 过敏史
      emergencyContactName, // 紧急联系人姓名
      emergencyContactPhone, // 紧急联系人电话
      userId, // 家属登录 Id 唯一编号 F001
      employeeId, // 关联负责的医生 S002
    });

    await existingElderly.save();

    console.log('Elderly record updated successfully:', existingElderly); // 调试信息
    return res.status(200).json({
      success: true,
      message: 'Elderly record updated successfully',
      data: existingElderly,
    });
  } catch (error) {
    console.error('Error updating elderly record:', error.message); // 调试信息
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// 4. 删除特定老人档案
const deleteCarePlan = async (req, res) => {
  const { _id } = req.params;

  try {
    await Elderly.findByIdAndDelete(_id); // 根据ID删除老人档案
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
  getAllCarePlans,
  renderNewCarePlanForm,
  createCarePlan,
  getCarePlanById,
  updateCarePlan,
  deleteCarePlan,
};
