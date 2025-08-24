# 使用官方 Node.js 18 Alpine 镜像作为基础
FROM node:18-alpine

# 设置容器内的工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖
RUN npm install

# 复制项目中的所有其他文件
COPY . .

# 暴露 API 服务运行的端口
EXPOSE 4000

# 容器启动时执行的命令 (开发模式，带热重载)
CMD ["npm", "run", "dev"]