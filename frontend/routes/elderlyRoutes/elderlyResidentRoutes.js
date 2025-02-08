// #frontend routes
const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../../../middleware/authMiddleware');
const {
  bntLinkVisibility,
} = require('../../visibilityMiddleware/bntLinkVisibility');
const {
  getAllElderlyResidents,
  renderNewElderlyResidentForm,
  createElderlyResident,
  getElderlyResidentById,
  updateElderlyResident,
  deleteElderlyResident,
} = require('../../controllers/elderlyController/elderlyResidentController');
// 1. 获取所有老人入住退住数据
router.get('/',bntLinkVisibility,getAllElderlyResidents);

// 2. 创建新的老人入住退住数据
// (1) 显示新增老人入住退住表单
router.get('/new', renderNewElderlyResidentForm);
// (2) 提交新的老人入住退住数据
router.post('/create', createElderlyResident);

// 3. 更新特定老人入住退住数据
// (1) 查找特定老人入住退住并显示编辑表单
router.get('/:_id/update', getElderlyResidentById);
// (2) 提交更新后的老人入住退住数据
router.put('/:_id', updateElderlyResident);

// 4. 删除特定老人入住退住数据
router.delete('/:_id/delete', deleteElderlyResident);

module.exports = router;
