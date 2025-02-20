const fs = require('fs');
const path = require('path');

const directories = [
  'myapp/auth-service/models',
  'myapp/auth-service/routes',
  'myapp/auth-service/controllers',

  'myapp/account-service/models',
  'myapp/account-service/routes',
  'myapp/account-service/controllers',

  'myapp/user-service/models',
  'myapp/user-service/routes',
  'myapp/user-service/controllers',

  'myapp/elderly-service/models',
  'myapp/elderly-service/routes',
  'myapp/elderly-service/controllers',

  'myapp/visitor-service/models',
  'myapp/visitor-service/routes',
  'myapp/visitor-service/controllers',

  'myapp/employee-service/models',
  'myapp/employee-service/routes',
  'myapp/employee-service/controllers',

  'myapp/bed-service/models',
  'myapp/bed-service/routes',
  'myapp/bed-service/controllers',

  'myapp/catering-service/models',
  'myapp/catering-service/routes',
  'myapp/catering-service/controllers',

  'myapp/health-service/models',
  'myapp/health-service/routes',
  'myapp/health-service/controllers',

  'myapp/financial-service/models',
  'myapp/financial-service/routes',
  'myapp/financial-service/controllers',

  'myapp/notification-service/models',
  'myapp/notification-service/routes',
  'myapp/notification-service/controllers',

  'myapp/api-gateway/routes',
   'myapp/api-gateway/controllers',
   'myapp/api-gateway/utils',
   'myapp/api-gateway/config',

  'myapp/frontend/views',
  'myapp/frontend/public',
   'myapp/frontend/routes',
   'myapp/frontend/controllers',
  
];

// 递归地创建目录
directories.forEach((dir) => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

const fileContents = {
  //1.设置myapp/account-service中的内容
  //1-1 .env 文件内容：配置MongoDB连接字符串
  'myapp/account-service/.env': `
   `,
  //1-2 myapp/account-service/server.js 文件内容
  'myapp/account-service/server.js': `
   `,
  //1-3 设置myapp/account-service/app.js 文件中的内容
  'myapp/account-service/app.js': `
   `,
  // 1-4 myapp/account-service/routes 文件夹中的内容
  'myapp/account-service/routes/accountRoutes.js': `
   `,
  //1-5 myapp/account-service/package.json 文件内容
  'myapp/account-service/package.json': `
   `,
  //1-6 myapp/account-service/controllers 文件夹中内容
  'myapp/account-service/controllers/accountController.js': `
   `,
  //1-7 myapp/account-service/models 文件夹中内容
  'myapp/account-service/models/accountModel.js': `
   `,
  
  //2.设置"myapp/api-gateway",中的内容
  //2-1.设置"myapp/api-gateway/routes",中的内容
  'myapp/api-gateway/routes/authRoutes.js': `
   `,
  'myapp/api-gateway/routes/userRoutes.js': `
   `,
  'myapp/api-gateway/routes/accountRoutes.js': `
   `,
  'myapp/api-gateway/routes/elderlyRoutes.js': `
   `,
  'myapp/api-gateway/routes/visitorRoutes.js': `
   `,
   'myapp/api-gateway/routes/employeeRoutes.js': `
   `,
  'myapp/api-gateway/routes/bedRoutes.js': `
   `,
  'myapp/api-gateway/routes/cateringRoutes.js': `
   `,
  'myapp/api-gateway/routes/healthRoutes.js': `
   `,
  'myapp/api-gateway/routes/financialRoutes.js': `
   `,
  'myapp/api-gateway/routes/notificationRoutes.js': `
   `,
  //2-2设置"myapp/api-gateway/controllers",中的内容

  'myapp/api-gateway/controllers/authController.js': `
   `,
  'myapp/api-gateway/controllers/accountController.js': `
   `,
  'myapp/api-gateway/controllers/userController.js': `
   `,
  'myapp/api-gateway/controllers/elderlyController.js': `
   `,
  'myapp/api-gateway/controllers/visitorController.js': `
   `,
  'myapp/api-gateway/controllers/employee Controller.js': `
   `,
  'myapp/api-gateway/controllers/bedController.js': `
  `,
  'myapp/api-gateway/controllers/cateringController.js': `
   `,
  'myapp/api-gateway/controllers/healthController.js': `
   `,
  'myapp/api-gateway/controllers/financialController.js': `
   `,
  'myapp/api-gateway/controllers/notificationController.js': `
   `,

  //2-3.设置"myapp/api-gateway/utils",中的内容
  'myapp/api-gateway/utils/authMiddleware.js': `
   `,
  'myapp/api-gateway/utils/errorHandler.js': `
   `,
  'myapp/api-gateway/utils/apiHelper.js': `
   `,
  //2-4.设置"myapp/api-gateway/config",中的内容
  'myapp/api-gateway/config/default.json': `
   `,
  'myapp/api-gateway/config/production.json': `
   `,
  //2-5.设置"myapp/api-gateway/package.json",中的内容
  'myapp/api-gateway/package.json': `
   `,
  //2-6设置"myapp/api-gateway/.env",中的内容
  'myapp/api-gateway/.env': `
  `,
  //2-7设置"myapp/api-gateway/index.js",中的内容
  'myapp/api-gateway/index.js': `
   `,
  
  
  //3.设置myapp/auth-service中的内容
  //3-1 .env 文件内容：配置MongoDB连接字符串
  'myapp/auth-service/.env': `
   `,
  //3-2 myapp/auth-service/server.js 文件内容
  'myapp/auth-service/server.js': `
   `,
  //3-3 设置myapp/auth-service/app.js 文件中的内容
  'myapp/auth-service/app.js': `
   `,
  //3-4 myapp/auth-service/routes 文件夹中的内容
  'myapp/auth-service/routes/authRoutes.js': `
   `,
  //3-5 myapp/auth-service/package.json 文件内容
  'myapp/auth-service/package.json': `
   `,
  //3-6 myapp/auth-service/controllers 文件夹中内容
  'myapp/auth-service/controllers/authController.js': `
   `,
  //3-7 myapp/auth-service/models 文件夹中内容
  'myapp/auth-service/models/authModel.js': `
   `,
  
  //5.设置myapp/bed-service中的内容
  //5-1 .env 文件内容：配置MongoDB连接字符串
  'myapp/bed-service/.env': `
   `,
  //5-2 myapp/bed-service/server.js 文件内容
  'myapp/bed-service/server.js': `
   `,
  //5-3 设置myapp/bed-service/app.js 文件中的内容
  'myapp/bed-service/app.js': `
   `,
  //5-4 myapp/bed-service/routes 文件夹中的内容
  'myapp/bed-service/routes/bedRoutes.js': `
   `,
  //5-5 myapp/bed-service/package.json 文件内容
  'myapp/bed-service/package.json': `
   `,
  //5-6 myapp/bed-service/controllers 文件夹中内容
  'myapp/bed-service/controllers/bedController.js': `
   `,
  //5-7 myapp/bed-service/models 文件夹中内容
  'myapp/bed-service/models/bedModel.js': `
   `,

  //6.设置myapp/catering-service中的内容
  //6-1 .env 文件内容：配置MongoDB连接字符串
  'myapp/catering-service/.env': `
   `,
  //6-2 myapp/catering-service/server.js 文件内容
  'myapp/catering-service/server.js': `
   `,
  //6-3 设置myapp/catering-service/app.js 文件中的内容
  'myapp/catering-service/app.js': `
   `,
  //6-4 myapp/catering-service/routes 文件夹中的内容
  'myapp/catering-service/routes/cateringRoutes.js': `
   `,
  //6-5 myapp/catering-service/package.json 文件内容
  'myapp/catering-service/package.json': `
   `,
  //6-6 myapp/catering-service/controllers 文件夹中内容
  'myapp/catering-service/controllers/cateringController.js': `
   `,
  //6-7 myapp/catering-service/models 文件夹中内容
  'myapp/catering-service/models/cateringModel.js': `
   `,
  //7.设置myapp/elderly-service中的内容
  //7-1 .env 文件内容：配置MongoDB连接字符串
  'myapp/elderly-service/.env': `
   `,
  //7-2 myapp/elderly-service/server.js 文件内容
  'myapp/elderly-service/server.js': `
   `,
  //7-3 设置myapp/elderly-service/app.js 文件中的内容
  'myapp/elderly-service/app.js': `
   `,
  //7-4 myapp/elderly-service/routes 文件夹中的内容
  'myapp/elderly-service/routes/elderlyRoutes.js': `
   `,
  //7-5 myapp/elderly-service/package.json 文件内容
  'myapp/elderly-service/package.json': `
   `,
  //7-6 myapp/elderly-service/controllers 文件夹中内容
  'myapp/elderly-service/controllers/elderlyController.js': `
   `,
  //7-7 myapp/elderly-service/models 文件夹中内容
  'myapp/elderly-service/models/elderlyModel.js': `
   `,
  
  //7.设置myapp/employee-service中的内容
  //7-1 .env 文件内容：配置MongoDB连接字符串
  'myapp/employee-service/.env': `
   `,
  //7-2 myapp/employee-service/server.js 文件内容
  'myapp/employee-service/server.js': `
   `,
  //7-3 设置myapp/employee-service/app.js 文件中的内容
  'myapp/employee-service/app.js': `
   `,
  //7-4 myapp/employee-service/routes 文件夹中的内容
  'myapp/employee-service/routes/employeeRoutes.js': `
   `,
  //7-5 myapp/employee-service/package.json 文件内容
  'myapp/employee-service/package.json': `
   `,
  //7-6 myapp/employee-service/controllers 文件夹中内容
  'myapp/employee-service/controllers/employeeController.js': `
   `,
  //7-7 myapp/employee-service/models 文件夹中内容
  'myapp/employee-service/models/employeeModel.js': `
   `,
  
  //8.设置myapp/financial-service中的内容
  //8-1 .env 文件内容：配置MongoDB连接字符串
  'myapp/financial-service/.env': `
   `,
  //8-2 myapp/financial-service/server.js 文件内容
  'myapp/financial-service/server.js': `
   `,
  //8-3 设置myapp/financial-service/app.js 文件中的内容
  'myapp/financial-service/app.js': `
   `,
  //8-4 myapp/financial-service/routes 文件夹中的内容
  'myapp/financial-service/routes/financialRoutes.js': `
   `,
  //8-5 myapp/financial-service/package.json 文件内容
  'myapp/financial-service/package.json': `
   `,
  //8-6 myapp/financial-service/controllers 文件夹中内容
  'myapp/financial-service/controllers/financialController.js': `
   `,
  //8-7 myapp/financial-service/models 文件夹中内容
  'myapp/financial-service/models/financialModel.js': `
   `,
  //9.设置"myapp/frontend",中的内容
  //9-1 myapp/frontend/routes/文件夹内容
  'myapp/frontend/routes/accountRoutes.js': ` 
     `,
  'myapp/frontend/routes/authRoutes.js': ` 
     `,
  'myapp/frontend/routes/bedRoutes.js': ` 
     `,
  'myapp/frontend/routes/cateringRoutes.js': ` 
     `,
  'myapp/frontend/routes/elderlyRoutes.js': ` 
     `,
  'myapp/frontend/routes/employeeRoutes.js': ` 
     `,
  'myapp/frontend/routes/financialRoutes.js': ` 
     `,
  'myapp/frontend/routes/healthRoutes.js': ` 
     `,
  'myapp/frontend/routes/notificationRoutes.js': ` 
     `,
  'myapp/frontend/routes/userRoutes.js': ` 
     `,
  'myapp/frontend/routes/visitorRoutes.js': ` 
     `,
   //9-1 myapp/frontend/controllers/文件夹内容
  'myapp/frontend/controllers/accountController.js': ` 
     `,
  'myapp/frontend/controllers/authController.js': ` 
     `,
  'myapp/frontend/controllers/bedController.js': ` 
     `,
  'myapp/frontend/controllers/cateringController.js': ` 
     `,
  'myapp/frontend/controllers/elderlyController.js': ` 
     `,
  'myapp/frontend/controllers/employeeController.js': ` 
     `,
  'myapp/frontend/controllers/financialController.js': ` 
     `,
  'myapp/frontend/controllers/healthController.js': ` 
     `,
  'myapp/frontend/controllers/notificationController.js': ` 
     `,
  'myapp/frontend/controllers/userController.js': ` 
     `,
  'myapp/frontend/controllers/visitorController.js': ` 
     `,
  
  //10.设置myapp/health-service中的内容
  //10-1 .env 文件内容：配置MongoDB连接字符串
  'myapp/health-service/.env': `
   `,
  //10-2 myapp/health-service/server.js 文件内容
  'myapp/health-service/server.js': `
   `,
  //10-3 设置myapp/health-service/app.js 文件中的内容
  'myapp/health-service/app.js': `
   `,
  //10-4 myapp/health-service/routes 文件夹中的内容
  'myapp/health-service/routes/healthRoutes.js': `
   `,
  //10-5 myapp/health-service/package.json 文件内容
  'myapp/health-service/package.json': `
   `,
  //10-6 myapp/health-service/controllers 文件夹中内容
  'myapp/health-service/controllers/healthController.js': `
   `,
  //10-7 myapp/health-service/models 文件夹中内容
  'myapp/health-service/models/healthModel.js': `
   `,
  //11.设置myapp/notification-service中的内容
  //11-1 .env 文件内容：配置MongoDB连接字符串
  'myapp/notification-service/.env': `
   `,
  //11-2 myapp/notification-service/server.js 文件内容
  'myapp/notification-service/server.js': `
   `,
  //11-3 设置myapp/notification-service/app.js 文件中的内容
  'myapp/notification-service/app.js': `
   `,
  //11-4 myapp/notification-service/routes 文件夹中的内容
  'myapp/notification-service/notificationRoutes.js': `
   `,
  //11-5 myapp/notification-service/package.json 文件内容
  'myapp/notification-service/package.json': `
   `,
  //11-6 myapp/notification-service/controllers 文件夹中内容
  'myapp/notification-service/controllers/notificationController.js': `
   `,
  //11-7 myapp/notification-service/models 文件夹中内容
  'myapp/notification-service/models/notificationModel.js': `
   `,
  //12.设置myapp/user-service中的内容
  //12-1 .env 文件内容：配置MongoDB连接字符串
  'myapp/user-service/.env': `
   `,
  //12-2 myapp/user-service/server.js 文件内容
  'myapp/user-service/server.js': `
   `,
  //12-3 设置myapp/user-service/app.js 文件中的内容
  'myapp/user-service/app.js': `
   `,
  //12-4 myapp/user-service/routes 文件夹中的内容
  'myapp/user-service/routes/userRoutes.js': `
   `,
  //12-5 myapp/user-service/package.json 文件内容
  'myapp/user-service/package.json': `
   `,
  //12-6 myapp/user-service/controllers 文件夹中内容
  'myapp/user-service/controllers/userController.js': `
   `,
  //12-7 myapp/user-service/models 文件夹中内容
  'myapp/user-service/models/userModel.js': `
   `,
  //13.设置myapp/visitor-service中的内容
  //13-1 .env 文件内容：配置MongoDB连接字符串
  'myapp/visitor-service/.env': `
   `,
  //13-2 myapp/visitor-service/server.js 文件内容
  'myapp/visitor-service/server.js': `
   `,
  //13-3 设置myapp/visitor-service/app.js 文件中的内容
  'myapp/visitor-service/app.js': `
   `,
  //13-4 myapp/visitor-service/routes 文件夹中的内容
  'myapp/visitor-service/routes/visitorRoutes.js': `
   `,
  //13-5 myapp/visitor-service/package.json 文件内容
  'myapp/visitor-service/package.json': `
   `,
  //13-6 myapp/visitor-service/controllers 文件夹中内容
  'myapp/visitor-service/controllers/visitorController.js': `
   `,
  //13-7 myapp/visitor-service/models 文件夹中内容
  'myapp/visitor-service/models/visitorModel.js': `
   `,
};
// 递归地创建文件并写入内容
Object.keys(fileContents).forEach((file) => {
  fs.writeFileSync(path.join(__dirname, file.trim()), fileContents[file]);
});

console.log('项目结构和文件内容已生成');
