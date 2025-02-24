# 使用 Node.js 版本为 14 的基础镜像
FROM node:14

# 创建应用程序目录
WORKDIR /xiongshuqiu/myapp/elderly-service

# 复制 package.json 和 package-lock.json 文件到工作目录
COPY package*.json ./

# 安装应用程序依赖项
RUN npm install

# 复制所有应用程序源代码到工作目录
COPY . .

# 暴露应用程序使用的端口 8063
EXPOSE 8063

# 启动应用程序
CMD [ "node", "server.js" ]
