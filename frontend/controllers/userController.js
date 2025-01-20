const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 通用错误处理函数
const handleError = (
  err,
  res,
  targetPage = 'user/userCreate',
  msg = 'Server error',
) => {
  console.error('Error:', err.response ? err.response.data : err.message); // 输出详细调试信息
  if (!res.headersSent) {
    res.status(err.response?.status || 500).render(targetPage, {
      activePage: 'userManagement',
      message: err.response?.data?.message || msg,
    });
  }
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
// 通用PUT请求函数
const putRequest = async (url, data) => {
  const response = await axios.put(url, data);
  return response.data;
};
// 通用Delete请求函数
const deleteRequest = async (url, data) => {
  const response = await axios.delete(url, data);
  return response.data;
};


// 1.查找所用用户信息
const getUsers = async (req, res) => {
  try {
    const apiUrl = `${process.env.API_URL}/api/users/`;
    const response = await getRequest(apiUrl);
    const users = response.data;
    res.render('user/userManagement', { activePage: 'userManagement', users });
  } catch (err) {
    handleError(err, res);
  }
};
// 2.新增用户
//(1)点击AddUser按钮跳转到新增用户的页面
const renderCreateUserForm = async (req, res) => {
  res.render('user/userCreate.ejs', {
    activePage: 'userManagement',
  });
};
//(2)提交新用户信息
const createUser = async (req, res) => {
  try {
    const data = {
      userId: req.body.userId,
      account: req.body.account,
      userName: req.body.userName,
      passWord: req.body.passWord,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      role: req.body.role,
    };
    console.log(data);
    const apiUrl = `${process.env.API_URL}/api/users/create`;
    const response = await postRequest(apiUrl, data);
    const user = response.data;
    console.log(user);
    if (response.success) {
      res.redirect('/users/');
    }
  } catch (err) {
    const targetPage = 'user/userCreate'; //用户需要输入新值
    handleError(err, res, targetPage);
  }
};

// 3.更新用户信息
// (1)查找特定用户信息并跳转到编辑用户信息页面
const getUserById = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 _id
    console.log(`Fetching user with ID: ${_id}`); // 调试信息
    const apiUrl = `${process.env.API_URL}/api/users/${_id}/update`;
    const response = await getRequest(apiUrl); // 使用组装的URL进行API调用
    const user = response.data;
    console.log(user);
    res.render('user/userUpdate.ejs', {
      activePage: 'userManagement',
      user,
    });
  } catch (err) {
    handleError(err, res);
  }
};

//(2) 提交已编辑的用户信息
const updateUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const data = {
      userId: req.body.userId,
      account: req.body.account,
      userName: req.body.userName,
      passWord: req.body.passWord,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      role: req.body.role,
    };
    console.log(data);
    // 从请求参数中获取 _id
    const apiUrl = `${process.env.API_URL}/api/users/${_id}`;
    const response = await putRequest(apiUrl, data);
    const user = response.data;
    console.log(user);
     if (response.success ) {
        res.redirect('/users/');
     }
  } catch (err) {
    const targetPage = 'user/userUpdate'; //用户需要输入新值
    handleError(err, res, targetPage);
  }
};

// 7. 删除用户 (D)
const deleteUser = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取_id
    console.log(_id);
    const apiUrl = `${process.env.API_URL}/api/users/${_id}/delete`;
    const response = await deleteRequest(apiUrl);
    if (response.sucess) {
      res.redirect('/users/');
    } else {
      // 处理失败的情况，返回简单的响应
      throw new Error(response.message); // 抛出错误
    }
  } catch (err) {
    handleError(err, res);
  }
};
module.exports = {
  getUsers,
  renderCreateUserForm,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
