#!/bin/sh

# See https://stackoverflow.com/questions/3258243/check-if-pull-needed-in-git/25109122

UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    echo "Up-to-date"
elif [ $LOCAL = $BASE ]; then
    echo "Need to pull"
    git pull origin raspbian-build
    python3 init.py
elif [ $REMOTE = $BASE ]; then
    echo "Error codebase changed!"
else
    echo "Diverged"
fi