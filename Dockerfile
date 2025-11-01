# 使用 node 基础镜像
FROM node:18-alpine

# 创建工作目录
WORKDIR /app

# 拷贝依赖并安装
COPY package*.json ./
RUN npm install

# 拷贝源码
COPY . .

# 构建 Nest 项目
RUN npm run build

EXPOSE 3000

# 启动服务
CMD ["node", "dist/main"]
