function bntLinkVisibility(req, res, next) {
  const userRole = req.user.role; // 假设用户角色已存储在 req.user 中
  const buttonItems = getBtnItems(userRole);
  const linkItems = getLinkItems(userRole);
  req.buttonItems = buttonItems;
  req.linkItems = linkItems;
  next();
  function getBtnItems(role) {
    const buttonItems = [
      //用户增加
      {
        id: 'add-user-btn',
        name: 'AddUser',
        href: '/users/new',
        roles: ['admin'],
      },
      //床位状态增加
      {
        id: 'add-bedStatus-btn',
        name: 'AddBedStatus',
        href: '/beds/status/new',
        roles: ['admin'],
      },
      //床位分配增加
      {
        id: 'add-bedAssignment-btn',
        name: 'AddBedAssignment',
        href: '/beds/assignment/new',
        roles: ['admin'],
      },
      //员工档案增加
      {
        id: 'add-employeeRecord-btn',
        name: 'AddEmployeeRecord',
        href: '/employees/record/new',
        roles: ['admin'],
      },
      //员工值班安排增加
      {
        id: 'add-employeeShiftSchedule-btn',
        name: 'AddShiftSchedule',
        href: '/employees/shiftSchedule/new',
        roles: ['admin', 'medical'],
      },
      //老人档案增加
      {
        id: 'add-elderlyRecord-btn',
        name: 'AddElderlyRecord',
        href: '/elderly/record/new',
        roles: ['admin'],
      },
      //老人入住退住增加
      {
        id: 'add-elderlyResident-btn',
        name: 'AddElderlyResident',
        href: '/elderly/resident/new',
        roles: ['admin'],
      },
      //老人请假增加
      {
        id: 'add-elderlyLeave-btn',
        name: 'Leave Request',
        href: '/elderly/leave/new',
        roles: ['family'],
      },
      //老人健康档案增加
      {
        id: 'add-healthRecord-btn',
        name: 'AddHealthRecord',
        href: '/health/record/new',
        roles: ['admin'],
      },
      //老人护理任务增加
      {
        id: 'add-careTask-btn',
        name: 'AddCareTask',
        href: '/health/care/task/new',
        roles: ['medical'],
      },
      //老人健康体检增加
      {
        id: 'add-healthCheckup-btn',
        name: 'AddHealthCheckup',
        href: '/health/checkup/new',
        roles: ['admin'],
      },
    ];
    return buttonItems.map((item) => ({
      ...item,
      visible: item.roles.includes(role), // 根据角色设置可见性
    }));
  }
  function getLinkItems(role) {
    const linkItems = [
      //编辑和删除用户
      {
        id: 'edit-user-link',
        roles: ['admin'],
      },
      {
        id: 'delete-user-link',
        roles: ['admin'],
      },
      //编辑和删除床位状态
      {
        id: 'edit-bedStatus-link',
        roles: ['admin'],
      },
      {
        id: 'delete-bedStatus-link',
        roles: ['admin'],
      },
      //编辑和删除床位分配
      {
        id: 'edit-bedAssignment-link',
        roles: ['admin'],
      },
      {
        id: 'delete-bedAssignment-link',
        roles: ['admin'],
      },
      //编辑和删除员工档案
      {
        id: 'edit-employeeRecord-link',
        roles: ['admin'],
      },
      {
        id: 'delete-employeeRecord-link',
        roles: ['admin'],
      },
      //编辑和删除员工值班记录
      {
        id: 'edit-employeeShiftSchedule-link',
        roles: ['admin'],
      },
      {
        id: 'delete-employeeShiftSchedule-link',
        roles: ['admin'],
      },
      //编辑和删除老人档案
      {
        id: 'edit-elderlyRecord-link',
        roles: ['admin'],
      },
      {
        id: 'delete-elderlyRecord-link',
        roles: ['admin'],
      },
      //编辑和删除老人入住退住
      {
        id: 'edit-elderlyResident-link',
        roles: ['admin'],
      },
      {
        id: 'delete-elderlyResident-link',
        roles: ['admin'],
      },
      //编辑和删除老人请假
      {
        id: 'edit-elderlyLeave-link',
        roles: ['admin'],
      },
      {
        id: 'delete-elderlyLeave-link',
        roles: ['admin'],
      },
      //编辑和删除健康档案
      {
        id: 'edit-healthRecord-link',
        roles: ['admin'],
      },
      {
        id: 'delete-healthRecord-link',
        roles: ['admin'],
      },
      //编辑和删除护理任务
      {
        id: 'edit-careTask-link',
        roles: ['medical'],
      },
      {
        id: 'delete-careTask-link',
        roles: ['medical'],
      },

      //编辑和删除健康体检
      {
        id: 'edit-healthCheckup-link',
        roles: ['admin'],
      },
      {
        id: 'delete-healthCheckup-link',
        roles: ['admin'],
      },
    ];
    return linkItems.map((item) => ({
      ...item,
      visible: item.roles.includes(role), // 根据角色设置可见性
    }));
  }
}

module.exports = { bntLinkVisibility };
