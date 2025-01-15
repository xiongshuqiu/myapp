const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 1.查找所用用户信息
exports.getUsers = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.API_URL}/api/user/`);
    const users = response.data;
    res.render('user/userManagement', { users, activePage: 'userManagement' }); // 将用户数据传递给EJS模板
  } catch (err) {
    console.error(
      'Error retrieving user:',
      err.response ? err.response.data : err.message,
    );
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// 2.新增用户
// 2-1点击AddUser按钮跳转到添加新用户的页面
exports.renderCreateUserForm = async (req, res) => {
  res.render('user/userCreate.ejs', {
    activePage: 'userManagement',
  });
};
// 2-2提交新用户信息
exports.createUser = async (req, res) => {
  const { userId, account, userName, passWord, phoneNumber, email, role } =
    req.body;
  console.log(userId, account, userName, passWord, phoneNumber, email, role);
  try {
    const response = await axios.post(
      `${process.env.API_URL}/api/user/create`,
      {
        userId,
        account,
        userName,
        passWord,
        phoneNumber,
        email,
        role,
      },
    );
    if (response.status === 201) {
      // 渲染用户创建页面，并传递数据给EJS模板
      return res.render('user/userCreate', {
        activePage: 'userManagement',
        message: response.data.message,
        user: response.data.user, // 确保传递新创建的用户信息
      });
    } else {
      // 渲染错误页面或其他页面
      return res.render('user/userCreate', {
        activePage: 'userManagement',
        message: response.data.message,
        // user: response.data.user, // 确保传递响应中的用户信息（如果有）
      });
    }
  } catch (err) {
    console.error(
      'Error creating user:',
      err.response ? err.response.data : err.message,
    );
    return res.render('user/userCreate', {
      activePage: 'userManagement',
      message: err.response ? err.response.data.message : 'Server error',
      user: {}, // 在错误情况下传递一个空对象
    });
  }
};

// 3.更新用户信息
// (1)查找特定用户信息并跳转到更新页面
exports.getUserById = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 _id
    console.log(`Fetching user with ID: ${_id}`); // 调试信息
    const response = await axios.get(`${process.env.API_URL}/api/user/${_id}`); // 使用组装的URL进行API调用
    const user = response.data;
    req.session.user = user; // 将用户信息存储到 session 中
    res.redirect(`/user/update/${_id}`); // 跳转到更新用户页面
  } catch (err) {
    console.error(
      'Error retrieving user:',
      err.response ? err.response.data : err.message,
    );
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// (2)跳转到用户编辑界面
exports.renderUpdateUserPage = (req, res) => {
  const user = req.session.user; // 从 session 中获取用户信息
  if (user) {
    res.render('user/userUpdate.ejs', {
      activePage: 'userManagement',
      user,
    });
  } else {
    res
      .status(400)
      .json({ success: false, message: 'User not found in session' });
  }
};

//(3) 提交更新用户信息
exports.updateUser = async (req, res) => {
  const {userId, account, userName, passWord, phoneNumber, email, role } = req.body;

  try {
    const { _id } = req.params; // 从请求参数中获取 _id
    const response = await axios.post(
      `${process.env.API_URL}/api/user/update/${_id}`,
      { userId, account, userName, passWord, phoneNumber, email, role },
    );

    if (response.status === 200) {
      // 渲染用户更新页面，并传递成功信息
      return res.render('user/userUpdate', {
        activePage: 'userManagement',
        message: response.data.message,
        user: response.data.user, // 更新后的用户信息
      });
    } else {
      // 渲染错误页面或其他页面
      return res.render('user/userUpdate', {
        activePage: 'userManagement',
        message: response.data.message,
        user: {},
      });
    }
  } catch (err) {
    console.error(
      'Error updating user:',
      err.response ? err.response.data : err.message,
    );
    res.status(500).json({ success: false, message: 'server is wrong' });
  }
};

// 7. 删除用户 (D)
exports.deleteUser = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取_id
    console.log(_id);
    const response = await axios.post(
      `${process.env.API_URL}/api/user/delete/${_id}`,
    );
    res.json(response.data);
  } catch (err) {
    console.error(
      'Error deleting user:',
      err.response ? err.response.data : err.message,
    );
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
