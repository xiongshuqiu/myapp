const mongoose = require('mongoose');
const BedAssignment = require('../../models/bedAssignmentModel');
const BedStatus = require('../../models/bedStatusModel');
const ElderlyLeave = require('../../models/elderlyLeaveModel');
const Elderly = require('../../models/elderlyModel');
const ElderlyResident = require('../../models/elderlyResidentModel');
const Employee = require('../../models/employeeModel');
const User = require('../../models/userModel');

// Function to get all elderly residents' check-in and check-out data
const getAllElderlyResidents = async (req, res) => {
  console.log('Received request to get all elderly residents'); // 调试信息
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
    const elderlyResidents = await ElderlyResident.aggregate([
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
        $lookup: {
          // 从 'bedAssignments' 集合中查找与 'elderlyId' 关联的数据
          from: 'bedassignments',
          localField: 'elderlyId',
          foreignField: 'elderlyId',
          as: 'bedassignmentDetails',
        },
      },
      {
        $unwind: {
          path: '$bedassignmentDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          // 投影所需的字段
          residentId: 1,
          elderlyId: 1,
          elderlyName: '$elderlyDetails.elderlyName', // 获取 elderlies 集合中的 elderlyName
          bedId: '$bedassignmentDetails.bedId', // 获取 bedAssignments 集合中的 bedId
          checkInTime: 1,
          checkOutTime: 1,
          status: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Elderly residents retrieved successfully', // 成功信息改为英文
      data: elderlyResidents,
    });
    console.log(elderlyResidents); // 调试信息
  } catch (err) {
    console.error('Error retrieving elderly residents:', err.message); // 错误信息改为英文
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. 创建新的老人入住退住
// (1) 显示新增老人入住退住表单(查找available的bedId、未分配床位的elderlyId)
const renderNewElderlyResidentForm = async (req, res) => {
  try {
    // 顺序查找 employeeId
    // 聚合管道查找未分配床位的 elderlyId
    const unResidentedElderlyIds = await Elderly.aggregate([
      {
        $lookup: {
          from: 'elderlyresidents',
          localField: 'elderlyId',
          foreignField: 'elderlyId',
          as: 'elderlyresidentDetails',
        },
      },
      {
        $match: {
          'elderlyresidentDetails.elderlyId': { $exists: false },
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
      message: 'UnResidentedElderlyIds retrieved successfully',
      data: { unResidentedElderlyIds },
    });
  } catch (err) {
    console.error('Error retrieving UnResidentedElderlyIds:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};
// (2) 提交新的老人入住退住数据
const createElderlyResident = async (req, res) => {
  const { residentId, elderlyId, checkInTime, checkOutTime, status } = req.body;
  console.log(
    'Received request to create elderly resident with data:',
    req.body,
  ); // 调试信息
  try {
    // 检查是否存在相同床位编号的记录
    const existingElderlyResident = await ElderlyResident.findOne({
      residentId,
    });
    if (existingElderlyResident) {
      console.warn(`Resident id already exists: ${residentId}`); // 调试信息
      return res
        .status(400)
        .json({ success: false, message: 'Resident id already exists' });
    }

    // 创建并保存新老人入住退住数据
    const newElderlyResident = new ElderlyResident({
      residentId: residentId,
      elderlyId: elderlyId,
      checkInTime: checkInTime,
      checkOutTime: checkOutTime,
      status: status,
    });

    await newElderlyResident.save();
    console.log(' Elderly resident created successfully:', newElderlyResident); // 调试信息
    return res.status(201).json({
      success: true,
      message: 'Elderly resident created successfully',
      data: newElderlyResident,
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

// 3. 更新特定老人入住退住数据
// (1) 查找特定老人入住退住数据
const getElderlyResidentById = async (req, res) => {
  const { _id } = req.params;
  console.log(`Received request to get elderly resident by ID: ${_id}`); // 调试信息
  try {
    // 根据ID查找老人入住退住数据
    const elderlyResident = await ElderlyResident.findById(_id);
    if (elderlyResident) {
      console.log('Elderly resident retrieved successfully:', elderlyResident); // 调试信息

      // 查找所有老人的elderlyId
      const elderlyIds = await Elderly.find().select('elderlyId elderlyName');
      console.log(elderlyIds);
      return res.status(200).json({
        success: true,
        message: ' elderlyIds retrieved successfully',
        data: {
          elderlyResident,
          elderlyIds, //包括elderlyId、elderlyName
        },
      });
    } else {
      console.warn(`Elderly resident not found with ID: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'Elderly resident not found' });
    }
  } catch (err) {
    console.error('Error retrieving elderly resident:', err.message); // 调试信息
    return res.status(500).json({ success: false, message: err.message });
  }
};
// (2) 提交更新后的老人入住退住数据
const updateElderlyResident = async (req, res) => {
  const { _id } = req.params; // 从 URL 参数中获取 assignmentId
  const { residentId, elderlyId, checkInTime, checkOutTime, status } = req.body;

  console.log(
    'Received request to update elderly resident with data:',
    req.body,
  ); // 调试信息

  try {
    // 查找现有老人入住退住记录
    const existingElderlyResident = await ElderlyResident.findOne({ _id });
    if (!existingElderlyResident) {
      console.warn(`Elderly _id not found: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'existingElderlyResident _id  not found' });
    }

    // 更新老人入住退住记录
    existingElderlyResident.residentId = residentId,
      existingElderlyResident.elderlyId = elderlyId,
      existingElderlyResident.checkInTime = checkInTime,
      existingElderlyResident.checkOutTime = checkOutTime,
      existingElderlyResident.status = status,
      await existingElderlyResident.save();

    console.log('Elderly resident updated successfully:', existingElderlyResident); // 调试信息
    return res.status(200).json({
      success: true,
      message: 'Elderly resident updated successfully',
      data: existingElderlyResident,
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

// 4. 删除特定老人入住退住
const deleteElderlyResident = async (req, res) => {
  const { _id } = req.params;

  try {
    await ElderlyResident.findByIdAndDelete(_id); // 根据ID删除老人入住退住
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
  getAllElderlyResidents,
  renderNewElderlyResidentForm,
  createElderlyResident,
  getElderlyResidentById,
  updateElderlyResident,
  deleteElderlyResident,
};
