function navVisibility(req, res, next) {
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
      roles: ['admin', 'family', 'medical'],
    },
    {
      id: 'user-management',
      name: 'User Management',
      href: '/users',
      roles: ['admin', 'family', 'medical'],
    },
    {
      id: 'elderly-management',
      name: 'Elderly Management',
      href: '/users/',
      roles: ['admin', 'user', 'family', 'medical'],
    },
    {
      id: 'visitor-management',
      name: 'Visitor Management',
      href: '/visitor-management',
      roles: ['admin', 'user', 'family'],
    },
    {
      id: 'employee-management',
      name: 'Employee Management',
      href: '/employee-management',
      roles: ['admin'],
    },
    {
      id: 'bed-management',
      name: 'Bed Management',
      href: '/bed-management',
      roles: ['admin', 'user', 'medical'],
    },
    {
      id: 'catering-management',
      name: 'Catering Management',
      href: '/catering-management',
      roles: ['admin', 'user'],
    },
    {
      id: 'health-management',
      name: 'Health Management',
      href: '/health-management',
      roles: ['admin', 'user', 'medical'],
    },
    {
      id: 'financial-management',
      name: 'Financial Management',
      href: '/financial-management',
      roles: ['admin'],
    },
    {
      id: 'notifications',
      name: 'Notifications',
      href: '/notifications',
      roles: ['admin', 'user'],
    },
  ];

  return navItems.map((item) => ({
    ...item,
    visible: item.roles.includes(role), // 根据角色设置可见性
  }));
}

module.exports = {navVisibility};
