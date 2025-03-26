// 1. 导入模块
const axios = require('axios');

// 配置 axios 以允许跨域请求时携带 cookies
axios.defaults.withCredentials = true;

// 2. 定义 postLogin 函数，用于处理登录请求
exports.postLogin = async (req, res) => {
  // 2-1 从请求体中提取 username 和 password
  const { userName, passWord } = req.body;
  console.log({ userName, passWord });

  // 2-2 处理登录请求 (try-catch)
  try {
    // 1. 定义后端认证服务的 URL
    const urll = `${process.env.API_URL}/api/auth/login`;
    console.log(urll);

    // 2. 向后端认证服务发送登录请求
    const response = await axios.post(urll, { userName, passWord });
    console.log('API response:', response.data);

    // 3. 检查登录是否成功
    if (response.data.success) {
      const token = response.data.token;
      if (token) {
      
        res.cookie('jwt', token, {
          httpOnly: true,
          secure: false, // HTTP 环境下不使用 HTTPS
          sameSite: 'Lax', // 同站点请求，防止 CSRF 攻击
        });

        console.log('Cookie set successfully with token:', token);

        const userName = response.data.userName;
        // 5. 将用户名存储在会话中
        req.session.userName = userName;
        console.log('Username stored in session:', req.session.userName);

        //6. 重定向到首页
        return res.redirect('/dashboard');
       
      } else {
        console.log('token is mising in frontend');
      }
    } else {
      // 处理登录失败的情况
      console.error('Login failed:', response.data.message);
      return res
        .status(401)
        .json({ success: false, message: response.data.message });
    }
  } catch (error) {
    // 处理请求过程中可能出现的错误
    console.error('Error during login request:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error during login request' });
  }
};
