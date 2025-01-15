// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// 1.查找所有用户信息
router.get('/', accountController.getUsers);

// 2.新增用户
router.post('/create', accountController.createUser);

// 3.更新用户信息
router.get('/:_id', accountController.getUserById); //查找特定用户信息(User Managementy页面有信息)
router.post('/update/:_id', accountController.updateUser);

// 4.删除用户信息
router.post('/delete/:_id', accountController.deleteUser);

module.exports = router;

   