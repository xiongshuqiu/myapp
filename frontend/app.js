// 1.导入自带和自定义模块
const express = require('express'); // 引入Express框架
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv'); // 引入dotenv模块，用于加载环境变量
const path = require('path'); // 引入path模块，用于处理和转换文件路径
const cookieParser = require('cookie-parser'); // 引入cookie-parser模块，用于解析Cookie

const { authenticate, setUsername } = require('../middleware/authMiddleware'); // 导入中间件
const authRoutes = require('./routes/authRoutes'); // 引入自定义的路由模块
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes'); 

// 2.加载环境变量
dotenv.config(); // 加载 .env 文件中的环境变量

// 3.创建 Express 应用实例，创建视图存放不睦
const app = express();

// 配置 CORS
app.use(cors({
  origin:`${process.env.FRONTEND_URL}`, // 替换为前端的本地地址和端口
  credentials: true
}));
//4.创建模板引擎views目录，和静态文件存放目录
app.set('view engine', 'ejs'); // 设置模板引擎为 EJS
app.set('views', path.join(__dirname, 'views')); // 设置模板文件的默认存放目录为 views 文件夹
app.use(express.static(path.join(__dirname, 'public')));



// 5.使用中间件解析 JSON 和 URL 编码的数据
app.use(cookieParser()); // 使用cookie-parser中间件
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体

// 6.使用会话管理和 Cookie 解析中间件
app.use(session({
  secret: 'your_secret_key', // 替换为您的秘密键
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // 在开发环境中可以设置为 false
}));

app.use(cors());
// 7.使用认证路由和dashboard页面路由
//app.use(verifyToken);
app.use('/auth', authRoutes);

app.use(authenticate);
app.use(setUsername);
app.use('/', dashboardRoutes);
app.use('/user', userRoutes);

// 8.启动服务器并监听指定端口
const PORT = process.env.PORT  // 设置服务器端口
app.listen(PORT, () => {
  console.log(`Frontend is running on port ${PORT}`); // 服务器启动后输出日志信息
});
module.exports = app;

