const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {
  ElderlyResident,
  Elderly,
  BedAssignment,
} = require('./models/allModels');

dotenv.config(); // 加载 .env 文件中的环境变量

// 连接到 MongoDB 数据库
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// const secondData = BedAssignment.find();
// console.log(secondData);

// 查询函数
const getElderlyResidentsData = async () => {
  try {
    const elderlyResidents = await ElderlyResident.aggregate([
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
          localField: 'elderlyDetails.elderlyId',
          foreignField: 'elderlyId',
          as: 'bedassignmentDetails',
        },
      },
      { $unwind: '$bedassignmentDetails' }, // 展开 bedAssignmentDetails 数组
      // {
      //   $project: {
      //     // 投影所需的字段
      //     residentId: 1,
      //     elderlyId: 1,
      //     elderlyName: '$elderlyDetails.elderlyName', // 获取 elderlies 集合中的 elderlyName
      //     bedId: '$bedassignmentDetails.bedId', // 获取 bedAssignments 集合中的 bedId
      //     checkInTime: 1,
      //     checkOutTime: 1,
      //     status: 1,
      //   },
      // },
    ]);

    console.log('Results:', elderlyResidents);
  } catch (err) {
    console.error('Error during aggregation query:', err.message);
  } finally {
    mongoose.connection.close(); // 关闭数据库连接
  }
};

// 调用查询函数
getElderlyResidentsData();
