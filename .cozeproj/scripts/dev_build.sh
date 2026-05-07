#!/bin/bash
# 开发环境构建脚本

set -e

echo "========================================="
echo "开始构建户外俱乐部SaaS项目..."
echo "========================================="

# 1. 构建后端 (Maven)
echo "[1/3] 构建后端 (Spring Boot)..."
cd /workspace/projects/outdoor-club-saas
mvn clean package -DskipTests -q

# 2. 构建前端管理端 (Vue3)
echo "[2/3] 构建前端管理端 (ruoyi-ui)..."
cd /workspace/projects/outdoor-club-saas/ruoyi-ui
npm install --silent 2>/dev/null || npm install
npm run build:prod --silent

# 3. 构建H5前端 (Vue3)
echo "[3/3] 构建H5前端 (ruoyi-h5)..."
cd /workspace/projects/outdoor-club-saas/ruoyi-h5
npm install --silent 2>/dev/null || npm install
npm run build --silent

echo "========================================="
echo "构建完成!"
echo "========================================="
