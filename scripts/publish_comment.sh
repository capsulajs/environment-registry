#!/usr/bin/env bash
set -e
if [[ "x$PIPELINEDEBUG" != "x" ]]; then
    set -x
fi

PACKAGE_VERSION=$1
PACKAGE_NAME="@capsulajs/environment-registry"
PACKAGE_PAGE="[**npm**](https://www.npmjs.com/package/${PACKAGE_NAME})"
COMMENTS_CREATION_URL="https://api.github.com/repos/$TRAVIS_REPO_SLUG/issues/$TRAVIS_PULL_REQUEST/comments"
COMMENTS_UPDATE_URL="https://api.github.com/repos/$TRAVIS_REPO_SLUG/issues/comments"
COMMENT_ID=0

echo """
---------------------------------------------
 package name      -> ${PACKAGE_NAME}
 package version   -> ${PACKAGE_VERSION}
 package page      -> ${PACKAGE_PAGE}
 comments creation -> ${COMMENTS_CREATION_URL}
 comments update   -> ${COMMENTS_UPDATE_URL}

 travis repo slug  -> ${TRAVIS_REPO_SLUG}
 travis PR         -> ${TRAVIS_PULL_REQUEST}
---------------------------------------------
"""

# check if there is already a comment about npm publication
commentAlreadyExists() {
    comments=$(curl -s -u "$GH_USER:$GH_ACCESS_TOKEN" "$COMMENTS_CREATION_URL" | jq -r '.[].body')
    [[ -z "$comments" ]] && echo "No comments yet" && exist_code=0
    COMMENT_ID=$(curl -u "$GH_USER:$GH_ACCESS_TOKEN" "$COMMENTS_CREATION_URL" | jq -r '.[] | select(.body | contains('\"$1\"')) | .id')
    echo "COMMENT_ID -> $COMMENT_ID"
    [[ "$COMMENT_ID" -eq 0 ]] && exist_code=0 || exist_code=1
}

comment(){
    echo "Links to the published packages generation for PR"
    COMMENT_TEXT="**Travis-CI** has published $PACKAGE_NAME@$PACKAGE_VERSION-$PACKAGE_SNAPSHOT to $PACKAGE_PAGE"
    echo "$COMMENT_TEXT"

    # Post comment about package if not commented yet or update it
    exist_code="-1"
    commentAlreadyExists ${PACKAGE_NAME}
    if [[ "$exist_code" -eq 0  ]]; then
        echo "Creating comments"
        curl -d '{"body":"'"$COMMENT_TEXT"'"}' -u "$GH_USER:$GH_ACCESS_TOKEN" -X POST "$COMMENTS_CREATION_URL"
    elif [[ "$exist_code" -eq 1 ]]; then
        echo "Updating comments"
        curl -d '{"body":"'"$COMMENT_TEXT"'"}' -u "$GH_USER:$GH_ACCESS_TOKEN" -X PATCH "$COMMENTS_UPDATE_URL/$COMMENT_ID"
    else
        echo "Something went wrong, comment not posted"
        exit 1
    fi
}

comment
