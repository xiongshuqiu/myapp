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
// 1. 获取所有健康档案
const getAllHealthRecords = async (req, res) => {
  const { _id, role } = req.query; // 从查询参数中获取传递的数据
  try {
    const url = `${process.env.HEALTH_SERVICE_URL}/health/record/?_id=${_id}&role=${role}`;
    const response = await getRequest(url); // 发送 GET 请求以获取用户信息
    res.json(response); // 将响应数据返回给前端:包括数据和message
    if (response.success) {
      console.log(response);
    }
  } catch (err) {
    handleError(err, res);
  }
};

// 2. 创建新的健康档案
// (1) 显示新增健康档案表单(查找可用的bedId、elderlyId)
const renderNewHealthRecordForm = async (req, res) => {
  try {
    const url = `${process.env.HEALTH_SERVICE_URL}/health/record/new`;
    const response = await getRequest(url); // 发送 GET 请求以获取用户信息
    res.json(response); // 将响应数据返回给前端:包括数据和message
    if (response.success) {
      console.log(response);
    }
  } catch (err) {
    handleError(err, res);
  }
};
// (2) 提交新的健康档案数据
const createHealthRecord = async (req, res) => {
  const { elderlyId, medicalHistory, allergies, medications, createdAt } =
    req.body; // 从请求体中获取所有用户信息

  try {
    const data = {
      elderlyId,
      medicalHistory,
      allergies,
      medications,
      createdAt,
    };
    const url = `${process.env.HEALTH_SERVICE_URL}/health/record/create`;
    const response = await postRequest(url, data); // 发送 POST 请求以创建新用户
    res.status(201).json(response); // 将响应数据返回给前端
    if (response.success) {
      console.log(response);
    }
  } catch (err) {
    handleError(err, res);
  }
};
// 3. 更新特定健康档案
// (1) 查找特定健康档案并显示编辑表单
const getHealthRecordById = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 _id
    const url = `${process.env.HEALTH_SERVICE_URL}/health/record/${_id}/update`;
    const response = await getRequest(url); // 发送 GET 请求以获取用户信息
    res.json(response); // 将响应数据返回给前端:包括数据和message
    if (response.success) {
      console.log(response);
    }
  } catch (err) {
    handleError(err, res);
  }
};
// (2) 提交更新后的健康档案数据
const updateHealthRecord = async (req, res) => {
  const { elderlyId, checkInTime, checkOutTime, status } = req.body;
  try {
    const data = {
      elderlyId,
      checkInTime,
      checkOutTime,
      status,
    };
    const { _id } = req.params; // 从参数中获取 _Id
    const url = `${process.env.HEALTH_SERVICE_URL}/health/record/${_id}`;
    const response = await putRequest(url, data); // 发送 PUT 请求以更新用户信息
    res.json(response); // 将响应数据返回给前端
    if (response.success) {
      console.log(response);
    }
  } catch (err) {
    handleError(err, res);
  }
};

// 4. 删除特定健康档案
const deleteHealthRecord = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取 userId
    const url = `${process.env.HEALTH_SERVICE_URL}/health/record/${_id}/delete`;
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
  getAllHealthRecords,
  getAllHealthRecords,
  renderNewHealthRecordForm,
  createHealthRecord,
  getHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord,
};
