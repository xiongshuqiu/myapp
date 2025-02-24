// #frontend routes
const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../../../middleware/authMiddleware');
const {
  bntLinkVisibility,
} = require('../../middleware/bntLinkVisibility');
const {
  getAllElderlyRecords,
  renderNewElderlyRecordForm,
  createElderlyRecord,
  getElderlyRecordById,
  updateElderlyRecord,
  deleteElderlyRecord
} = require('../../controllers/elderlyController/elderlyRecordController');
// 1. 获取所有老人档案
router.get('/', bntLinkVisibility, getAllElderlyRecords);

// 2. 创建新的老人档案
// (1) 显示新增老人档案表单(查找可用的bedId、elderlyId)
router.get('/new', renderNewElderlyRecordForm);
// (2) 提交新的老人档案数据
router.post('/create', createElderlyRecord);

// 3. 更新特定老人档案
// (1) 查找特定老人档案并显示编辑表单
router.get('/:_id/update', getElderlyRecordById);
// (2) 提交更新后的老人档案数据
router.put('/:_id', updateElderlyRecord);

// 4. 删除特定老人档案
router.delete('/:_id/delete', deleteElderlyRecord);

module.exports = router;
