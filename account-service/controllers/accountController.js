const User = require('../models/accountModel');

// 1.查找所有用户信息
const getUsers = async (req, res) => {
  console.log('Received request to get all users'); // 调试信息
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error retrieving users:', err.message); // 调试信息
    res.status(500).json({ message: err.message });
  }
};

// 2.新增用户
const createUser = async (req, res) => {
  const { userId, account, userName, passWord, phoneNumber, email, role } = req.body;
  console.log('Received request to create user with data:', req.body); // 调试信息
  try {
    let existingUser = await User.findOne({ userId });
    if (existingUser) {
      console.warn(`UserId already exists: ${userId}`); // 调试信息
      return res.status(400).json({ message: 'UserId already exists' });
    }

    existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn(`Email already exists: ${email}`); // 调试信息
      return res.status(400).json({ message: 'Email already exists' });
    }

    const userData = { userId, account, userName, passWord, phoneNumber, email, role };
    const user = new User(userData);
    const newUser = await user.save();
    console.log('User created successfully:', newUser); // 调试信息

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error.message); // 调试信息
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};
// 3.更新用户
//3-1 获取特定用户信息
const getUserById = async (req, res) => {
  const { _id } = req.params;
  console.log(`Received request to get user by ID: ${_id}`); // 调试信息
  try {
    const user = await User.findOne({ _id });
    if (user) {
      console.log('User retrieved successfully:', user); // 调试信息
      res.json(user);
    } else {
      console.warn(`User not found with ID: ${_id}`); // 调试信息
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error retrieving user:', err.message); // 调试信息
    res.status(500).json({ message: err.message });
  }
};
//3-1 更新用户信息
const updateUser = async (req, res) => {
  const {userId, account, userName, passWord, phoneNumber, email, role } = req.body;
  try {
    const { _id } = req.params; 
    const user = await User.findOne({_id});
    if (user) {
      // 打印找到的用户信息，调试用
      console.log('User found:', user);

      // 使用 _id 进行更新，并打印更新结果，调试用
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { userId,
          account, 
          userName, 
          passWord, 
          phoneNumber, 
          email, 
          role 
        }, 
        { new: true, runValidators: true }
      );

      if (updatedUser) {
        console.log('User updated successfully:', updatedUser); // 调试信息
        return res.status(200).json({ message: 'Update successful', user: updatedUser });
      } else {
        console.warn(`Failed to update user with ID: ${req.params._id}`); // 调试信息
        return res.status(404).json({ message: 'User not found' });
      }
    } else {
      console.warn(`User not found with ID: ${req.params.userId}`); // 调试信息
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating user:', err.message); // 调试信息
    res.status(400).json({ message: err.message });
  }
};



// 5. 删除用户数据
const deleteUser = async (req, res) => {
  try {
    const {_id } = req.params;  // 从请求参数中获取 id
    await User.findByIdAndDelete(_id);  // 直接使用 id 进行删除操作
    console.log('User deleted successfully:', _id);  // Debugging information
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);  // Debugging information
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};




// 6.导出模块
module.exports = {
  getUsers, // 获取所有用户数据的方法
  getUserById, // 获取特定用户数据的方法
  createUser, // 创建用户数据的方法
  updateUser, // 更新用户数据的方法
  deleteUser, // 删除用户数据的方法
};

   