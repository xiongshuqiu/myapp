// #frontend routes
const express = require('express');
const router = express.Router();
const { authorizeRole} = require('../../middleware/authMiddleware');
const {
  getUsers,
  renderCreateUserForm,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// 1.查找所有用户信息
router.get('/', getUsers);

// 2.新增用户/*  */
router.get('/create', renderCreateUserForm);
router.post('/create', createUser);

// 3.编辑用户信息
router.get('/:_id/update', getUserById); //查找特定用户信息并跳转到新增用户界面
router.post('/:_id/update', updateUser);//查找更新的用户信息

// 4.删除用户信息
router.post('/:_id/delete', deleteUser);

module.exports = router;


// #api-gateway routes
