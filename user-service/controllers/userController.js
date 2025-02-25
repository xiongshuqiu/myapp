const User = require('../models/userModel');
const getNextId = require('./genericController.js');
//获取所有的用户
const getUsers = async (req, res) => {
  console.log('Received request to get all users'); // 调试信息
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (err) {
    console.error('Error retrieving users:', err.message); // 调试信息
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. 新增用户
const createUser = async (req, res) => {
  // 生成新的 userId
  const { role, status, userName, passWord, phoneNumber, email } = req.body;
  console.log(role);
  let userId;
  if (role === 'family') {
    console.log('为家庭角色生成userId');
    userId = await getNextId('User', 'F', 'userId');
  } else if (role === 'admin' || role === 'medical') {
    console.log('为管理员或医疗角色生成userId');
    userId = await getNextId('User', 'U', 'userId');
  } else {
    console.warn(`意外的角色: ${role}`);
  }
  console.log('生成的userId:', userId);

  console.log('Received request to create user with data:', req.body); // 调试信息

  // 验证用户输入
  if (
    !userId ||
    !role ||
    !status ||
    !userName ||
    !passWord ||
    !phoneNumber ||
    !email
  ) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required fields' });
  }

  try {
    let existingUser = await User.findOne({ userId }); //let可以重新赋值
    if (existingUser) {
      console.warn(`UserId already exists: ${userId}`); // 调试信息
      return res
        .status(400)
        .json({ success: false, message: 'UserId already exists' });
    }
    existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn(`Email already exists: ${email}`); // 调试信息
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' });
    }

    const userData = {
      userId,
      status,
      userName,
      passWord,
      phoneNumber,
      email,
      role,
    };
    const user = new User(userData);
    const newUser = await user.save();
    console.log('User created successfully:', newUser); // 调试信息
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error.message); // 调试信息
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};
// 3. 获取特定用户信息
const getUserById = async (req, res) => {
  const { _id } = req.params;
  console.log(`Received request to get user by ID: ${_id}`); // 调试信息
  try {
    const user = await User.findOne({ _id });
    if (user) {
      console.log('User retrieved successfully:', user); // 调试信息
      return res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user,
      });
    } else {
      console.warn(`User not found with ID: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.error('Error retrieving user:', err.message); // 调试信息
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. 更新用户信息
const updateUser = async (req, res) => {
  const { status, userName, passWord, phoneNumber, email, role } = req.body;
  const { _id } = req.params;

  try {
    const user = await User.findOne({ _id });
    if (!user) {
      console.warn(`User not found with ID: ${_id}`); // 调试信息
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    // 更新用户信息
    user.status = status;
    user.userName = userName;
    user.passWord = passWord;
    user.phoneNumber = phoneNumber;
    user.email = email;
    user.role = role;

    // 保存更新后的用户信息
    await user.save();

    console.log('User updated successfully:', user); // 调试信息
    return res
      .status(200)
      .json({ success: true, message: 'Update successful', data: user });
  } catch (err) {
    console.error('Error updating user:', err.message); // 调试信息
    return res.status(400).json({ success: false, message: err.message });
  }
};

// 5. 删除用户数据
const deleteUser = async (req, res) => {
  const { _id } = req.params;

  try {
    await User.findByIdAndDelete(_id);
    console.log('User deleted successfully:', _id); // 调试信息
    return res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message); // 调试信息
    return res.status(400).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

// 6. 导出模块
module.exports = {
  getUsers, // 获取所有用户数据的方法
  getUserById, // 获取特定用户数据的方法
  createUser, // 创建用户数据的方法
  updateUser, // 更新用户数据的方法
  deleteUser, // 删除用户数据的方法
};
