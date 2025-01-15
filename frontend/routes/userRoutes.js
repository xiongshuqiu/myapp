const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { authorizeRole} = require('../../middleware/authMiddleware');

// 查找所有用户信息
router.get('/',userController.getUsers);

// 新增用户
router.get('/create', userController.renderCreateUserForm); // 跳转到新增用户界面
router.post('/create', userController.createUser);

// 更新用户信息
router.get('/:_id', userController.getUserById); // 查找特定用户信息并跳转到更新页面
router.get('/update/:_id', userController.renderUpdateUserPage); // 渲染更新用户页面
router.post('/update/:_id', userController.updateUser); // 提交更新的用户信息

// 删除用户信息
router.post('/delete/:_id', userController.deleteUser);

module.exports = router;



