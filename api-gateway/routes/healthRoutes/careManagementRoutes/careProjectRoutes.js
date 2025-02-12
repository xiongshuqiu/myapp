// #frontend routes
const express = require('express');
const router = express.Router();
const {
  getAllCareProjects,
  renderNewCareProjectForm,
  createCareProject,
  getCareProjectById,
  updateCareProject,
  deleteCareProject
} = require('../../../controllers/healthController/careManagementController/careProjecController');
// 1. 获取所有护理项目
router.get('/', bntLinkVisibility, getAllCareProjects);

// 2. 创建新的护理项目
// (1) 显示新增护理项目表单(查找可用的bedId、elderlyId)
router.get('/new', renderNewCareProjectForm);
// (2) 提交新的护理项目数据
router.post('/create', createCareProject);

// 3. 更新特定护理项目
// (1) 查找特定护理项目并显示编辑表单
router.get('/:_id/update', getCareProjectById);
// (2) 提交更新后的护理项目数据
router.put('/:_id', updateCareProject);

// 4. 删除特定护理项目
router.delete('/:_id/delete', deleteCareProject);

module.exports = router;
