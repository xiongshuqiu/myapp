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

// 1.获取所有老人入住退住数据
const getAllElderlyResidents = async (req, res) => {
  const _id = req.user._id;
  const role = req.user.role;
  console.log('User data:', { _id, role }); // 调试信息
  const apiUrl = `${process.env.API_URL}/api/elderly/resident/?_id=${_id}&role=${role}`;
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
// 2.创建新的老人入住退住数据
//(1)显示新增老人入住退住数据表单
const renderNewElderlyResidentForm = async (req, res) => {
  const apiUrl = `${process.env.API_URL}/api/elderly/resident/new`;
  console.log('API URL:', apiUrl); // 调试信息
  try {
    const response = await getRequest(apiUrl);

    if (response.success) {
      const { employeeIds, userIds } = response.data;
      res.render('elderly/elderlyResident/elderlyResidentCreate.ejs', {
        activePage: 'elderly-management',
        navItems: req.navItems, // 将导航项传递到视图
        employeeIds, // 传递可用的 bedId 到视图
        userIds, // 传递存在的 elderlyId 到视图
      });
    } else {
      throw new Error('Failed to retrieve data from API');
    }
  } catch (err) {
    console.error('Error in renderNewElderlyRecordForm:', err);
    handleError(err, req, res);
  }
};

//(2)提交新的老人入住退住数据数据
const createElderlyResident = async (req, res) => {
  const {
    elderlyId,
    elderlyName,
    elderlyPhone,
    dateOfBirth,
    gender,
    address,
    medicalHistory,
    allergies,
    emergencyContactName,
    emergencyContactPhone,
    userId,
    employeeId,
  } = req.body;
  try {
    const data = {
      elderlyId,
      elderlyName,
      elderlyPhone,
      dateOfBirth,
      gender,
      address,
      medicalHistory,
      allergies,
      emergencyContactName,
      emergencyContactPhone,
      userId,
      employeeId,
    };

    const apiUrl = `${process.env.API_URL}/api/elderly/resident/create`;
    const response = await postRequest(apiUrl, data);
    const elderlyRecord = response.data;
    console.log(elderlyRecord);
    if (response.success) {
      console.log(response);
      res.redirect('/elderly/resident/');
    }
  } catch (err) {
    const targetPage = 'elderly/elderlyResident/elderlyResidentCreate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};

// 3.更新特定老人入住退住数据
// (1)查找特定老人入住退住数据并显示编辑表单
const getElderlyResidentById = async (req, res) => {
  const { _id } = req.params; // 从参数中获取 _id
  console.log(`Fetching bedAssignment with ID: ${_id}`); // 调试信息
  try {
    const apiUrl = `${process.env.API_URL}/api/elderly/resident/${_id}/update`;
    console.log(apiUrl);
    const response = await getRequest(apiUrl); // 使用组装的URL进行API调用
    const { elderlyRecord, userIds, employeeIds } = response.data;
    if (response.success) {
      console.log(response);
      res.render('elderly/elderlyResident/elderlyResidentUpdate.ejs', {
        activePage: 'elderly-management',
        navItems: req.navItems,
        elderlyRecord,
        userIds, //userIds包括userId、role
        employeeIds, //包括employeeId、employeeName
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};

//(2) 提交更新后的老人入住退住数据数据
const updateElderlyResident = async (req, res) => {
  const {
    elderlyId,
    elderlyName,
    elderlyPhone,
    dateOfBirth,
    gender,
    address,
    medicalHistory,
    allergies,
    emergencyContactName,
    emergencyContactPhone,
    userId,
    employeeId,
  } = req.body;
  const { _id } = req.params;
  try {
    const data = {
      elderlyId,
      elderlyName,
      elderlyPhone,
      dateOfBirth,
      gender,
      address,
      medicalHistory,
      allergies,
      emergencyContactName,
      emergencyContactPhone,
      userId,
      employeeId,
    };

    // 从请求参数中获取 _id
    const apiUrl = `${process.env.API_URL}/api/elderly/resident/${_id}`;
    const response = await putRequest(apiUrl, data);
    //const elderlyRecord  = response.data;
    if (response.success) {
      console.log(response);
      res.redirect('/elderly/resident/');
    }
  } catch (err) {
    const targetPage = 'elderly/elderlyResident/elderlyResidentUpdate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};

// 4. 删除特定老人入住退住数据
const deleteElderlyResident = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取_id
    console.log(_id);
    const apiUrl = `${process.env.API_URL}/api/elderly/resident/${_id}/delete`;
    const response = await deleteRequest(apiUrl);
    if (response.success) {
      console.log(response);
      res.redirect('/elderly/resident/');
    }
  } catch (err) {
    handleError(err, req, res);
  }
};
module.exports = {
  getAllElderlyResidents,
  renderNewElderlyResidentForm,
  createElderlyResident,
  getElderlyResidentById,
  updateElderlyResident,
  deleteElderlyResident,

};
