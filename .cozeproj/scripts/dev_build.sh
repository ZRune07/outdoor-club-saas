#!/bin/bash
# 开发环境构建脚本 - 纯前端SPA

set -e

echo "========================================="
echo "构建户外俱乐部SaaS前端..."
echo "========================================="

cd /workspace/projects

echo "[1/2] 安装依赖..."
cd ruoyi-ui
npm install

echo "[2/2] 构建生产版本..."
npm run build:prod

echo "========================================="
echo "构建完成!"
echo "输出目录: ruoyi-ui/dist"
echo "========================================="
