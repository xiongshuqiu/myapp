
const jwt = require('jsonwebtoken');
// 中间件：验证子Token
const verifySubToken = (req, res, next) => {
  const subToken = req.headers['x-sub-token'];
  if (!subToken) {
    return res.status(401).send('Sub-token is missing');
  }

  try {
    // 验证子Token
    const decoded = jwt.verify(subToken, process.env.NEW_JWT_SECRET);
    req.user = decoded; // 将用户信息挂载到请求对象
    next();
  } catch (err) {
    console.error('Sub-token validation failed:', err);
    return res.status(403).send('Invalid sub-token');
  }
};

