#!/bin/bash
# 开发环境运行脚本 - 纯前端SPA

set -e

echo "========================================="
echo "启动户外俱乐部SaaS前端..."
echo "========================================="

cd /workspace/projects

# 停止已有进程
pkill -f "serve.*ruoyi-ui" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

sleep 1

echo "启动静态文件服务..."
npx serve ruoyi-ui/dist -l 80

echo "========================================="
echo "前端已启动: http://localhost:80"
echo "========================================="
