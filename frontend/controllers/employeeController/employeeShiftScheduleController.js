const axios = require('axios'); // 导入 axios 模块，用于发送 HTTP 请求

axios.defaults.withCredentials = true; // 配置 axios 允许跨域请求时携带 cookies

// 通用错误处理函数
const handleError = (
  err,
  req, //注意一定要增加这个值（每个handleError都要）
  res,
  targetPage = 'employee/employeeShiftSchedule/employeeShiftScheduleCreate.ejs',
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

// 1.获取所有值班安排
const getAllEmployeeShiftSchedules = async (req, res) => {
  const _id = req.user._id;
  const role = req.user.role;
  console.log('User data:', { _id, role }); // 调试信息
  const apiUrl = `${process.env.API_URL}/api/employees/shiftSchedule/`;
  console.log('API URL:', apiUrl); // 调试信息

  try {
    const response = await getRequest(apiUrl);
    const employeeShiftSchedules = response.data;
    if (response.success) {
      // const buttonItems = req.buttonItems;
      // const linkItems = req.linkItems
      console.log(response);
      res.render('employee/employeeShiftSchedule/employeeShiftScheduleManagement', {
        activePage: 'employee-management',
        employeeShiftSchedules,
        navItems: req.navItems, // 将导航项传递到视图
        buttonItems: req.buttonItems,
        linkItems: req.linkItems,
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};
// 2. 创建新的值班安排
//(1)获取新的排班初始值
const getShiftInitialValues = async (req, res) => {
  const apiUrl = `${process.env.API_URL}/api/employees/shiftSchedule/new`;
  console.log('API URL:', apiUrl); // 调试信息
  try {
    const response = await getRequest(apiUrl);
    const employees = response.data;
    console.log(employees);
    if (response.success) {
      res.render('employee/employeeShiftSchedule/employeeShiftScheduleCreate.ejs', {
        activePage: 'employee-management',
        navItems: req.navItems, // 将导航项传递到视图
        buttonItems: req.buttonItems,
        linkItems: req.linkItems,
        employees
      });
    } else {
      throw new Error('Failed to retrieve data from API');
    }
  } catch (err) {
    console.error('Error Shift initial values:', err);
    handleError(err, req, res);
  }
};
// (2) 生成新的排班表
const generateMonthlyShiftSchedule = async (req, res) => {
  const apiUrl = `${process.env.API_URL}/api/employees/shiftSchedule/create`;
  console.log('API URL:', apiUrl); // 调试信息
  const { startDate, days, startShiftType, startEmployeeId } = req.body;
  const data = { startDate, days, startShiftType, startEmployeeId };
  console.log(data)
  try {
   
    const response = await postRequest(apiUrl,data);

    if (response.success) {
      res.redirect('/employees/shiftSchedule/');
     
    } else {
      throw new Error('Failed to retrieve data from API');
    }
  } catch (err) {
    console.error('Error generating monthly shift schedule:', err);
    handleError(err, req, res);
  }
};



// 3.更新特定值班安排
// (1)查找特定值班安排并显示编辑表单
const getEmployeeShiftScheduleById = async (req, res) => {
  const { _id } = req.params; // 从参数中获取 _id
  console.log(`Fetching bedAssignment with ID: ${_id}`); // 调试信息
  try {
    const apiUrl = `${process.env.API_URL}/api/employees/shiftSchedule/${_id}/update`;
    console.log(apiUrl);
    const response = await getRequest(apiUrl); // 使用组装的URL进行API调用
    const {employeeIds, employeeShiftSchedule} = response.data;
    if (response.success) {
      console.log(response);
      res.render('employee/employeeShiftSchedule/employeeShiftScheduleUpdate.ejs', {
        activePage: 'employee-management',     
        navItems: req.navItems,
        employeeIds,//employeeIds包括：employeeId、employeeName
        employeeShiftSchedule, 
        
      });
    }
  } catch (err) {
    handleError(err, req, res);
  }
};

//(2) 提交更新后的值班安排数据
const updateEmployeeShiftSchedule = async (req, res) => {
  const { shiftScheduleId, employeeId, shiftType, startTime,endTime } = req.body;
  const { _id } = req.params;
  try {
    const data = { shiftScheduleId, employeeId, shiftType, startTime,endTime  };

    // 从请求参数中获取 _id
    const apiUrl = `${process.env.API_URL}/api/employees/shiftSchedule/${_id}`;
    const response = await putRequest(apiUrl, data);
    // const bedAssignment = response.data;
    if (response.success) {
      console.log(response);
      res.redirect('/employees/shiftSchedule/');
    }
  } catch (err) {
    const targetPage = 'employee/employeeShiftSchedule/bedAssignmentUpdate'; //用户需要输入新值
    handleError(err, req, res, targetPage);
  }
};

// 4. 删除特定值班安排
const deleteEmployeeShiftSchedule = async (req, res) => {
  try {
    const { _id } = req.params; // 从参数中获取_id
    console.log(_id);
    const apiUrl = `${process.env.API_URL}/api/employees/shiftSchedule/${_id}/delete`;
    const response = await deleteRequest(apiUrl);
    if (response.success) {
      console.log(response);
      res.redirect('/employees/shiftSchedule/');
    }
  } catch (err) {
    handleError(err, req, res);
  }
};
module.exports = {
  getAllEmployeeShiftSchedules,
  getShiftInitialValues,
  generateMonthlyShiftSchedule,
  getEmployeeShiftScheduleById,
  updateEmployeeShiftSchedule,
  deleteEmployeeShiftSchedule
};