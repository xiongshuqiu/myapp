const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 通用错误处理函数
const handleError = (
  err,
  req, //注意一定要增加这个值（每个handleError都要）
  res,
  targetPage = 'bed/bedAssignment/bedAssignmentCreate',
  msg = 'Server error',
) => {
  console.error('Error:', err.response ? err.response.data : err.message); // 输出详细调试信息
  if (!res.headersSent) {
    res.status(err.response?.status || 500).render(targetPage, {
      activePage: 'bed-management',
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

// 1.获取所有床位分配
const getAllElderlyRecords = async (req, res) => {
  const _id = req.user._id;
  const role = req.user.role;
  console.log('User data:', { _id, role }); // 调试信息
  const apiUrl = `${process.env.API_URL}/api/beds/assignment/?_id=${_id}&role=${role}`;
  console.log('API URL:', apiUrl); // 调试信息

  try {
    const response = await getRequest(apiUrl);
    const bedAssignments = response.data;
    if (response.success) {
      // const buttonItems = req.buttonItems;
      // const linkItems = req.linkItems
      console.log(response);
      res.render('bed/bedAssignment/bedAssignmentManagement', {
        activePage: 'bed-management',
        bedAssignments,
        navItems: req.navItems, // 将导航项传递到视图
        buttonItems: req.buttonItems,
        linkItems: req.linkItems,
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};
// 2.创建新的床位分配
//(1)显示新增床位分配表单
const renderNewElderlyRecordForm = async (req, res) => {
  const apiUrl = `${process.env.API_URL}/api/beds/assignment/new`;
  console.log('API URL:', apiUrl); // 调试信息
  try {
    const response = await getRequest(apiUrl);

    if (response.success) {
      const { availableBedIds, unassignedElderlyIds } = response.data;
      res.render('bed/bedAssignment/bedAssignmentCreate.ejs', {
        activePage: 'bed-management',
        navItems: req.navItems, // 将导航项传递到视图
        availableBedIds, // 传递可用的 bedId 到视图
        unassignedElderlyIds, // 传递存在的 elderlyId 到视图
      });
    } else {
      throw new Error('Failed to retrieve data from API');
    }
  } catch (err) {
    console.error('Error in renderNewBedAssignmentForm:', err);
    handleError(err, req, res);
  }
};

//(2)提交新的床位分配数据
const createElderlyRecord = async (req, res) => {
  const {
    availableBedId,
    unassignedElderlyId,
    assignmentId,
    assignedDate,
    releaseDate,
  } = req.body;
  try {
    const data = {
      availableBedId,
      unassignedElderlyId,
      assignmentId,
      assignedDate,
      releaseDate,
    };

    const apiUrl = `${process.env.API_URL}/api/beds/assignment/create`;
    const response = await postRequest(apiUrl, data);
    const bedAssignment = response.data;
    console.log(bedAssignment);
    if (response.success) {
      console.log(response);
      res.redirect('/beds/assignment/');
    }
  } catch (err) {
    const targetPage = 'bed/bedAssignment/bedAssignmentCreate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};

// 3.更新特定床位分配
// (1)查找特定床位分配并显示编辑表单
const getElderlyRecordById = async (req, res) => {
  const { _id } = req.params; // 从参数中获取 _id
  console.log(`Fetching bedAssignment with ID: ${_id}`); // 调试信息
  try {
    const apiUrl = `${process.env.API_URL}/api/beds/assignment/${_id}/update`;
    console.log(apiUrl);
    const response = await getRequest(apiUrl); // 使用组装的URL进行API调用
    const {bedAssignment, bedIds, elderlyIds} = response.data;
    if (response.success) {
      console.log(response);
      res.render('bed/bedAssignment/bedAssignmentUpdate.ejs', {
        activePage: 'bed-management',     
        navItems: req.navItems,
        bedAssignment,
        bedIds, //beIds包括：bedId、status
        elderlyIds //包括elderlyId、elderlyName
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};

//(2) 提交更新后的床位分配数据
const updateElderlyRecord = async (req, res) => {
  const { bedId, elderlyId, assignmentId, assignedDate,releaseDate } = req.body;
  const { _id } = req.params;
  try {
    const data = { bedId, elderlyId, assignmentId, assignedDate,releaseDate  };

    // 从请求参数中获取 _id
    const apiUrl = `${process.env.API_URL}/api/beds/assignment/${_id}`;
    const response = await putRequest(apiUrl, data);
    // const bedAssignment = response.data;
    if (response.success) {
      console.log(response);
      res.redirect('/beds/assignment/');
    }
  } catch (err) {
    const targetPage = 'bed/bedAssignment/bedAssignmentUpdate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};

// 4. 删除特定床位分配
const deleteElderlyRecord = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取_id
    console.log(_id);
    const apiUrl = `${process.env.API_URL}/api/beds/assignment/${_id}/delete`;
    const response = await deleteRequest(apiUrl);
    if (response.success) {
      console.log(response);
      res.redirect('/beds/assignment/');
    }
  } catch (err) {
    handleError(err, req, res);
  }
};
module.exports = {
  getAllElderlyRecords,
  renderNewElderlyRecordForm,
  createElderlyRecord,
  getElderlyRecordById,
  updateElderlyRecord,
  deleteElderlyRecord
};
