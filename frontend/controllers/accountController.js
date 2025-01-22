const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 通用错误处理函数
const handleError = (err, res, msg = 'Server error') => {
  console.error('Error:', err.response ? err.response.data : err.message); // 输出详细调试信息
  res.status(err.response?.status || 500).json({
    success: false,
    message: err.response?.data?.message || msg,
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
//(1)查找账户信息,跳转到账户信息查看页面
exports.getAccount = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 _id
    console.log(`Fetching account with ID: ${_id}`); // 调试信息
    const apiUrl = `${process.env.API_URL}/api/accounts/${_id}/view`;
    const response = await getRequest(apiUrl); // 使用通用请求函数
    const user = response.data; // user内容为： res.status(200).json({ sucess: true, message:'get user',user });
    console.log(user);
    res.render('account/userProfile.ejs', {
      activePage: 'dashboard',
      user, // 传递 user 对象给 EJS 模板
      navItems: req.navItems, // 将导航项传递到视图
    });
  } catch (err) {
    handleError(err, res); // 使用通用错误处理函数
  }
};

// (3)修改密码提交
exports.updatePassword = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 _id
    console.log(`Fetching account with ID: ${_id}`); // 调试信息
    const apiUrl = `${process.env.API_URL}/api/accounts/${_id}/password`; // 修正 URL 中多余的 /
    const data = { password: req.body.password }; // 新密码数据
    const response = await postRequest(apiUrl, data); // 调用通用提交函数
    const message = response.message;
    res.redirect(`/accounts/${_id}/view`);
  } catch (err) {
    handleError(err, res); // 使用通用错误处理函数
  }
};

//2.Login Out
// 退出账户并跳转到登录页面(可以清楚cookie)
exports.logOut = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect('/dashboard'); // 如果登出失败，重定向回仪表盘
      }

      // 确保清除所有相关的Cookies
      res.clearCookie('connect.sid', { path: '/' });

      // 确保在重定向之前清除所有可能的会话相关Cookie
      Object.keys(req.cookies).forEach((cookieName) => {
        res.clearCookie(cookieName);
      });

      res.redirect('/auth/login'); // 重定向到登录页面
    });
  } catch (err) {
    handleError(err, req, res); // 使用通用错误处理函数，确保传递 req 参数
  }
};
