const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

//1.User Profile
// (1)查找登录账户用户信息
exports.getAccount = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 _id
    console.log(`Fetching account with ID: ${_id}`); // 调试信息/*  */
    // API调用的URL放入变量
    const apiUrl = `${process.env.API_URL}/api/users/${_id}`;
    const response = await axios.get(apiUrl); // 使用组装的URL进行API调用
    //处理响应数据
    const account = response.data;
    req.session.account = account; // 将用户信息存储到 session 中
  } catch (err) {
    console.error(
      'Error retrieving user:',
      err.response ? err.response.data : err.message,
    );
    // 使用明确的HTTP状态码和错误信息返回
    res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || 'Server error',
    });
  }
};
// (2)跳转到账户信息查看页面
exports.accountView = async (req, res) => {
  const account = req.session.account; // 从 session 中获取用户信息
  if (account) {
    res.render('account/userProfile.ejs', {
      // activePage: 'userManagement',
      message: response.data.message,
      account, // 确保传递响应中的用户信息（如果有）
    });
  } else {
    res
      .status(400)
      .json({ success: false, message: 'Account not found in session' });
  }
};
//(3)修改密码提交
exports.updatePassword = async (req, res) => {
  exports.updatePassword = async (req, res) => {
    try {
      const { _id } = req.params; // 从参数中获取 _id
      console.log(`Fetching account with ID: ${_id}`); // 调试信息

      // API调用的URL放入变量
      const apiUrl = `${process.env.API_URL}/api/users/${_id}`;
      const response = await axios.post(apiUrl); // 使用组装的URL进行API调用

      // 提取响应信息
      const message = response.data.message;

      // 渲染用户页面，并传递响应消息
      res.render('account/userProfile.ejs', {
        // activePage: 'userManagement',
        message,
        // user: response.data.user, // 确保传递响应中的用户信息（如果有）
      });
    } catch (err) {
      console.error(
        'Error retrieving user:',
        err.response ? err.response.data : err.message,
      );

      res.status(err.response?.status || 500).json({
        success: false,
        message: err.response?.data?.message || 'Server error',
      });
    }
  };
};
//2.Login Out
// 退出账户并跳转到登录页面
exports.deleteAccount = async (req, res) => {
  try {
    console.log('Logging out account'); // 调试信息
    // 销毁用户 session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res
          .status(500)
          .json({ success: false, message: 'Failed to destroy session' });
      }
      // 跳转到登录页面
      res.redirect('/login');
    });
  } catch (err) {
    console.error('Error logging out:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
