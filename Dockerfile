# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 将构建的静态文件复制到 Nginx 默认的静态文件目录
COPY dist/ /usr/share/nginx/html/

# 替换默认的 Nginx 配置文件，配置 Vue 路由支持
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 Nginx 端口
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]
