const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 通用错误处理函数
const handleError = (err, res) => {
  console.error('Error:', err.response ? err.response.data : err.message);
  res.status(err.response?.status || 500).json({
    success: false,
    message: err.response?.data?.message || 'Server error',
  });
};

// 通用GET请求函数
const getRequest = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

// 通用POST请求函数
const postRequest = async (url, data) => {
  const response = await axios.post(url, data);
  return response.data;
};

//1.User Profile
// (1)查找登录账户用户信息
exports.getAccount = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 _id
    console.log(`Fetching account with ID: ${_id}`); // 调试信息
    const apiUrl = `${ process.env.API_URL}/api/users/${_id}`;
    const response = await getRequest(apiUrl); // 使用通用请求函数
    req.session.account = response; // 将用户信息存储到 session 中
  } catch (err) {
    handleError(err, res); // 使用通用错误处理函数
  }
};                    

// (2)跳转到账户信息查看页面
exports.accountView = async (req, res) => {
  const response = req.session.account; // 从 session 中获取用户信息
  if (response) {
    res.render('account/userProfile.ejs', { response });
  } else {
    res.status(400).json({ success: false, message: 'Account not found in session' });
  }
};

// (3)修改密码提交
exports.updatePassword = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 _id
    console.log(`Fetching account with ID: ${_id}`); // 调试信息
    const apiUrl = `${process.env.API_URL}/api//users/${_id}/password`;
    const data = { password: req.body.password }; // 新密码数据
    const response = await postRequest(apiUrl, data); // 调用通用提交函数
    const message = response.message;
    res.render('account/userProfile.ejs', { message });
  } catch (err) {
    handleError(err, res); // 使用通用错误处理函数
  }
};

//2.Login Out
// 退出账户并跳转到登录页面
exports.deleteAccount = async (req, res) => {
  try {
    console.log('Logging out account'); // 调试信息
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ success: false, message: 'Failed to destroy session' });
      }
      res.redirect('/login'); // 跳转到登录页面
    });
  } catch (err) {
    handleError(err, res); // 使用通用错误处理函数
  }
};
