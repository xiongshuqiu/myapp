const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 通用错误处理函数
const handleError = (err, res, msg = 'Server error') => {
  console.error('Error:', err.response ? err.response.data : err.message); // 输出详细调试信息
  res.status(err.response?.status || 500).json({
    success: false,
    message: err.response?.data?.message || msg,
  });
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
// 1. 获取所有员工档案
const getAllEmployeeRecords = async (req, res) => {
  try {
    const url = `${process.env.EMPLOYEE_SERVICE_URL}/employees/record/`;
    const response = await getRequest(url); // 发送 GET 请求以获取用户信息
    res.json(response); // 将响应数据返回给前端:包括数据和message
    if (response.success) {
      console.log(response);
    }
  } catch (err) {
    handleError(err, res);
  }
};

// 2. 创建新的员工档案
// (1) 显示新增员工档案表单(查找可用的bedId、elderlyId)
const renderNewEmployeeRecordForm = async (req, res) => {
  try {
    const url = `${process.env.EMPLOYEE_SERVICE_URL}/employees/record/new`;
    const response = await getRequest(url); // 发送 GET 请求以获取用户信息
    res.json(response); // 将响应数据返回给前端:包括数据和message
    if (response.success) {
      console.log(response);
    }
  } catch (err) {
    handleError(err, res);
  }
};
// (2) 提交新的员工档案数据
const createEmployeeRecord = async (req, res) => {
  const {
    employeeId,
    employeeName,
    position,
    contactNumber,
    email,
    unassignedUserId,
  } = req.body; // 从请求体中获取所有用户信息

  try {
    const data = {
      employeeId,
      employeeName,
      position,
      contactNumber,
      email,
      unassignedUserId,
    };
    const url = `${process.env.EMPLOYEE_SERVICE_URL}/employees/record/create`;
    const response = await postRequest(url, data); // 发送 POST 请求以创建新用户
    res.status(201).json(response); // 将响应数据返回给前端
    if (response.success) {
      console.log(response);
    }
  } catch (err) {
    handleError(err, res);
  }
};
// 3. 更新特定员工档案
// (1) 查找特定员工档案并显示编辑表单
const getEmployeeRecordById = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 _id
    const url = `${process.env.EMPLOYEE_SERVICE_URL}/employees/record/${_id}/update`;
    const response = await getRequest(url); // 发送 GET 请求以获取用户信息
    res.json(response); // 将响应数据返回给前端:包括数据和message
    if (response.success) {
      console.log(response);
    }
  } catch (err) {
    handleError(err, res);
  }
};
// (2) 提交更新后的员工档案数据
const updateEmployeeRecord = async (req, res) => {
  const { bedId, elderlyId, assignmentId, assignedDate, releaseDate } =
    req.body;
  try {
    const data = { bedId, elderlyId, assignmentId, assignedDate, releaseDate };
    const { _id } = req.params; // 从参数中获取 _Id
    const url = `${process.env.EMPLOYEE_SERVICE_URL}/employees/record/${_id}`;
    const response = await putRequest(url, data); // 发送 PUT 请求以更新用户信息
    res.json(response); // 将响应数据返回给前端
    if (response.success) {
      console.log(response);
    }
  } catch (err) {
    handleError(err, res);
  }
};

// 4. 删除特定员工档案
const deleteEmployeeRecord = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 userId
    const url = `${process.env.EMPLOYEE_SERVICE_URL}/employees/record/${_id}/delete`;
    const response = await deleteRequest(url); // 发送 DELETE 请求以删除用户
    res.json(response); // 将响应数据返回给前端
    if (response.success) {
      console.log(response);
    }
  } catch (err) {
    handleError(err, res);
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
