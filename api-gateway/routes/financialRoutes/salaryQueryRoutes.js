// #frontend routes
const express = require('express');
const router = express.Router();

const {
  getAllSalaryQueries,
  renderNewSalaryQueryForm,
  createSalaryQuery,
  getSalaryQueryById,
  updateSalaryQuery,
  deleteSalaryQuery
} = require('../../controllers/financialController/SalaryQueryController');

// 1. 获取所有员工工资查询
router.get('/',getAllSalaryQueries);

// 2. 创建新的员工工资查询
// (1) 显示新增员工工资查询表单
router.get('/new', renderNewSalaryQueryForm);
// (2) 提交新的员工工资查询数据
router.post('/create', createSalaryQuery);

// 3. 更新特定员工工资查询
// (1) 查找特定员工工资查询并显示编辑表单
router.get('/:_id/update', getSalaryQueryById);
// (2) 提交更新后的员工工资查询数据
router.put('/:_id', updateSalaryQuery);

// 4. 删除特定员工工资查询
router.delete('/:_id/delete', deleteSalaryQuery);

module.exports = router;
