// 1. 导入模块
const jwt = require('jsonwebtoken');
const User = require('../models/authModel');

// 2. 定义 postLogin 函数，用于处理登录请求
exports.postLogin = async (req, res) => {
  // 2-1 从请求体中提取 username, password
  const { userName, passWord } = req.body;
  console.log('auth-service received', { userName, passWord });

  // 2-2 处理登录请求 (try-catch)
  try {
    // 1. 从数据库中查找请求体中的 username
    const user = await User.findOne({ userName: userName });
    console.log('User found:', user);

    // 2. 判断用户存在且密码匹配
    if (user && user.passWord === passWord) {
      // 检查用户角色是否存在
      if (user.role) {
        console.log('Role found:', user.role);

        // 3. 生成 JWT 并存入 cookie
        const token = jwt.sign(
          { userName: user.userName, role: user.role, _id: user._id },
          'your_secret_key', // 这里是签名密钥（应保存在安全的地方）
          { expiresIn: '24h' }, // 设置 token 的有效期
        );
        console.log('Generated token:', token);

        
        res.cookie('jwt', token, {
        
            httpOnly: true, 
            secure: false, // 因为生产环境也是HTTP，所以这里设置为false
            sameSite: 'Lax', // 设置为Lax
          });
        console.log('Cookie set successfully with token:', token);
        

        // 4. 向api返回结果（数据）
        return res.json({
          success: true,
          userName: user.userName,
          role: user.role,
          message: 'Login successful',
          token: token,
        });
      } else {
        console.log('Role is missing');
        // 用户角色缺失处理
        return res.status(400).json({ message: 'Role is required' });
      }
    } else if (!user) {
      console.log('User not found');
      // 用户未找到处理
      return res.status(404).json({ message: 'User not found' });
    } else {
      console.log('Invalid password');
      // 密码错误处理
      return res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error processing login request:', error);
    // 处理服务器错误
    return res
      .status(500)
      .json({ message: 'An error occurred while processing your request' });
  }
};
