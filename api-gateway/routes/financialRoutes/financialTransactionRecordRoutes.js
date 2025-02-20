// #frontend routes
const express = require('express');
const router = express.Router();

const {
  getAllTransactionRecords,
  renderNewTransactionRecordForm,
  createTransactionRecord,
  getTransactionRecordById,
  updateTransactionRecord,
  deleteTransactionRecord
} = require('../../controllers/financialController/TransactionRecordController');

// 1. 获取所有老人缴费退费记录
router.get('/',getAllTransactionRecords);

// 2. 创建新的老人缴费退费记录
// (1) 显示新增老人缴费退费记录表单
router.get('/new', renderNewTransactionRecordForm);
// (2) 提交新的老人缴费退费记录数据
router.post('/create', createTransactionRecord);

// 3. 更新特定老人缴费退费记录
// (1) 查找特定老人缴费退费记录并显示编辑表单
router.get('/:_id/update', getTransactionRecordById);
// (2) 提交更新后的老人缴费退费记录数据
router.put('/:_id', updateTransactionRecord);

// 4. 删除特定老人缴费退费记录
router.delete('/:_id/delete', deleteTransactionRecord);

module.exports = router;
