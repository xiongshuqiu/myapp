const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 通用错误处理函数
const handleError = (
  err,
  req, //注意一定要增加这个值（每个handleError都要）
  res,
  targetPage = 'elderly/elderlyResident/elderlyResidentCreate',
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

// 1.获取所有健康体检
const getAllHealthCheckups = async (req, res) => {
  const _id = req.user._id;
  const role = req.user.role;
  console.log('User data:', { _id, role }); // 调试信息
  const apiUrl = `${process.env.API_URL}/api/health/checkup/?_id=${_id}&role=${role}`;
  console.log('API URL:', apiUrl); // 调试信息

  try {
    const response = await getRequest(apiUrl);
    const elderlyResidents = response.data;
    if (response.success) {
      res.render('elderly/elderlyResident/elderlyResidentManagement', {
        activePage: 'elderly-management',
        elderlyResidents,
        navItems: req.navItems, // 将导航项传递到视图
        buttonItems: req.buttonItems,
        linkItems: req.linkItems,
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};
// 2.创建新的健康体检
//(1)显示新增健康体检表单
const renderNewHealthCheckupForm = async (req, res) => {
  const apiUrl = `${process.env.API_URL}/api/health/checkup/new`;
  console.log('API URL:', apiUrl); // 调试信息
  try {
    const response = await getRequest(apiUrl);

    if (response.success) {
      const { unResidentedElderlyIds } = response.data;
      res.render('elderly/elderlyResident/elderlyResidentCreate.ejs', {
        activePage: 'elderly-management',
        navItems: req.navItems, // 将导航项传递到视图
        unResidentedElderlyIds,
      });
    } else {
      throw new Error('Failed to retrieve data from API');
    }
  } catch (err) {
    console.error('Error in renderNewElderlyResidentForm:', err);
    handleError(err, req, res);
  }
};

//(2)提交新的健康体检数据
const createHealthCheckup = async (req, res) => {
  const { residentId, elderlyId, checkInTime, checkOutTime, status } = req.body;
  try {
    const data = {
      elderlyId,
      checkInTime,
      checkOutTime,
      status,
    };

    const apiUrl = `${process.env.API_URL}/api/health/checkup/create`;
    const response = await postRequest(apiUrl, data);
    const elderlyResident = response.data;
    console.log(elderlyResident);
    if (response.success) {
      console.log(response);
      res.redirect('/health/checkup/');
    }
  } catch (err) {
    const targetPage = 'elderly/elderlyResident/elderlyResidentCreate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};

// 3.更新特定健康体检
// (1)查找特定健康体检并显示编辑表单
const getHealthCheckupById = async (req, res) => {
  const { _id } = req.params; // 从参数中获取 _id
  console.log(`Fetching bedAssignment with ID: ${_id}`); // 调试信息
  try {
    const apiUrl = `${process.env.API_URL}/api/health/checkup/${_id}/update`;
    console.log(apiUrl);
    const response = await getRequest(apiUrl); // 使用组装的URL进行API调用
    const { elderlyIds,elderlyResident } = response.data;
    if (response.success) {
      console.log(response);
      res.render('elderly/elderlyResident/elderlyResidentUpdate.ejs', {
        activePage: 'elderly-management',
        navItems: req.navItems,
        elderlyIds,
        elderlyResident,
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};

//(2) 提交更新后的健康体检数据
const updateHealthCheckup = async (req, res) => {
  const { residentId, elderlyId, checkInTime, checkOutTime, status } = req.body;
  const { _id } = req.params;
  try {
    const data = {
      elderlyId,
      checkInTime,
      checkOutTime,
      status,
    };

    // 从请求参数中获取 _id
    const apiUrl = `${process.env.API_URL}/api/health/checkup/${_id}`;
    const response = await putRequest(apiUrl, data);
    //const elderlyResident  = response.data;
    if (response.success) {
      console.log(response);
      res.redirect('/health/checkup/');
    }
  } catch (err) {
    const targetPage = 'elderly/elderlyResident/elderlyResidentUpdate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};

// 4. 删除特定健康体检
const deleteHealthCheckup = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取_id
    console.log(_id);
    const apiUrl = `${process.env.API_URL}/api/health/checkup/${_id}/delete`;
    const response = await deleteRequest(apiUrl);
    if (response.success) {
      console.log(response);
      res.redirect('/health/checkup/');
    }
  } catch (err) {
    handleError(err, req, res);
  }
};
module.exports = {
  getAllHealthCheckups,
  renderNewHealthCheckupForm,
  createHealthCheckup,
  getHealthCheckupById,
  updateHealthCheckup,
  deleteHealthCheckup,
};
