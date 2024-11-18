FROM node:lts-jod

# 安装 PHP 和 supervisor
RUN apt-get update && apt-get install -y php-cli php-pear supervisor

# 安装 PM2 和 PHP 服务所需的文件
RUN npm i -g pm2

# 拷贝应用代码
COPY app /app

# 暴露两个服务的端口
EXPOSE 3000 80

ENV WEB_UI_USER=admin
ENV WEB_UI_PASS=admin@123
ENV USER=download
ENV PASS=download@123
ENV WEB_PREFIX=""

# 配置 supervisor
COPY /app/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
# 设置工作目录
WORKDIR /app

# 启动 supervisor
CMD ["/usr/bin/supervisord"]