const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 通用错误处理函数
const handleError = (
  err,
  req, //注意一定要增加这个值（每个handleError都要）
  res,
  targetPage = 'health/careManagement/careTaskCreate',
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

// 1.获取所有护理任务
const getAllCareTasks = async (req, res) => {
  const _id = req.user._id;
  const role = req.user.role;
  console.log('User data:', { _id, role }); // 调试信息
  const apiUrl = `${process.env.API_URL}/api/health/care/task/?_id=${_id}&role=${role}`;
  console.log('API URL:', apiUrl); // 调试信息

  try {
    const response = await getRequest(apiUrl);
    const careTasks = response.data;
    if (response.success) {
      res.render('health/careManagement/careTaskManagement', {
        activePage: 'health-management',
        careTasks,
        navItems: req.navItems, // 将导航项传递到视图
        buttonItems: req.buttonItems,
        linkItems: req.linkItems,
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};
// 2.创建新的护理任务
//(1)显示新增护理任务表单
const renderNewCareTaskForm = async (req, res) => {
  const apiUrl = `${process.env.API_URL}/api/health/care/task/new`;
  console.log('API URL:', apiUrl); // 调试信息
  try {
    const response = await getRequest(apiUrl);

    if (response.success) {
      const { elderlyIds, employeeIds, carePlanIds } = response.data;
      res.render('health/careManagement/careTaskCreate.ejs', {
        activePage: 'health-management',
        navItems: req.navItems, // 将导航项传递到视图
        elderlyIds,
        employeeIds,
        carePlanIds,
      });
    } else {
      throw new Error('Failed to retrieve data from API');
    }
  } catch (err) {
    console.error('Error in renderNewElderlyRecordForm:', err);
    handleError(err, req, res);
  }
};

//(2)提交新的护理任务数据
const createCareTask = async (req, res) => {
  const {
    description,
    taskName,
    dueDate,
    carePlanId,
    status,
    elderlyId,
    employeeId,
    createdAt,
  } = req.body;
  try {
    const data = {
      description,
      taskName,
      dueDate,
      carePlanId,
      status,
      elderlyId,
      employeeId,
      createdAt,
    };
    console.log(data);
    const apiUrl = `${process.env.API_URL}/api/health/care/task/create`;
    const response = await postRequest(apiUrl, data);
    // const newCareTask = response.data;
    // console.log(newCareTask);
    if (response.success) {
      console.log(response);
      res.redirect('/health/care/task/');
    }
  } catch (err) {
    const targetPage = 'health/careManagement/careTaskCreate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};

// 3.更新特定护理任务
// (1)查找特定护理任务并显示编辑表单
const getCareTaskById = async (req, res) => {
  const { _id } = req.params; // 从参数中获取 _id
  console.log(`Fetching careTask with ID: ${_id}`); // 调试信息
  try {
    const apiUrl = `${process.env.API_URL}/api/health/care/task/${_id}/update`;
    console.log(apiUrl);
    const response = await getRequest(apiUrl); // 使用组装的URL进行API调用
    const { careTasks, employeeIds, carePlanIds } = response.data;
    if (response.success) {
      console.log(response);
      res.render('health/careManagement/careTaskUpdate.ejs', {
        activePage: 'health-management',
        navItems: req.navItems,
        careTasks,
        employeeIds,
        carePlanIds,
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};

//(2) 提交更新后的护理任务数据
const updateCareTask = async (req, res) => {
  const {
    description,
    taskName,
    dueDate,
    carePlanId,
    status,
    elderlyId,
    employeeId,
    createdAt,
  } = req.body;
  const { _id } = req.params;
  try {
    const data = {
      description,
      taskName,
      dueDate,
      carePlanId,
      status,
      elderlyId,
      employeeId,
      createdAt,
    };

    // 从请求参数中获取 _id
    const apiUrl = `${process.env.API_URL}/api/health/care/task/${_id}`;
    const response = await putRequest(apiUrl, data);
    //const elderlyRecord  = response.data;
    if (response.success) {
      console.log(response);
      res.redirect('/health/care/task/');
    }
  } catch (err) {
    const targetPage = 'health/careManagement/careTaskUpdate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};

// 4. 删除特定护理任务
const deleteCareTask = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取_id
    console.log(_id);
    const apiUrl = `${process.env.API_URL}/api/health/care/task/${_id}/delete`;
    const response = await deleteRequest(apiUrl);
    if (response.success) {
      console.log(response);
      res.redirect('/health/care/task/');
    }
  } catch (err) {
    handleError(err, req, res);
  }
};
module.exports = {
  getAllCareTasks,
  renderNewCareTaskForm,
  createCareTask,
  getCareTaskById,
  updateCareTask,
  deleteCareTask,
};
