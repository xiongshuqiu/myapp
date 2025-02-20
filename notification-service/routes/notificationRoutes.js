 // #frontend routes
const express = require('express');
const router = express.Router();
const {
  getNotifications,
  renderCreateNotificationForm,
  createNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
} = require('../controllers/notificationController');

// 1.查找所有通知
router.get('/',bntLinkVisibility, getNotifications);

// 2.新增通知
router.get('/new', renderCreateNotificationForm,); // 显示新增通知表单
router.post('/create', createNotification);       // 提交新增通知

// 3.更新通知
router.get('/:_id/update', getNotificationById);  // 查找特定通知并跳转到更新通知表单
router.put('/:_id', updateNotification);  // 提交更新的通知

// 4.删除通知
router.delete('/:_id/delete', deleteNotification);  // 删除通知

module.exports = router;




// #api-gateway routes

     