// app.js

const express = require('express'); // 引入Express框架
const mongoose = require('mongoose'); // 引入Mongoose，用于连接MongoDB
const dotenv = require('dotenv'); // 引入dotenv模块，用于加载环境变量

dotenv.config(); // 加载 .env 文件中的环境变量

const initializeDatabase = require('./initializeDatabase');

// 连接数据库并初始化
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected successfully');
    // 连接成功后初始化数据库
    initializeDatabase();
  })
  .catch((err) => console.error('Database connection error:', err));

const app = express();

module.exports = app;
