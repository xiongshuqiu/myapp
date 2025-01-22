function bntLinkVisibility(req, res, next) {
  const userRole = req.user.role; // 假设用户角色已存储在 req.user 中
  const buttonItems = getBtnItems(userRole);
  const linkItems = getLinkItems(userRole);
  req.buttonItems = buttonItems;
  req.linkItems = linkItems;
  next();
  function getBtnItems(role) {
    const buttonItems = [
      {
        id: 'add-user-btn',
        name: 'AddUser',
        href: '/users/new',
        roles: ['admin'],
      },
      {
        id: 'add-elderly-btn',
        name: 'AddElderly',
        href: '/elderlys/new',
        roles: ['admin'],
      },
    ];
    return buttonItems.map((item) => ({
      ...item,
      visible: item.roles.includes(role), // 根据角色设置可见性
    }));
  }
  function getLinkItems(role) {
    const linkItems = 
    [
      {
        id: 'edit-user-link',
        roles: ['admin'],
      },
      {
        id: 'delete-user-link',
        roles: ['admin'],
      },

    ];
    return linkItems.map((item) => ({
      ...item,
      visible: item.roles.includes(role), // 根据角色设置可见性
    }));
  }
}

  module.exports = { bntLinkVisibility}
