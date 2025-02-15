const mongoose = require('mongoose');
const getNextId = require('../genericController.js');
const CareLevel = require('../../../models/careLevelModel.js');
const CarePlan = require('../../../models/carePlanModel.js');
const CareProject = require('../../../models/careProjectModel.js');
const CareTask = require('../../../models/careTaskModel.js');
const Elderly = require('../../../models/elderlyModel.js');
const Employee = require('../../../models/employeeModel.js');
const HealthCheckup = require('../../../models/healthCheckupModel.js');
const HealthRecord = require('../../../models/healthRecordModel.js');
const User = require('../../../models/userModel.js');

// 1.获取所有护理任务
const getAllCareTasks = async (req, res) => {
  console.log('Received request to get all care tasks'); // 调试信息
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
    } else if (role === 'admin' || role === 'medical') {
      query = {}; // 管理员可以查看所有数据
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role', // 错误信息改为英文
      });
    }
    // 使用聚合管道进行后续查询
    const careTasks = await CareTask.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: 'careplans', // 从 bedstatuses 集合中查找与护理任务关联的床位信息
          localField: 'carePlanId', // 当前集合中的字段
          foreignField: 'carePlanId', // 关联集合中的字段
          as: 'careplanDetails', // 结果保存字段
        },
      },
      {
        $unwind: {
          path: '$careplanDetails',
          preserveNullAndEmptyArrays: true,
        }, // 展开数组字段
      },
      {
        $lookup: {
          from: 'elderlies', // 从 bedstatuses 集合中查找与护理任务关联的床位信息
          localField: 'elderlyId', // 当前集合中的字段
          foreignField: 'elderlyId', // 关联集合中的字段
          as: 'elderlyDetails', // 结果保存字段
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
          from: 'employees', // 从 bedstatuses 集合中查找与护理任务关联的床位信息
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
          careTaskId: 1,
          taskName: 1,
          description: 1,
          dueDate: {
            $dateToString: { format: '%Y-%m-%d', date: '$dueDate' },
          },
          carePlanId: 1,
          planName: '$careplanDetails.planName',
          status: 1,
          elderlyId: 1,
          elderlyName: '$elderlyDetails.elderlyName',
          employeeId: 1,
          employeeName: '$employeeDetails.employeeName',
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: 'Elderly records retrieved successfully',
      data: careTasks,
    });
    console.log(careTasks);
  } catch (err) {
    console.error('Error retrieving care tasks:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. 创建新的护理任务
// (1) 显示新增护理任务表单(查找available的bedId、未分配床位的elderlyId)
const renderNewCareTaskForm = async (req, res) => {
  try {
    // 顺序查找 elderlyIds
    const elderlyIds = await Elderly.find().select('elderlyId elderlyName');
    // 顺序查找 carePlanIds
    const carePlanIds = await CarePlan.find().select('carePlanId planName');
    // 顺序查找 employeeId
    const employeeIds = await Employee.find().select('employeeId employeeName');
    console.log('Elderly IDs:', elderlyIds);
    console.log(' Care Plan IDs:', carePlanIds);
    console.log(' Employee IDs:', employeeIds);

    return res.status(200).json({
      success: true,
      message: 'ElderlyIds,carePlanIds and employeeIds retrieved successfully',
      data: { elderlyIds, employeeIds, carePlanIds },
    });
  } catch (err) {
    console.error(
      'Error retrieving elderlyIds,carePlanIds and employeeIds:',
      err.message,
    ); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};
// (2) 提交新的护理任务数据
const createCareTask = async (req, res) => {
  const careTaskId = await getNextId('CareTask', 'CT', 'careTaskId');
  const {
    description,
    taskName,
    dueDate,
    carePlanId,
    status,
    elderlyId,
    employeeId,
    createdAt,
  } = req.body;
  console.log('Received request to create care task with data:', req.body); // 调试信息
  try {
    // 检查是否存在相同床位编号的记录
    const existingCareTask = await CareTask.findOne({ careTaskId });
    if (existingCareTask) {
      console.warn(`CareTask id already exists: ${careTaskId}`); // 调试信息
      return res
        .status(400)
        .json({ success: false, message: 'CareTask id already exists' });
    }

    // 创建并保存新护理任务

    const newCareTask = new CareTask({
      careTaskId,
      description,
      taskName,
      dueDate,
      carePlanId,
      status,
      elderlyId,
      employeeId,
      createdAt,
    });
    await newCareTask.save();
    console.log('Care task created successfully:', newCareTask); // 调试信息
    return res.status(201).json({
      success: true,
      message: 'Care task created successfully',
      data: newCareTask,
    });
  } catch (error) {
    console.error('Error creating care task:', error.message); // 调试信息
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// 3. 更新特定护理任务
// (1) 查找特定护理任务
const getCareTaskById = async (req, res) => {
  const { _id } = req.params;
  console.log(`Received request to get care task by ID: ${_id}`); // 调试信息
  try {
    // 根据ID查找护理任务
    const careTasks = await CareTask.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(_id) },
      },
      {
        $lookup: {
          from: 'elderlies',
          localField: 'elderlyId',
          foreignField: 'elderlyId',
          as: 'elderlyDetails',
        },
      },

      {
        $project: {
          taskName: 1,
          description: 1,
          dueDate: {
            $dateToString: { format: '%Y-%m-%d', date: '$dueDate' },
          },
          carePlanId: 1,
          status: 1,
          elderlyId: 1,
          elderlyName: '$elderlyDetails.elderlyName',
          employeeId: 1,
          createdAt: 1,
        },
      },
    ]);

    // 查找所有的 carePlanId
    const carePlanIds = await CarePlan.find().select('carePlanId planName');
    // 查找所有employeeId
    const employeeIds = await Employee.find().select('employeeId employeeName');
    console.log(carePlanIds);
    console.log(careTasks);
    console.log(employeeIds);

    return res.status(200).json({
      success: true,
      message: 'Care tasks, carePlanIds and employeeIds retrieved successfully',
      data: {
        careTasks,
        employeeIds,
        carePlanIds,
      },
    });
  } catch (err) {
    console.error('Error retrieving care task:', err.message); // 调试信息
    return res.status(500).json({ success: false, message: err.message });
  }
};
// (2) 提交更新后的护理任务数据
const updateCareTask = async (req, res) => {
  const { _id } = req.params; // 从 URL 参数中获取 assignmentId
  const {
    description,
    taskName,
    dueDate,
    carePlanId,
    status,
    elderlyId,
    employeeId,
    createdAt,
  } = req.body;

  console.log('Received request to update care task with data:', req.body); // 调试信息

  try {
    // 查找现有护理任务记录
    const existingCareTask = await CareTask.findOne({ _id });
    if (!existingCareTask) {
      console.warn(`Elderly _id not found: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'CareTask _id  not found' });
    }

    // 更新护理任务记录
    //Object.assign() 方法将新的字段值合并到现有对象中，从而避免了逐一赋值的冗长代码。
    Object.assign(existingCareTask, {
      description,
      taskName,
      dueDate,
      carePlanId,
      status,
      elderlyId,
      employeeId,
      createdAt,
    });

    await existingCareTask.save();

    console.log('Care task updated successfully:', existingCareTask); // 调试信息
    return res.status(200).json({
      success: true,
      message: 'Care task updated successfully',
      data: existingCareTask,
    });
  } catch (error) {
    console.error('Error updating care task:', error.message); // 调试信息
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// 4. 删除特定护理任务
const deleteCareTask = async (req, res) => {
  const { _id } = req.params;

  try {
    await CareTask.findByIdAndDelete(_id); // 根据ID删除护理任务
    console.log('Care task deleted successfully:', _id); // 调试信息
    return res
      .status(200)
      .json({ success: true, message: 'Care task deleted successfully' });
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
  getAllCareTasks,
  renderNewCareTaskForm,
  createCareTask,
  getCareTaskById,
  updateCareTask,
  deleteCareTask,
};
