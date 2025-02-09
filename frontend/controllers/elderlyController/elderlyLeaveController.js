const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 通用错误处理函数
const handleError = (
  err,
  req, //注意一定要增加这个值（每个handleError都要）
  res,
  targetPage = 'elderly/elderlyLeave/elderlyLeaveCreate',
  msg = 'Server error',
) => {
  console.error('Error:', err.response ? err.response.data : err.message); // 输出详细调试信息
  if (!res.headersSent) {
    res.status(err.response?.status || 500).render(targetPage, {
      activePage: 'elderly-management',
      message: err.response?.data?.message || msg,
      navItems: req.navItems, // 将导航项传递到视图
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
const deleteRequest = async (url) => {
  const response = await axios.delete(url);
  return response.data;
};

// 1.获取所有老人请假请求
const getAllElderlyLeaveRequests = async (req, res) => {
  const _id = req.user._id;
  const role = req.user.role;
  console.log('User data:', { _id, role }); // 调试信息
  const apiUrl = `${process.env.API_URL}/api/elderly/leave/?_id=${_id}&role=${role}`;
  console.log('API URL:', apiUrl); // 调试信息

  try {
    const response = await getRequest(apiUrl);
    const elderlyLeaves = response.data;
    if (response.success) {
      console.log(response);
      res.render('elderly/elderlyLeave/elderlyLeaveManagement', {
        activePage: 'elderly-management',
        elderlyLeaves,
        navItems: req.navItems, // 将导航项传递到视图
        buttonItems: req.buttonItems,
        linkItems: req.linkItems,
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};
// 2.创建新的老人请假请求
//(1)显示新增老人请假请求表单
const renderNewElderlyLeaveRequestForm = async (req, res) => {
  const apiUrl = `${process.env.API_URL}/api/elderly/leave/new`;
  console.log('API URL:', apiUrl); // 调试信息
  try {
    const response = await getRequest(apiUrl);

    if (response.success) {
      const { elderlyIds } = response.data;
      res.render('elderly/elderlyLeave/elderlyLeaveCreate.ejs', {
        activePage: 'elderly-management',
        navItems: req.navItems, // 将导航项传递到视图
        elderlyIds,
      });
    } else {
      throw new Error('Failed to retrieve data from API');
    }
  } catch (err) {
    console.error('Error in renderNewBedAssignmentForm:', err);
    handleError(err, req, res);
  }
};

//(2)提交新的老人请假请求数据
const createElderlyLeaveRequest = async (req, res) => {
  const {
    elderlyId,
    reason,
    startDate,
    endDate,
    status,
    type,
    additionalNotes,
    applicationDate,
  } = req.body;
  try {
    const data = {
      elderlyId,
      reason,
      startDate,
      endDate,
      status,
      type,
      additionalNotes,
      applicationDate,
    };

    const apiUrl = `${process.env.API_URL}/api/elderly/leave/create`;
    const response = await postRequest(apiUrl, data);
    const elderlyLeave = response.data;
    console.log(elderlyLeave);
    if (response.success) {
      console.log(response);
      res.redirect('/elderly/leave/');
    }
  } catch (err) {
    const targetPage = 'elderly/elderlyLeave/elderlyLeaveCreate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};

// 3.更新特定老人请假请求
// (1)查找特定老人请假请求并显示编辑表单
const getElderlyLeaveRequestById = async (req, res) => {
  const { _id } = req.params; // 从参数中获取 _id
  console.log(`Fetching bedAssignment with ID: ${_id}`); // 调试信息
  try {
    const apiUrl = `${process.env.API_URL}/api/elderly/leave/${_id}/update`;
    console.log(apiUrl);
    const response = await getRequest(apiUrl); // 使用组装的URL进行API调用
    const { bedAssignment, bedIds, elderlyIds } = response.data;
    if (response.success) {
      console.log(response);
      res.render('elderly/elderlyLeave/elderlyLeaveUpdate.ejs', {
        activePage: 'elderly-management',
        navItems: req.navItems,
        bedAssignment,
        bedIds, //beIds包括：bedId、status
        elderlyIds, //包括elderlyId、elderlyName
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};

//(2) 提交更新后的老人请假请求数据
const updateElderlyLeaveRequest = async (req, res) => {
  const { bedId, elderlyId, assignmentId, assignedDate, releaseDate } =
    req.body;
  const { _id } = req.params;
  try {
    const data = { bedId, elderlyId, assignmentId, assignedDate, releaseDate };

    // 从请求参数中获取 _id
    const apiUrl = `${process.env.API_URL}/api/elderly/leave/${_id}`;
    const response = await putRequest(apiUrl, data);
    // const bedAssignment = response.data;
    if (response.success) {
      console.log(response);
      res.redirect('/elderly/leave/');
    }
  } catch (err) {
    const targetPage = 'elderly/elderlyLeave/elderlyLeaveUpdate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};
// 4. 删除特定老人档案
const deleteElderlyLeaveRequest = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取_id
    console.log(_id);
    const apiUrl = `${process.env.API_URL}/api/elderly/record/${_id}/delete`;
    const response = await deleteRequest(apiUrl);
    if (response.success) {
      console.log(response);
      res.redirect('/elderly/record/');
    }
  } catch (err) {
    handleError(err, req, res);
  }
};

module.exports = {
  getAllElderlyLeaveRequests,
  renderNewElderlyLeaveRequestForm,
  createElderlyLeaveRequest,
  getElderlyLeaveRequestById,
  updateElderlyLeaveRequest,
  deleteElderlyLeaveRequest,
};
