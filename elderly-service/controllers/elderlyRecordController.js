const mongoose = require('mongoose');
const getNextId = require('./genericController.js');
const Elderly = require('../models/elderlyModel.js');
const Employee = require('../models/employeeModel.js');
const User = require('../models/userModel.js');

const getAllElderlyRecords = async (req, res) => {
  console.log('Received request to get all elderly records'); // 调试信息
  const { _id, role, page = 1, limit = 10 } = req.query;
  console.log('Query parameters:', _id, role, page, limit); // 调试信息

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

    // 使用聚合管道进行后续查询，并分页
    const elderlyRecords = await Elderly.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: 'userId',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $lookup: {
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
          elderlyId: 1,
          elderlyName: 1,
          elderlyPhone: 1,
          dateOfBirth: 1,
          age: {
            $subtract: [{ $year: new Date() }, { $year: '$dateOfBirth' }],
          },
          gender: 1,
          address: 1,
          photo: 1,
          emergencyContactName: 1,
          emergencyContactPhone: 1,
          userId: '$userDetails.userId',
          userName: '$userDetails.userName',
          employeeId: '$employeeDetails.employeeId',
          employeeName: '$employeeDetails.employeeName',
          employeeContactNumber: '$employeeDetails.contactNumber',
        },
      },
      {
        $skip: (page - 1) * limit, // 跳过前面的数据
      },
      {
        $limit: parseInt(limit), // 每页限制查询的数据数
      },
    ]);

    // 获取总数以便分页
    const totalRecords = await Elderly.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Elderly records retrieved successfully',
      data: elderlyRecords,
      totalRecords, // 总记录数
      currentPage: parseInt(page), // 当前页
      totalPages: Math.ceil(totalRecords / limit), // 总页数
    });
    console.log(elderlyRecords);
  } catch (err) {
    console.error('Error retrieving elderly records:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. 创建新的老人档案
// (1) 显示新增老人档案表单(查找available的bedId、未分配床位的elderlyId，未分配的userId)
const renderNewElderlyRecordForm = async (req, res) => {
  try {
    // 聚合管道查找未分配的 userId
    const userIds = await User.aggregate([
      {
        $lookup: {
          from: 'elderlies',
          localField: 'userId',
          foreignField: 'userId',
          as: 'elderlydetails',
        },
      },
      {
        $match: {
          'elderlydetails.userId': { $exists: false },
          role: 'family', // 查找角色为 family 的用户
        },
      },
      {
        $project: {
          userId: 1,
          userName: 1, // 您可以根据需要选择其他字段
          role: 1,
        },
      },
    ]);
    console.log('Unassigned User IDs:', userIds);
    // 顺序查找 employeeId
    const employeeIds = await Employee.find().select('employeeId employeeName');

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
const createElderlyRecord = async (req, res) => {
  const elderlyId = await getNextId('Elderly', 'E', 'elderlyId');
  const {
    elderlyName,
    elderlyPhone,
    photo,
    dateOfBirth,
    gender,
    address,
    emergencyContactName,
    emergencyContactPhone,
    userId,
    employeeId,
  } = req.body;
  console.log('Received request to create elderly record with data:', req.body); // 调试信息
  try {
    // 检查是否存在相同老人档案编号的记录
    const existingElderly = await Elderly.findOne({ elderlyId });
    if (existingElderly) {
      console.warn(`Elderly id already exists: ${elderlyId}`); // 调试信息
      return res
        .status(400)
        .json({ success: false, message: 'Elderly id already exists' });
    }
    const status = await User.findOne({ userId });
    // 创建并保存新老人档案

    const newElderly = new Elderly({
      elderlyId,
      elderlyName,
      elderlyPhone,
      photo,
      dateOfBirth,
      gender,
      address,
      emergencyContactName,
      emergencyContactPhone,
      userId,
      employeeId,
    });
    await newElderly.save();
    // 更新用户状态为 "Occupied"
    const updatedUser = await User.findOneAndUpdate(
      { userId: userId },
      { $set: { status: 'Occupied' } },
      { new: true }, // 返回更新后的文档
    );

    if (!updatedUser) {
      console.warn(`User with userId: ${userId} not found.`);
      return res
        .status(404)
        .json({ success: false, message: 'User not found to update status' });
    }

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
const getElderlyRecordById = async (req, res) => {
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
const updateElderlyRecord = async (req, res) => {
  const { _id } = req.params; // 从 URL 参数中获取 assignmentId
  const {
    elderlyName,
    elderlyPhone,
    photo,
    dateOfBirth,
    gender,
    address,
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
      elderlyName,
      elderlyPhone,
      photo,
      dateOfBirth,
      gender,
      address,
      emergencyContactName,
      emergencyContactPhone,
      userId,
      employeeId,
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
const deleteElderlyRecord = async (req, res) => {
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
  getAllElderlyRecords,
  renderNewElderlyRecordForm,
  createElderlyRecord,
  getElderlyRecordById,
  updateElderlyRecord,
  deleteElderlyRecord,
};
