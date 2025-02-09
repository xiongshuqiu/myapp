const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {
  ElderlyResident,
  Elderly,
  BedAssignment,
  ElderlyLeave,
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

// 查询函数
const getData = async () => {
  try {
    const elderlyLeaves = await ElderlyLeave.aggregate([
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
        $project: {
          // 投影所需的字段
          leaveId: 1,
          elderlyId: 1,
          elderlyName: '$elderlyDetails.elderlyName', // 获取 elderlies 集合中的 elderlyName
          reason: 1,
          startDate: 1,
          endDate: 1,
          status: 1,
          type: 1,
          additionalNotes: 1,
          applicationDate: 1,
        },
      },
    ]);

    console.log(elderlyLeaves); // 调试信息
  } catch (err) {
    console.error('Error retrieving elderly leaves:', err.message); // 错误信息改为英文
  }
};

// 调用查询函数
getData();
