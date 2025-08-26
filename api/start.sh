#!/bin/bash
# 如果任何命令失败，则立即退出
set -e

# 执行数据库迁移
echo "==> Running database migrations..."
npx prisma migrate deploy

# 启动主应用
echo "==> Starting application..."
exec node dist/index.js