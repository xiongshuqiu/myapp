const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// 1. 身份验证的中间件函数
const authenticate = async (req, res, next) => {
  console.log('Cookies:', req.cookies);
  console.log('1111:', req.cookies.jwt);

  // 从请求的Cookies中获取Tokenconnect.sid
  const token = req.cookies.jwt;
  console.log('Token from request:', token);

  // 如果提供了Token，则进行解码和验证
  if (token) {
    try {
      // 使用jsonwebtoken库对Token进行解码和验证
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
      console.log('22222Decoded Token:', decodedToken);

      // 将解码后的用户信息存储在请求对象中
      req.user = decodedToken;
      // 存储在 res.locals 中的 _id 现在可以直接在同一请求响应周期内渲染的任何 EJS 模板中访问。
      res.locals._id = req.user._id;

      // 调用下一个中间件或路由处理函数
      return next();
    } catch (error) {
      // 如果解码或验证Token时发生错误，返回403状态码和错误信息
      console.error('Error verifying JWT:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Token expired' });
      } else {
        return res.status(403).json({ message: 'Invalid token' });
      }
    }
  } else { 

    console.log('3333Decoded Token:');
    return res.status(401).json({ message: 'Token not provided' });
  }

  // 如果没有提供Token，返回401状态码和错误信息
  
};


// 2. 角色权限中间件函数
const authorizeRole = (roles) => {
  return (req, res, next) => {
    // 检查用户角色是否包含在允许的角色列表中
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Access denied. Insufficient privileges.' });
    }
    // 角色验证通过，继续处理请求
    next();
  };
};

// 3. 设置用户名的中间件函数
const setUsername = (req, res, next) => {
  if (req.user && req.user.userName) {
    // 设置用户名变量在response本地对象,userName可以直接应用到页面上.
    // 存储在 res.locals 中的 userName 现在可以直接在同一请求响应周期内渲染的任何 EJS 模板中访问。
    res.locals.userName = req.user.userName;
    next();
  } else {
    return res.status(400).json({ message: 'Username not found in token' });
  }
};

// 4. 集成权限检查的中间件函数
const checkPermission = (service, subService, action) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findOne(req.user.role); // 假设你已经通过其它中间件获取了用户角色
      const permission = await Permission.findOne({
        roleId: role.roleId,
        service: service,
        subService: subService,
      });

      if (permission && permission[action]) {
        next();
      } else {
        res.status(403).json({ message: 'No permission' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = { authenticate, authorizeRole, setUsername, checkPermission };
