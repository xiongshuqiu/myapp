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
    ];
    return linkItems.map((item) => ({
      ...item,
      visible: item.roles.includes(role), // 根据角色设置可见性
    }));
  }
}

module.exports = { bntLinkVisibility };
