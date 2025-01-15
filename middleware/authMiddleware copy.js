const jwt = require('jsonwebtoken');

const authenticateTokenFromCookie = (req, res, next) => {
  // 从 Cookie 中获取 token
  const token = req.cookies.token;

  // 检查是否存在 JWT
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token not provided' });
  }

  // 验证和解码 JWT
  try {
    const decoded = jwt.verify(token, 'your_secret_key'); // 验证和解码 token
    req.user = decoded; // 将解码后的用户信息存储在 req.user 中
    next(); // 继续处理请求
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authenticateTokenFromCookie;
