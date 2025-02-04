const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 通用错误处理函数
const handleError = (
  err,
  req, //注意一定要增加这个值（每个handleError都要）
  res,
  targetPage = 'employee/employeeRecord/employeeRecordCreate',
  msg = 'Server error',
) => {
  console.error('Error:', err.response ? err.response.data : err.message); // 输出详细调试信息
  if (!res.headersSent) {
    res.status(err.response?.status || 500).render(targetPage, {
      activePage: 'employee-management',
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

// 1.获取所有员工档案
const getAllEmployeeRecords = async (req, res) => {
  const apiUrl = `${process.env.API_URL}/api/employees/record/`;
  console.log(apiUrl);
  try {
    const response = await getRequest(apiUrl);
    const employeeRecords = response.data;
    if (response.success) {
      res.render('employee/employeeRecord/employeeRecordManagement', {
        activePage: 'employee-management',
        employeeRecords,
        navItems: req.navItems, // 将导航项传递到视图
        buttonItems: req.buttonItems,
        linkItems: req.linkItems,
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};
// 2.创建新的员工档案
//(1)显示新增员工档案表单
const renderNewEmployeeRecordForm = async (req, res) => {
  const apiUrl = `${process.env.API_URL}/api/employees/record/new`;
  console.log('API URL:', apiUrl); // 调试信息
  try {
    const response = await getRequest(apiUrl);

    if (response.success) {
      const { unassignedUserIds } = response.data;
      res.render('employee/employeeRecord/employeeRecordCreate.ejs', {
        activePage: 'employee-management',
        navItems: req.navItems, // 将导航项传递到视图
        unassignedUserIds, // 传递存在的 elderlyId 到视图
      });
    } else {
      throw new Error('Failed to retrieve data from API');
    }
  } catch (err) {
    console.error('Error in renderNewEmployeeRecordForm:', err);
    handleError(err, req, res);
  }
};
//(2)提交新的员工档案数据
const createEmployeeRecord = async (req, res) => {
  const {
    employeeId,
    employeeName,
    position,
    contactNumber,
    email,
    unassignedUserId,
    status,
  } = req.body;
  try {
    const data = {
      employeeId,
      employeeName,
      position,
      contactNumber,
      email,
      unassignedUserId,
      status,
    };

    const apiUrl = `${process.env.API_URL}/api/employees/record/create`;
    const response = await postRequest(apiUrl, data);
    const bedStatus = response.data;
    console.log(bedStatus);
    if (response.success) {
      res.redirect('/employees/record/');
    }
  } catch (err) {
    const targetPage = 'employee/employeeRecord/employeeRecordCreate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};

// 3.更新特定员工档案
// (1)查找特定员工档案并显示编辑表单
const getEmployeeRecordById = async (req, res) => {
  const { _id } = req.params; // 从参数中获取 _id
  console.log(`Fetching employeeRecord with ID: ${_id}`); // 调试信息
  try {
    const apiUrl = `${process.env.API_URL}/api/employees/record/${_id}/update`;
    const response = await getRequest(apiUrl); // 使用组装的URL进行API调用
    const { employeeRecord, userIds } = response.data;
    console.log(userIds);
    if (response.success) {
      res.render('employee/employeeRecord/employeeRecordUpdate.ejs', {
        activePage: 'employee-management',
        employeeRecord,
        userIds,
        navItems: req.navItems,
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};

//(2) 提交更新后的员工档案数据
const updateEmployeeRecord = async (req, res) => {
  const { employeeId, employeeName, position, contactNumber, email, userId,status } =
    req.body;
  const { _id } = req.params;
  try {
    const data = { employeeId, employeeName, position, contactNumber, email, userId,status};

    // 从请求参数中获取 _id
    const apiUrl = `${process.env.API_URL}/api/employees/record/${_id}`;
    const response = await putRequest(apiUrl, data);
    const bedStatus = response.data;
    console.log(bedStatus);
    if (response.success) {
      res.redirect('/employees/record/');
    }
  } catch (err) {
    const targetPage = 'employee/employeeRecord/employeeRecordUpdate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};

// 4. 删除特定员工档案
const deleteEmployeeRecord = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取_id
    console.log(_id);
    const apiUrl = `${process.env.API_URL}/api/employees/record/${_id}/delete`;
    const response = await deleteRequest(apiUrl);
    if (response.success) {
      res.redirect('/employees/record/');
    }
  } catch (err) {
    handleError(err, req, res);
  }
};
module.exports = {
  getAllEmployeeRecords,
  renderNewEmployeeRecordForm,
  createEmployeeRecord,
  getEmployeeRecordById,
  updateEmployeeRecord,
  deleteEmployeeRecord,
};
