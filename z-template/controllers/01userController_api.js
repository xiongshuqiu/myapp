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
// 1.查找所有用户信息
const getUsers = async (req, res) => {
  try {
    const url = `${process.env.USER_SERVICE_URL}/user/`;
    const response = await getRequest(url); // 发送 GET 请求以获取用户信息
    res.json(response); // 将响应数据返回给前端:包括数据和message
  } catch (err) {
    handleError(err, res)
  }
};
// 2. 创建用户 (C)
const createUser = async (req, res) => {
  const { userId, account, userName, passWord, phoneNumber, email, role } =
    req.body; // 从请求体中获取所有用户信息

  try {
    const url = `${process.env.USER_SERVICE_URL}/user/create`;
    const data = {
      userId: req.body.userId,
      account: req.body.account,
      userName: req.body.userName,
      passWord: req.body.passWord,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      role: req.body.role,
    }
    const response = await postRequest(url,data) // 发送 POST 请求以创建新用户
    res.status(201).json(response); // 将响应数据返回给前端
  } catch (err) {
    handleError(err, res)
  }
};
// 3. 更新用户信息 (U)
//(1)查找特定用户信息
const getUserById = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 _id
    const url = `${process.env.USER_SERVICE_URL}/user/${_id}/update`;
    const response = await getRequest(url); // 发送 GET 请求以获取用户信息
    const user = response.data;
    console.log(user);
    res.json(response); // 将响应数据返回给前端:包括数据和message
  } catch (err) {
    handleError(err, res)
  }
};
//(2)更新用户信息
const updateUser = async (req, res) => {
  const { userId, account, userName, passWord, phoneNumber, email, role } =
    req.body; // 从请求体中获取所有用户信息

  try {
    const { _id } = req.params; // 从参数中获取 _Id
    const url = `${process.env.USER_SERVICE_URL}/user/${_id}/update`;
    const data = {
      userId: req.body.userId,
      account: req.body.account,
      userName: req.body.userName,
      passWord: req.body.passWord,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      role: req.body.role,
    }
    const response = await postRequest(url,data); // 发送 PUT 请求以更新用户信息
    res.json(response); // 将响应数据返回给前端
  } catch (err) {
    handleError(err, res)
  }
};

// 5. 删除用户 (D)
const deleteUser = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 userId
    const url = `${process.env.USER_SERVICE_URL}/user/${_id}/delete`;
    const response = await postRequest(url); // 发送 DELETE 请求以删除用户
    res.json(response); // 将响应数据返回给前端
  } catch (err) {
    handleError(err, res)
  }
};

  module.exports = {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
  }
