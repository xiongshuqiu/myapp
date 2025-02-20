// #frontend routes
const express = require('express');
const router = express.Router();

const {
  getAllPersonalizedDiets,
  renderNewPersonalizedDietForm,
  createPersonalizedDiet,
  getPersonalizedDietById,
  updatePersonalizedDiet,
  deletePersonalizedDiet,
} = require('../../controllers/cateringController/PersonalizedDietController');
// 1. 获取所有个性化饮食
router.get('/',getAllPersonalizedDiets);

// 2. 创建新的个性化饮食
// (1) 显示新增个性化饮食表单
router.get('/new', renderNewPersonalizedDietForm);
// (2) 提交新的个性化饮食
router.post('/create', createPersonalizedDiet);

// 3. 更新特定个性化饮食
// (1) 查找特定个性化饮食并显示编辑表单
router.get('/:_id/update', getPersonalizedDietById);
// (2) 提交更新后的个性化饮食
router.put('/:_id', updatePersonalizedDiet);

// 4. 删除特定个性化饮食
router.delete('/:_id/delete', deletePersonalizedDiet);

module.exports = router;
