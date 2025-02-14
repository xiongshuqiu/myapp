const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 通用错误处理函数
const handleError = (
  err,
  req, //注意一定要增加这个值（每个handleError都要）
  res,
  targetPage = 'health/healthRecord/healthRecordCreate',
  msg = 'Server error',
) => {
  console.error('Error:', err.response ? err.response.data : err.message); // 输出详细调试信息
  if (!res.headersSent) {
    res.status(err.response?.status || 500).render(targetPage, {
      activePage: 'health-management',
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

// 1.获取所有老人健康档案
const getAllHealthRecords = async (req, res) => {
  const _id = req.user._id;
  const role = req.user.role;
  console.log('User data:', { _id, role }); // 调试信息
  const apiUrl = `${process.env.API_URL}/api/health/record/?_id=${_id}&role=${role}`;
  console.log('API URL:', apiUrl); // 调试信息

  try {
    const response = await getRequest(apiUrl);
    const healthRecords = response.data;
    if (response.success) {
      console.log(response);
      res.render('health/healthRecord/healthRecordManagement', {
        activePage: 'health-management',
        healthRecords,
        navItems: req.navItems, // 将导航项传递到视图
        buttonItems: req.buttonItems,
        linkItems: req.linkItems,
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};
// 2.创建新的老人健康档案
//(1)显示新增老人健康档案表单
const renderNewHealthRecordForm = async (req, res) => {
  const apiUrl = `${process.env.API_URL}/api/health/record/new`;
  console.log('API URL:', apiUrl); // 调试信息
  try {
    const response = await getRequest(apiUrl);

    if (response.success) {
      const unrecordedElderlyIds = response.data;
      res.render('health/healthRecord/healthRecordCreate.ejs', {
        activePage: 'health-management',
        navItems: req.navItems, // 将导航项传递到视图
        unrecordedElderlyIds,
      });
    } else {
      throw new Error('Failed to retrieve data from API');
    }
  } catch (err) {
    console.error('Error in renderNewBedAssignmentForm:', err);
    handleError(err, req, res);
  }
};

//(2)提交新的老人健康档案数据
const createHealthRecord = async (req, res) => {
  const { elderlyId, medicalHistory, allergies, medications, createdAt } =
    req.body;
  try {
    const data = {
      elderlyId,
      medicalHistory,
      allergies,
      medications,
      createdAt,
    };

    const apiUrl = `${process.env.API_URL}/api/health/record/create`;
    const response = await postRequest(apiUrl, data);
    const elderlyLeave = response.data;
    console.log(elderlyLeave);
    if (response.success) {
      console.log(response);
      res.redirect('/health/record/');
    }
  } catch (err) {
    const targetPage = 'health/healthRecord/healthRecordCreate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};

// 3.更新特定老人健康档案
// (1)查找特定老人健康档案并显示编辑表单
const getHealthRecordById = async (req, res) => {
  const { _id } = req.params; // 从参数中获取 _id
  console.log(`Fetching bedAssignment with ID: ${_id}`); // 调试信息
  try {
    const apiUrl = `${process.env.API_URL}/api/health/record/${_id}/update`;
    console.log(apiUrl);
    const response = await getRequest(apiUrl); // 使用组装的URL进行API调用
    const healthRecords = response.data;
    console.log(healthRecords);
    if (response.success) {
      console.log(response);
      res.render('health/healthRecord/healthRecordUpdate.ejs', {
        activePage: 'health-management',
        navItems: req.navItems,
        healthRecords,
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};

//(2) 提交更新后的老人健康档案数据
const updateHealthRecord = async (req, res) => {
  const { elderlyId, medicalHistory, allergies, medications, createdAt } =
    req.body;
  const { _id } = req.params;
  try {
    const data = {
      elderlyId,
      medicalHistory,
      allergies,
      medications,
      createdAt,
    };

    // 从请求参数中获取 _id
    const apiUrl = `${process.env.API_URL}/api/health/record/${_id}`;
    const response = await putRequest(apiUrl, data);
    if (response.success) {
      console.log(response);
      res.redirect('/health/record/');
    }
  } catch (err) {
    const targetPage = 'health/healthRecord/healthRecordUpdate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};
// 4. 删除特定老人档案
const deleteHealthRecord = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取_id
    console.log(_id);
    const apiUrl = `${process.env.API_URL}/api/health/record/${_id}/delete`;
    const response = await deleteRequest(apiUrl);
    if (response.success) {
      console.log(response);
      res.redirect('/health/record/');
    }
  } catch (err) {
    handleError(err, req, res);
  }
};

module.exports = {
  getAllHealthRecords,
  renderNewHealthRecordForm,
  createHealthRecord,
  getHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord,
};
