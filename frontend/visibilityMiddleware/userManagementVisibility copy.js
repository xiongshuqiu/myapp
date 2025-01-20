function visibilityMiddleware(req, res, next) {
  const userRole = req.user.role; // 假设用户角色已存储在 req.user 中
  const navItems = getNavItems(userRole);
  req.navItems = navItems;
  next();
}

function getNavItems(role) {
  const navItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/dashboard',
      visible: true,
      roles: ['admin', 'user', 'family', 'medical'],
    },
    {
      id: 'user-management',
      name: 'User Management',
      href: '/users',
      visible: true,
      roles: ['admin'],
    },
    {
      id: 'elderly-management',
      name: 'Elderly Management',
      href: '#',
      visible: true,
      roles: ['admin', 'user', 'family', 'medical'],
    },
    {
      id: 'visitor-management',
      name: 'Visitor Management',
      href: '#',
      visible: true,
      roles: ['admin', 'user', 'family'],
    },
    {
      id: 'employee-management',
      name: 'Employee Management',
      href: '#',
      visible: true,
      roles: ['admin'],
    },
    {
      id: 'bed-management',
      name: 'Bed Management',
      href: '#',
      visible: true,
      roles: ['admin', 'user', 'medical'],
    },
    {
      id: 'catering-management',
      name: 'Catering Management',
      href: '#',
      visible: true,
      roles: ['admin', 'user'],
    },
    {
      id: 'health-management',
      name: 'Health Management',
      href: '#',
      visible: true,
      roles: ['admin', 'user', 'medical'],
    },
    {
      id: 'financial-management',
      name: 'Financial Management',
      href: '#',
      visible: true,
      roles: ['admin'],
    },
    {
      id: 'notifications',
      name: 'Notifications',
      href: '#',
      visible: true,
      roles: ['admin', 'user'],
    },
  ];

  // 过滤掉用户角色不包含的项目
  return navItems.filter((item) => item.roles.includes(role));
}

module.exports = { visibilityMiddleware, getNavItems };
