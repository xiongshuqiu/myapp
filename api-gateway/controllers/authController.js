// 1. 导入模块
const axios = require('axios');

// 配置 axios 以允许跨域请求时携带 cookies
axios.defaults.withCredentials = true;

// 2. 定义 login 函数，用于处理登录请求
exports.login = async (req, res) => {
  // 2-1 从请求体中提取 username 和 password
  const { userName, passWord } = req.body;
  console.log('API received:', { userName, passWord });

  // 2-2 处理登录请求 (try-catch)
  try {
    // 1. 向后端认证服务发送请求
    const urll = `${process.env.AUTH_SERVICE_URL}/auth/login`;
    console.log(urll);
    const response = await axios.post(urll, { userName, passWord }); // 向后端认证服务发送 HTTP POST 请求
    console.log('API response received:', response.data);

    // 2. 后端响应成功时：
    //    (1) 在 API 的 cookie 中存入 JWT
    //    (2) 转发后端发送的数据给前端
    if (response.data.success) {
      const token = response.data.token;
      if (token) {
     
        res.cookie('jwt', token, {
          httpOnly: true,
          secure: false, // HTTP 环境下不使用 HTTPS
          sameSite: 'Lax', // 同站点请求，防止 CSRF 攻击
        });

        console.log('Cookie set successfully with token:', token);

        // 向前端返回数据
        res.json(response.data);
      } else {
        console.error('API token failed:', response.data.message);
        // 处理 token 生成失败的情况
        res
          .status(500)
          .json({ success: false, message: 'Token generation failed' });
      }
    } else {
      console.error('Login failed:', response.data.message);
      // 处理后端数据返回不成功的情况
      res.status(401).json({ success: false, message: response.data.message });
    }
  } catch (err) {
    // 处理请求过程中可能出现的错误
    console.error(
      'Error forwarding request:',
      err.response ? err.response.data : err.message, // 获取错误信息
    );
    res.status(500).json({ success: false, message: 'Server error' }); // 返回服务器错误状态码和信息
  }
};
