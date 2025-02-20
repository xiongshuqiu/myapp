// #frontend routes
const express = require('express');
const router = express.Router();
const financialTransactionRecordRoutes = require('./financialTransactionRecordRoutes.js');
const salaryQueryRoutes = require('./salaryQueryRoutes.js');

router.use('/transaction-records', financialTransactionRecordRoutes); // /financial/交易记录
router.use('/salary-queries', salaryQueryRoutes); // /financial/工资查询
module.exports = router;
