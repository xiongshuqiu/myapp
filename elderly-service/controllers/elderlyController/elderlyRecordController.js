const BedAssignment = require('../../models/bedAssignmentModel');
const BedStatus = require('../../models/bedStatusModel');
const ElderlyLeave = require('../../models/elderlyLeaveModel');
const Elderly = require('../../models/elderlyModel');
const ElderlyResident = require('../../models/elderlyResidentModel');
const Employee = require('../../models/employeeModel');
const User = require('../../models/userModel');

// 1.获取所有老人档案
const getAllElderlyRecords = async (req, res) => {
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
    // 首先根据 _id 查找用户的 userId
    if (role === 'medical' || role === 'family') {
      const user = await User.findById({ _id });
      if (!user) throw new Error('User not found');

      const userId = user.userId; // 获取用户的 userId

      // 使用聚合管道进行后续查询
      //查找思路：（1）根据userId筛选Elderly中的老人
      //（2）根据userId在User中查找userName形成新的字段userDetails
      //（3）根据employeeId在Employeer中查找employeerName、contactNumber形成新的字段employeeDetails
      const elderlyRecords = await Elderly.aggregate([
        {
          $match: { userId: userId }, // 根据 userId 查找家庭成员
        },
        {
          $lookup: {
            from: 'users', // 从 bedassignments 集合中查找与家庭成员关联的老人档案
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
          $unwind: '$employeeDetails', // 展开数组字段
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
            employeeName: '$employeeDetails.name', // 保留 employeeDetails 中的 name 字段
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
    } else if (role === 'admin') {
      const elderlyRecords = await Elderly.aggregate([
        {
          $lookup: {
            from: 'users', // 从 bedassignments 集合中查找与家庭成员关联的老人档案
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
          $unwind: '$employeeDetails', // 展开数组字段
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
      console.log(elderlyRecords);
      res.status(200).json({
        success: true,
        message: 'Elderly records retrieved successfully',
        data: elderlyRecords,
      });
    }
  } catch (err) {
    console.error('Error retrieving elderly records:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. 创建新的老人档案
// (1) 显示新增老人档案表单(查找available的bedId、未分配床位的elderlyId)
const renderNewElderlyRecordForm = async (req, res) => {
  try {
    // 顺序查找 userId
    const userIds = await User.find({role:'family'}).select('userId role');

    // 顺序查找 employeeId
    const employeeIds = await Employee.find().select(
      'employeeId employeeName',
    );
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
const createElderlyRecord = async (req, res) => {
  const {
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
      elderlyId: elderlyId, // 老人唯一编号 E001
      elderlyName: elderlyName, // 老人姓名
      elderlyPhone: elderlyPhone, // 老人电话
      dateOfBirth: dateOfBirth, // 生日
      gender: gender, // 性别
      address: address, // 地址
      medicalHistory: medicalHistory, // 医疗史
      allergies: allergies, // 过敏史
      emergencyContactName: emergencyContactName, // 紧急联系人姓名
      emergencyContactPhone: emergencyContactPhone, // 紧急联系人电话
      userId: userId, // 家属登录 Id 唯一编号 F001
      employeeId: employeeId, // 关联负责的医生S002
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
const getElderlyRecordById = async (req, res) => {
  const { _id } = req.params;
  console.log(`Received request to get bed assignment by ID: ${_id}`); // 调试信息
  try {
    // 根据ID查找老人档案
    const bedAssignment = await BedAssignment.findById(_id);
    if (bedAssignment) {
      console.log('Bed assignment retrieved successfully:', bedAssignment); // 调试信息

      // 查找所有的 bedId
      const bedIds = await BedStatus.find().select('bedId status');
      // 查找所有老人档案
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
// (2) 提交更新后的老人档案数据
const updateElderlyRecord = async (req, res) => {
  const { _id } = req.params; // 从 URL 参数中获取 assignmentId
  const { bedId, elderlyId, assignmentId, assignedDate, releaseDate } =
    req.body;

  console.log('Received request to update bed assignment with data:', req.body); // 调试信息

  try {
    // 查找现有老人档案记录
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

    // 更新老人档案记录
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

// 4. 删除特定老人档案
const deleteElderlyRecord = async (req, res) => {
  const { _id } = req.params;

  try {
    await BedAssignment.findByIdAndDelete(_id); // 根据ID删除老人档案
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
