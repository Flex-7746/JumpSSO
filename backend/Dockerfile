# 定义镜像 - 使用 Alpine 版本减小体积
FROM node:22-alpine

# 设置环境变量（优化：设置 NODE_ENV 为生产环境）
ENV NODE_ENV=production

# 设置工作目录
WORKDIR /sso

# 优化：先拷贝依赖配置，利用 Docker 缓存层
COPY package*.json ./

# 项目依赖 - 使用 npm ci 确保一致性，并清理缓存减小体积
RUN npm ci --only=production && npm cache clean --force

# 复制应用源代码
COPY . .

# 声明应用监听的端口
EXPOSE 17746

# 优化：使用 CMD 而不是 RUN（在容器启动时执行）
# 注意：环境变量 $SSO_SERVER 等会在运行时传入，不会在构建时解析
CMD ["sh", "-c", "npm run prod -- --server=$SSO_SERVER --port=17746 --redis=$SSO_REDIS --mysql=$SSO_MYSQL"]