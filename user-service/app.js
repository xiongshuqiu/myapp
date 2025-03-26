// 1.导入模块
const express = require('express'); // 引入Express框架
const cors = require('cors');
const mongoose = require('mongoose'); // 引入Mongoose，用于连接MongoDB
const dotenv = require('dotenv'); // 引入dotenv模块，用于加载环境变量
const cookieParser = require('cookie-parser'); // 引入cookie-parser模块，用于解析Cookie
const verifySubToken = require('../middleware/verifySubToken');
const userRoutes = require('./routes/userRoutes');

// const authRoutes = require('./routes/authRoutes'); // 引入自定义的路由模块

// 2.加载环境变量
dotenv.config(); // 加载 .env 文件中的环境变量

// 3.创建Express应用实例
const app = express();
// 配置 CORS
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`, // 替换为前端的本地地址和端口
    credentials: true,
  }),
);

// 5.使用中间件解析 JSON 和 URL 编码的数据
app.use(cookieParser()); // 使用cookie-parser中间件
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体

app.use(cors());
// 5.设置路由

app.use('/users',userRoutes);

// 6.连接数据库
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => console.error('Database connection error:', err));

module.exports = app;

// //1.导入模块
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cookieParser = require('cookie-parser');
// const { authenticate} = require('../middleware/authMiddleware');
// const userRoutes = require('./routes/userRoutes');

// dotenv.config();

// const app = express();

// app.use(
//   cors({
//     origin: `${process.env.FRONTEND_URL}`,
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());

// // 应用身份验证中间件
// app.use(authenticate);

// // 应用其他中间件或路由
// app.use('/users', userRoutes);

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('Database connected successfully');
//   })
//   .catch((err) => console.error('Database connection error:', err));

// module.exports = app;
