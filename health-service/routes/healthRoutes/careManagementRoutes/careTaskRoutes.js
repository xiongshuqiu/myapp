// #frontend routes
const express = require('express');
const router = express.Router();
const {
  getAllCareTasks,
  renderNewCareTaskForm,
  createCareTask,
  getCareTaskById,
  updateCareTask,
  deleteCareTask,
} = require('../../../controllers/healthController/careManagementController/careTaskController');
// 1. 获取所有护理任务
router.get('/',getAllCareTasks);

// 2. 创建新的护理任务
// (1) 显示新增护理任务表单(查找可用的bedId、elderlyId)
router.get('/new', renderNewCareTaskForm);
// (2) 提交新的护理任务数据
router.post('/create', createCareTask);

// 3. 更新特定护理任务
// (1) 查找特定护理任务并显示编辑表单
router.get('/:_id/update', getCareTaskById);
// (2) 提交更新后的护理任务数据
router.put('/:_id', updateCareTask);

// 4. 删除特定护理任务
router.delete('/:_id/delete', deleteCareTask);

module.exports = router;
