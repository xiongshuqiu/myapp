 // 导入app.js中的Express应用实例
 const app = require('./app');
 // 从环境变量中读取端口号
 const PORT = process.env.PORT;
// 启动Express服务器并监听指定端口
app.listen(PORT, () => {
    console.log(`bed-service running on  port ${PORT}`);
  });
   