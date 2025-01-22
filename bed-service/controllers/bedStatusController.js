const User = require('../models/userModel');

// 1. 查找所有用户信息
const getUsers = async (req, res) => {
  console.log('Received request to get all users'); // 调试信息
  try {
    const users = await User.find();
    res.status(200).json({success: true, message: 'Users retrieved successfully', data: users });
  } catch (err) {
    console.error('Error retrieving users:', err.message); // 调试信息
    res.status(500).json({success: false, message: err.message });
  }
};

// 2. 新增用户
const createUser = async (req, res) => {
  const { userId, account, userName, passWord, phoneNumber, email, role } = req.body;
  console.log('Received request to create user with data:', req.body); // 调试信息

  // 验证用户输入
  if (!userId || !account || !userName || !passWord || !phoneNumber || !email || !role) {
    return res.status(400).json({success: false, message: 'Missing required fields' });
  }

  try {
    let existingUser = await User.findOne({ userId });//let可以重新赋值
    if (existingUser) {
      console.warn(`UserId already exists: ${userId}`); // 调试信息
      return res.status(400).json({ success: false, message: 'UserId already exists' });
    }

    existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn(`Email already exists: ${email}`); // 调试信息
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const userData = { userId, account, userName, passWord, phoneNumber, email, role };
    const user = new User(userData);
    const newUser = await user.save();
    console.log('User created successfully:', newUser); // 调试信息

    return res.status(201).json({ success: true, message: 'User created successfully', data: newUser });
  } catch (error) {
    console.error('Error creating user:', error.message); // 调试信息
    return res.status(500).json({success: false, message: 'An error occurred', error: error.message });
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
      return res.status(200).json({ success: true, message: 'User retrieved successfully', data: user });
    } else {
      console.warn(`User not found with ID: ${_id}`); // 调试信息
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.error('Error retrieving user:', err.message); // 调试信息
    return res.status(500).json({  success: false, message: err.message });
  }
};

// 3. 更新用户信息
const updateUser = async (req, res) => {
  const { userId, account, userName, passWord, phoneNumber, email, role } = req.body;
  const { _id } = req.params;

  try {
    const user = await User.findOne({ _id });
    if (!user) {
      console.warn(`User not found with ID: ${_id}`); // 调试信息
      return res.status(404).json({  success: false, message: 'User not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { userId, account, userName, passWord, phoneNumber, email, role },
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      console.log('User updated successfully:', updatedUser); // 调试信息
      return res.status(200).json({  success: true, message: 'Update successful', data: updatedUser });
    } else {
      console.warn(`Failed to update user with ID: ${_id}`); // 调试信息
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating user:', err.message); // 调试信息
    return res.status(400).json({  success: false, message: err.message });
  }
};

// 5. 删除用户数据
const deleteUser = async (req, res) => {
  const { _id } = req.params;

  try {
    await User.findByIdAndDelete(_id);
    console.log('User deleted successfully:', _id); // 调试信息
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message); // 调试信息
    return res.status(400).json({success: false, message: 'An error occurred', error: error.message });
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
