// #frontend routes
const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../../middleware/authMiddleware');
const {bntLinkVisibility} =require('../visibilityMiddleware/bntLinkVisibility')//按钮、链接可见性判断
const {
  getUsers,
  renderCreateUserForm,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// 1.查找所有用户信息
router.get('/',bntLinkVisibility, getUsers);

// 2.新增用户
router.get('/new', renderCreateUserForm,); // 显示新增用户表单
router.post('/create', createUser);       // 提交新增用户信息

// 3.更新用户信息
router.get('/:_id/update', getUserById);  // 查找特定用户信息并跳转到更新用户信息表单
router.put('/:_id', updateUser);  // 提交更新的用户信息

// 4.删除用户信息
router.delete('/:_id/delete', deleteUser);  // 删除用户信息

module.exports = router;


module.exports = router;


// #api-gateway routes
