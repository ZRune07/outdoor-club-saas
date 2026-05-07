#!/bin/bash
# 开发环境运行脚本

set -e

echo "========================================="
echo "启动户外俱乐部SaaS服务..."
echo "========================================="

# 停止已有进程
pkill -f "java.*ruoyi" 2>/dev/null || true
pkill -f "node.*ruoyi" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

sleep 1

# 1. 启动后端 (Spring Boot)
echo "[1/3] 启动后端服务 (端口 9091)..."
cd /workspace/projects/outdoor-club-saas
nohup java -jar ruoyi-admin/target/ruoyi-admin.jar --spring.profiles.active=dev > .cozeproj/logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "后端 PID: $BACKEND_PID"

# 等待后端启动
sleep 10

# 2. 启动前端管理端 (Vue3)
echo "[2/3] 启动前端管理端 (端口 5000)..."
cd /workspace/projects/outdoor-club-saas/ruoyi-ui
nohup npm run dev -- --port 5000 > .cozeproj/logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "前端管理端 PID: $FRONTEND_PID"

# 3. 启动H5前端
echo "[3/3] 启动H5前端 (端口 3000)..."
cd /workspace/projects/outdoor-club-saas/ruoyi-h5
nohup npm run dev -- --port 3000 > .cozeproj/logs/h5.log 2>&1 &
H5_PID=$!
echo "H5前端 PID: $H5_PID"

echo "========================================="
echo "所有服务已启动!"
echo "后端API:   http://localhost:9091"
echo "管理端:    http://localhost:5000"
echo "H5前端:    http://localhost:3000"
echo "========================================="
echo "$BACKEND_PID $FRONTEND_PID $H5_PID" > .cozeproj/.pids
