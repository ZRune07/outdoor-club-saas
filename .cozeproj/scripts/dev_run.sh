#!/bin/bash
# 前端运行脚本 - SPA静态服务器 + API代理

set -e

echo "========================================="
echo "启动户外俱乐部SaaS前端服务..."
echo "========================================="

# 停止已有进程
pkill -f "node.*server" 2>/dev/null || true
pkill -f "nginx" 2>/dev/null || true

sleep 1

cd /workspace

# 检查构建产物是否存在
if [ ! -d "ruoyi-ui/dist" ]; then
    echo "错误: 构建产物不存在，请先运行构建脚本"
    exit 1
fi

# 获取后端API地址 (默认为环境变量或占位符)
BACKEND_URL=${VITE_API_BASE_URL:-"http://localhost:9091"}
echo "后端API地址: $BACKEND_URL"

# 启动静态文件服务器 + API代理
echo "[1/1] 启动前端服务 (端口 8080)..."
nohup node .cozeproj/scripts/server.js > .cozeproj/logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "前端服务 PID: $FRONTEND_PID"

sleep 3

echo "========================================="
echo "服务已启动!"
echo "管理端:    http://localhost:80"
echo "后端API:   $BACKEND_URL"
echo "========================================="
echo "$FRONTEND_PID" > .cozeproj/.pids
