const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 处理获取用户请求
exports.getDashboard = async (req, res) => {
  try {
    // 获取解码后的用户信息
    //const userName = req.user.userName;
    const userName = req.session.userName;
    res.render('home/dashboard', {
      userName,
      activePage: 'dashboard',
      navItems:req.navItems
    });
  } catch (error) {
    // 捕获并处理错误
    console.error('Error processing user information:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
