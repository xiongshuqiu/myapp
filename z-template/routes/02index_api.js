// 1.引入必需的模块
const express = require('express'); // 引入Express框架，用于创建Web服务器
const dotenv = require('dotenv'); // 引入dotenv模块，用于加载环境变量
const cors = require('cors'); // 引入 CORS 中间件
const cookieParser = require('cookie-parser'); // 引入cookie-parser模块，用于解析Cookie
const authRoutes = require('./routes/authRoutes'); // 引入自定义的authRoutes模块，定义认证相关的路由
const userRoutes = require('./routes/userRoutes'); 
const accountRoutes = require('./routes/accountRoutes');

// 2.加载环境变量
dotenv.config(); // 加载根目录中的.env文件中的环境变量
// 3.创建Express应用实例
const app = express(); // 创建一个Express应用实例
// 配置 CORS
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, // 替换为前端的本地地址和端口
  credentials: true
}));


// 4.中间件配置
app.use(cookieParser());
app.use(express.json()); // 使用Express的JSON中间件，解析JSON格式的请求体
app.use(express.urlencoded({ extended: true })); // 使用URL编码解析中间件，解析URL编码的请求体
app.use(cors());
// 5.使用路由
app.use('/api/auth', authRoutes); // 当请求路径以/api/auth开头时，使用authRoutes路由
app.use('/api/users', userRoutes); // 当请求路径以/api/auth开头时，使用authRoutes路由
app.use('/api/accounts', accountRoutes);
// 6.调试环境变量
console.log('Loaded PORT:', process.env.PORT); // 输出环境变量值以调试

// 7.启动服务器
const PORT = process.env.PORT ; // 设置端口号，优先使用环境变量PORT的值，否则使用默认的3000
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`); // 使用正确的字符串插值语法
});

// 导出应用实例
module.exports = app;

   

