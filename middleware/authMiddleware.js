const jwt = require('jsonwebtoken');

// 1.身份验证的中间件函数
const authenticate = async (req, res, next) => {
  // 从请求的Cookies中获取Token
  const token = req.cookies.jwt;
  console.log('Token from request:', token);

  // 如果提供了Token，则进行解码和验证
  if (token) {
    try {
      // 使用jsonwebtoken库对Token进行解码和验证
      const decodedToken = jwt.verify(token, 'your_secret_key');
      console.log(decodedToken);

      // 将解码后的用户信息存储在请求对象中
      req.user = decodedToken;

      // 调用下一个中间件或路由处理函数
      return next();
    } catch (error) {
      // 如果解码或验证Token时发生错误，返回403状态码和错误信息
      console.error('Error verifying JWT:', error);
      return res.status(403).json({ message: 'Invalid token' });
    }
  }

  // 如果没有提供Token，返回401状态码和错误信息
  return res.status(401).json({ message: 'Token not provided' });
};

// 2.角色权限中间件函数
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

// 3.设置用户名的中间件函数
const setUsername = (req, res, next) => {
  if (req.user && req.user.userName) {
    // 设置用户名变量在response本地对象,userName可以直接应用到页面上.
    //存储在 res.locals 中的 userName 现在可以直接在同一请求响应周期内渲染的任何 EJS 模板中访问。
    res.locals.userName = req.user.userName;
    next();
  } else {
    return res.status(400).json({ message: 'Username not found in token' });
  }
};

module.exports = { authenticate, authorizeRole, setUsername };
