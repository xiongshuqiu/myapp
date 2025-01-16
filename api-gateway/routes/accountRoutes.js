// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

//1.User Profile
// (1)查找账户信息
router.get('/:_id', accountController.getAccount);

// (2)修改密码提交
router.post('/:_id/password', accountController.updatePassword);

module.exports = router;
