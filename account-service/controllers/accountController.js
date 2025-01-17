const User = require('../models/accountModel');

// 通用错误处理函数
const handleError = (err, res, msg = 'Server error') => {
  console.error('Error:', err.message); // 输出调试信息
  res.status(500).json({ success: false, message: err.message || msg });
};


// (1)查找账户信息,跳转到账户信息查看页面
const getAccount = async (req, res) => {
  const { _id } = req.params;
  console.log(`Received request to get user by ID: ${_id}`); // 调试信息
  try {
    const user = await User.findOne({ _id });
    if (user) {
      console.log('User retrieved successfully:', user); // 调试信息
      res.status(200).json({ success: true, user });
    } else {
      console.warn(`User not found with ID: ${_id}`); // 调试信息
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    handleError(err, res); // 使用通用错误处理函数
  }
};

// 修改密码提交
const updatePassword = async (req, res) => {
  const { password } = req.body; // 优化：修正参数名为 password
  try {
    const { _id } = req.params;
    const user = await User.findOne({ _id });
    if (user) {
      console.log('User found:', user); // 调试信息
      user.password = password; // 优化：直接更新用户的密码属性
      const updatedUser = await user.save(); // 优化：保存更新后的用户对象
      console.log('Password updated successfully:', updatedUser); // 调试信息
      res.status(200).json({ success: true, message: 'Update successful', user: updatedUser });
    } else {
      console.warn(`User not found with ID: ${_id}`); // 调试信息
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    handleError(err, res); // 使用通用错误处理函数
  }
};

module.exports = {
  getAccount, // 获取特定用户数据的方法
  updatePassword, // 更新密码
};
