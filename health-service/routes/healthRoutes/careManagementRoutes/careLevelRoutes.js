// #frontend routes
const express = require('express');
const router = express.Router();
const {
  getAllCareLevels,
  renderNewCareLevelForm,
  createCareLevel,
  getCareLevelById,
  updateCareLevel,
  deleteCareLevel
} = require('../../../controllers/healthController/careManagementController/careLevelController');
// 1. 获取所有护理等级
router.get('/', getAllCareLevels);
// 2. 创建新的护理等级
// (1) 显示新增护理等级表单(查找可用的bedId、elderlyId)
router.get('/new', renderNewCareLevelForm);
// (2) 提交新的护理等级数据
router.post('/create', createCareLevel);

// 3. 更新特定护理等级
// (1) 查找特定护理等级并显示编辑表单
router.get('/:_id/update', getCareLevelById);
// (2) 提交更新后的护理等级数据
router.put('/:_id', updateCareLevel);

// 4. 删除特定护理等级
router.delete('/:_id/delete', deleteCareLevel);

module.exports = router;
