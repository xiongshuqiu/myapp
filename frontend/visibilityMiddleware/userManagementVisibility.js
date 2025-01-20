// middlewares/visibilityMiddleware.js
// function userManagementVisibility(req, res, next) {
//     const userRole = req.user.role; // 假设用户角色已存储在 req.user 中
//     const navItems = getNavItems(userRole);
//     const buttons = getButtons(userRole);
//     const links = getLinks(userRole);
//     req.navItems = navItems;
//     req.buttons = buttons;
//     req.links = links;
//     next();
// }

function getNavItems(role) {
    const navItems = [
        { id: 'dashboard', visible: true },
        { id: 'user-management', visible: true },
    ];

    switch (role) {
        case 'family':
            navItems[0].visible = true; // 显示dashboard
            navItems[1].visible = false; // 隐藏 User Management
            break;
        case 'medical':
            navItems[0].visible = true; // 显示dashboard
            navItems[1].visible = false; // 隐藏 User Management
            break;
        case 'admin':
            navItems[0].visible = true; // 显示dashboard
            navItems[1].visible = true; // 显示 User Management
            break;
        default:
            // 默认行为（如果有）
            break;
    }

    return navItems;
}

// function getButtons(role) {
//     const buttons = [
//         { id: 'admin-button', visible: true },
//         { id: 'nurse-button', visible: true },
//         { id: 'employee-button', visible: true }
//     ];

//     if (role === '员工') {
//         buttons[0].visible = false; // 隐藏管理员按钮
//     } else if (role === '管理员') {
//         buttons[1].visible = false; // 隐藏护士按钮
//     }

//     return buttons;
// }

// function getLinks(role) {
//     const links = [
//         { id: 'link1', visible: true },
//         { id: 'link2', visible: true },
//         { id: 'link3', visible: true }
//     ];

//     if (role === '员工') {
//         links[1].visible = false; // 隐藏某个链接
//     } else if (role === '管理员') {
//         links[2].visible = false; // 隐藏另一个链接
//     }

//     return links;
// }

module.exports = { getNavItems};
