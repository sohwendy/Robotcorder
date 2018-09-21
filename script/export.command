#!/bin/bash
# zipping for chrome webstore

FILE="manifest.json"
while IFS= read -r line
do
  if [[ $line == *\"version\"* ]]; then
    VERSION=$(echo $line| cut -d':' -d'"' -f 4)
  fi
done < "$FILE"

echo $VERSION

zip -r archive/${VERSION}.zip . -x *.git* *.DS_Store *.idea* *.zip script/\* archive/\* test/\* node_modules/\* package* .eslint* docs/\* yarn.lock yarn-error.log .travis.yml

exit;
