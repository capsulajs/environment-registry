#!/usr/bin/env bash
set -e

MSG_PUBLISH_SUCCESS="npm publish: Succeed"
MSG_PUBLISH_FAIL="npm publish: Failed"

echo "--------------------------------------------"
echo "|    Publishing has been triggered          |"
echo "--------------------------------------------"

echo "travis branch    -> $TRAVIS_BRANCH"
echo "travis PR branch -> $TRAVIS_PULL_REQUEST_BRANCH"
git status

set_git_remote() {
    git remote set-url origin https://${GH_ACCESS_TOKEN}@github.com/capsulajs/environment-registry
}

echo_result() {
    if [[ "$1" == 0 ]]; then
        echo "$MSG_PUBLISH_SUCCESS" && return 0
    else
        echo "$MSG_PUBLISH_FAIL" && return 1
    fi
}

if [[ "$TRAVIS_PULL_REQUEST_BRANCH" =~ ^feature\/.*$ ]]; then
    echo "--------------------------------------------"
    echo "|    Deploying 'snapshot' on npm registry    |"
    echo "--------------------------------------------"

    BRANCH_NAME=$(echo $TRAVIS_PULL_REQUEST_BRANCH | sed "s/[_/]/-/g")
    PACKAGE_VERSION="alpha.$(date +%s).$BRANCH_NAME"
    npm version prerelease --preid="$PACKAGE_VERSION"
    npm publish --tag snapshot --access public
    echo_result "$?"
    COMMENT_RESULT=$(bash -c "./publish_comment.sh" $PACKAGE_VERSION)
elif [[ "$TRAVIS_BRANCH" == "develop" ]] && [[ "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    echo "--------------------------------------------"
    echo "|     Deploying 'next' on npm registry      |"
    echo "--------------------------------------------"

    set_git_remote
    git checkout develop
    npm version prerelease --preid="next.$(date +%s)"
    git push origin develop
    npm publish --tag next --access public
    echo_result "$?"

elif [[ "$TRAVIS_BRANCH" == "master" ]] && [[ "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    echo "--------------------------------------------"
    echo "|     Deploying 'latest' on npm registry     |"
    echo "--------------------------------------------"

    set_git_remote
    git checkout master
    npm version patch
    git push origin master
    npm publish --tag latest --access public
    echo_result "$?"

else
    echo "*************************************************"
    echo "*   Not a pull request, npm publish skipped !   *"
    echo "*************************************************"
fi
