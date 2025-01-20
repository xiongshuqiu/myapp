const {
  getNavItems,
} = require('../visibilityMiddleware/userManagementVisibility.js');
// 处理获取用户请求
exports.getDashboard = async (req, res) => {
  try {
    // 获取解码后的用户信息
    //const userName = req.user.userName;
    const userName = req.session.userName;

    const userRole = req.user.role; // 假设用户角色已存储在 req.user 中
    const navItems = getNavItems(userRole);
    res.render('home/dashboard', {
      userName,
      activePage: 'dashboard',
      navItems
    });
  } catch (error) {
    // 捕获并处理错误
    console.error('Error processing user information:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
