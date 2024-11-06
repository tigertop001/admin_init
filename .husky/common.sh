#!/bin/sh
command_exists () {
  command -v "$1" >/dev/null 2>&1
}

# Workaround for Windows 10, Git Bash and Pnpm
if command_exists winpty && test -t 1; then
  exec < /dev/tty
fi


# 检查暂存区中是否有 -lock.yaml 文件
if git diff --cached --name-only | grep -q '\pnpm-lock.yaml'; then
  echo "Error: The pnpm-lock.yaml file cannot be committed!"
  exit 1
fi