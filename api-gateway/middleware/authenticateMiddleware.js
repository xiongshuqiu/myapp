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




// // 4. 集成权限检查的中间件函数
// const checkPermission = (service, subService, action) => {
//   return async (req, res, next) => {
//     try {
//       const role = await Role.findOne(req.user.role); // 假设你已经通过其它中间件获取了用户角色
//       const permission = await Permission.findOne({
//         roleId: role.roleId,
//         service: service,
//         subService: subService,
//       });

//       if (permission && permission[action]) {
//         next();
//       } else {
//         res.status(403).json({ message: 'No permission' });
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };
// };

// module.exports = { authenticate, authorizeRole, setUsername, checkPermission };

// // 2.中间件：生成子Token
// const generateSubToken = (req, res, next) => {
//   try {
//     const decoded = req.user;
//     const subToken = jwt.sign(
//       { _id: decoded._id, role: decoded.role },
//       'your_secret_key',
//       { expiresIn: '1h' },
//     );

//     req.subToken = subToken; // 设置自定义属性

//     console.log('Sub Token generated:', subToken);
//     next();
//   } catch (error) {
//     console.error('Error generating sub token:', error);
//     return res.status(500).send('Error generating sub token');
//   }
// };
// //3.中间件：转发请求到微服务
// const forwardRequest = (req, res) => {
//   // 转发请求
//   const options = {
//     method: req.method,
//     url: 'http://46.17.40.33:8062/users', // 替换为你的微服务URL
//     headers: {
//       Authorization: `Bearer ${req.subToken}`, // 从自定义属性中获取子Token
//       'Content-Type': 'application/json',
//     },
//     data: req.body,
//   };

//   axios(options)
//     .then((response) => {
//       res.status(response.status).send(response.data);
//     })
//     .catch((error) => {
//       console.error('Error forwarding request to microservice:', error);
//       res.status(500).send('Internal Server Error');
//     });
// };
// module.exports = { authenticate, generateSubToken, forwardRequest };
module.exports =  authenticate;