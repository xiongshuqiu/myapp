//导入模块
const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

// 配置 axios 以允许跨域请求时携带 cookies
axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 1.查找所有用户信息
exports.getUsers = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.USER_SERVICE_URL}/user/`); // 发送 GET 请求以获取用户信息
    res.json(response.data); // 将响应数据返回给前端:包括数据和message
  } catch (err) {
    console.error(
      'Error retrieving user:',
      err.response ? err.response.data : err.message,
    ); // 处理获取用户信息时的错误并记录错误信息
    res.status(500).json({ success: false, message: 'Server error' }); // 返回服务器错误状态码和信息
  }
};
// 2. 创建用户 (C)
exports.createUser = async (req, res) => {
  const { userId, account, userName, passWord, phoneNumber, email, role } =
    req.body; // 从请求体中获取所有用户信息

  try {
    const response = await axios.post(
      `${process.env.USER_SERVICE_URL}/user/create`,
      {
        userId,
        account,
        userName,
        passWord,
        phoneNumber,
        email,
        role,
      },
    ); // 发送 POST 请求以创建新用户
    res.json(response.data); // 将响应数据返回给前端
  } catch (err) {
    console.error(
      'Error creating user:',
      err.response ? err.response.data : err.message,
    ); // 处理创建用户时的错误并记录错误信息
    res.status(err.response ? err.response.status : 500).json({
      success: false,
      message: err.response ? err.response.data.message : 'Server error',
    }); // 返回相应状态码和信息
  }
};
// 3. 更新用户信息 (U)
//(1)查找特定用户信息
exports.getUserById = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 _id
    const response = await axios.get(
      `${process.env.USER_SERVICE_URL}/user/${_id}`,
    ); // 发送 GET 请求以获取用户信息
    const user = response.data;
    console.log(user);
    res.json(response.data); // 将响应数据返回给前端:包括数据和message
  } catch (err) {
    console.error(
      'Error retrieving user:',
      err.response ? err.response.data : err.message,
    ); // 处理获取用户信息时的错误并记录错误信息
    res.status(500).json({ success: false, message: 'Server error' }); // 返回服务器错误状态码和信息
  }
};
//(2)更新用户信息
exports.updateUser = async (req, res) => {
  const { userId, account, userName, passWord, phoneNumber, email, role } =
    req.body; // 从请求体中获取所有用户信息

  try {
    const { _id } = req.params; // 从参数中获取 _Id
    const response = await axios.post(
      `${process.env.USER_SERVICE_URL}/user/update/${_id}`,
      {
        userId,
        account,
        userName,
        passWord,
        phoneNumber,
        email,
        role,
      },
    ); // 发送 PUT 请求以更新用户信息
    res.json(response.data); // 将响应数据返回给前端
  } catch (err) {
    console.error(
      'Error updating user:',
      err.response ? err.response.data : err.message,
    ); // 处理更新用户信息时的错误并记录错误信息
    res.status(500).json({ success: false, message: 'Server error' }); // 返回服务器错误状态码和信息
  }
};

// 5. 删除用户 (D)
exports.deleteUser = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 userId
    const response = await axios.post(
      `${process.env.USER_SERVICE_URL}/user/delete/${_id}`,
    ); // 发送 DELETE 请求以删除用户
    res.json(response.data); // 将响应数据返回给前端
  } catch (err) {
    console.error(
      'Error deleting user:',
      err.response ? err.response.data : err.message,
    ); // 处理删除用户时的错误并记录错误信息
    res.status(500).json({ success: false, message: 'Server error' }); // 返回服务器错误状态码和信息
  }
};
