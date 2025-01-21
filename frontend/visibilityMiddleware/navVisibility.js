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
      icon: 'fa-dashboard',
      subMenu: []
    },
    {
      id: 'user-management',
      name: 'User Management',
      href: '/users',
      roles: ['admin'],
      icon: 'fa-user fa-fw',
      subMenu: []
    },
    {
      id: 'elderly-management',
      name: 'Elderly Management',
      href: '/elderly-management',
      roles: ['admin', 'family', 'medical'],
      icon: 'fa-blind fa-fw',
      subMenu: [
        {
          name: 'Elderly Records',
          href: '#',
          roles: ['admin', 'family', 'medical']
        },
        {
          name: 'Admission & Discharge',
          href: '#',
          roles: ['admin','family',]
        },
        {
          name: 'Leave Management',
          href: '#',
          roles: ['admin','family']
        }
      ]
    },
    {
      id: 'visitor-management',
      name: 'Visitor Management',
      href: '/visitor-management',
      roles: ['admin','family'],
      icon: 'fa-user-friends fa-fw',
      subMenu: [
        {
          name: 'Appointment Registration',
          href: '#',
          roles: ['admin', 'family']
        },
        {
          name: 'Visitor Registration',
          href: '#',
          roles: ['admin', 'family']
        }
      ]
    },
    {
      id: 'employee-management',
      name: 'Employee Management',
      href: '/employee-management',
      roles: ['admin','medical'],
      icon: 'fa-users-cog fa-fw',
      subMenu: [
        {
          name: 'Employee Records',
          href: '#',
          roles: ['admin']
        },
        {
          name: 'Shift Scheduling',
          href: '#',
          roles: ['admin','medical']
        }
      ]
    },
    {
      id: 'bed-management',
      name: 'Bed Management',
      href: '/bed-management',
      roles: ['admin','medical'],
      icon: 'fa-bed fa-fw',
      subMenu: [
        {
          name: 'Bed Status',
          href: '#',
          roles: ['admin','medical']
        },
        {
          name: 'Bed Assignment',
          href: '#',
          roles: ['admin','medical']
        }
      ]
    },
    {
      id: 'catering-management',
      name: 'Catering Management',
      href: '/catering-management',
      roles: ['admin', 'user'],
      icon: 'fa-utensils fa-fw',
      subMenu: [
        {
          name: 'Meal Scheduling',
          href: '#',
          roles: ['admin', 'family']
        },
        {
          name: 'Meal Planning',
          href: '#',
          roles: ['admin', 'family']
        },
        {
          name: 'Personalized Diets',
          href: '#',
          roles: ['admin','family']
        }
      ]
    },
    {
      id: 'health-management',
      name: 'Health Management',
      href: '/health-management',
      roles: ['admin', 'family', 'medical'],
      icon: 'fa-user-md fa-fw',
      subMenu: [
        {
          name: 'Health Records',
          href: '#',
          roles: ['admin', 'family', 'medical']
        },
        {
          name: 'Care Management',
          href: '#',
          roles: ['admin', 'family', 'medical']
        },
        {
          name: 'Medical Checkup',
          href: '#',
          roles: ['admin', 'family', 'medical']
        }
      ]
    },
    {
      id: 'financial-management',
      name: 'Financial Management',
      href: '/financial-management',
      roles: ['admin', 'family', 'medical'],
      icon: 'fa-dollar-sign',
      subMenu: [
        {
          name: 'Payment Records',
          href: '#',
          roles: ['admin','medical']
        },
        {
          name: 'Refund Records',
          href: '#',
          roles: ['admin','family']
        },
        {
          name: 'Salary Inquiry',
          href: '#',
          roles: ['admin','medical']
        }
      ]
    },
    {
      id: 'notifications',
      name: 'Notifications',
      href: '/notifications',
      roles: ['admin', 'family', 'medical'],
      icon: 'fa-bullhorn',
      subMenu: []
    }
  ];

  return navItems.map((item) => ({
    ...item,
    visible: item.roles.includes(role), // 根据角色设置可见性
    subMenu: item.subMenu.map((subItem) => ({
      ...subItem,
      visible: subItem.roles.includes(role) // 根据角色设置二级菜单项的可见性
    }))
  }));
}

module.exports = {navVisibility};
