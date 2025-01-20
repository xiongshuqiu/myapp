// #frontend routes
const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// 1.查找所有用户信息
router.get('/', getUsers);

// 2.新增用户
router.post('/create', createUser);

// 3.更新用户信息
router.get('/:_id/update', getUserById); //查找特定用户信息
router.put('/:_id', updateUser);//提交更新后用户信息

// 4.删除用户信息
router.delete('/:_id/delete', deleteUser);

module.exports = router;


// #api-gateway routes
