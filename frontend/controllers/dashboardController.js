// 处理获取用户请求
exports.getDashboard = async (req, res) => {
  try {
    // 获取解码后的用户信息
    //const userName = req.user.userName;
    const userName = req.session.userName;

    // 渲染 home/dashboard 视图，并传递 userName
    // res.render('home/dashboard', { userName });
    res.render('home/dashboard', { userName, activePage: 'dashboard' });
  } catch (error) {
    // 捕获并处理错误
    console.error('Error processing user information:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
