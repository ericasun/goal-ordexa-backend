# !/bin/bash

# git rm -r --cached . ||

# 使用传入的参数作为提交消息，如果没有传入则使用默认消息 "update"
commit_message=${1:-update}

# 仓库地址（在 Bash 里，变量赋值时 = 号两边不能有空格。）
github_address="git@github.com:ericasun/goal-ordexa-backend.git"


# 弹出对话框
osascript -e "tell app \"System Events\" to display dialog \"请确认仓库地址：\n${github_address}\n是否正确?\" buttons {\"取消\", \"确定\"} default button \"确定\"" || exit 1

sleep 2
echo "用户选择继续..."

git init
git add . &&
git commit -m "$commit_message" &&
git branch -M main &&
git remote rm origin


# 注意仓库地址
git remote add origin ${github_address} &&
git push -f -u origin main &&
cd -
echo "——————————code success————————"