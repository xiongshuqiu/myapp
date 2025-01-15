// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// 1.查找所有用户信息
router.get('/', userController.getUsers);

// 2.新增用户
router.post('/create', userController.createUser);

// 3.更新用户信息
router.get('/:_id', userController.getUserById);//查找特定用户信息(User Managementy页面有信息)
router.post('/update/:_id', userController.updateUser);

// 4.删除用户信息
router.post('/delete/:_id', userController.deleteUser);

module.exports = router;


   