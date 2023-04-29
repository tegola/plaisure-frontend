#!/bin/ash
set -eo pipefail
BASE=${PWD}

echo "Command: ${1}"
if [ "${1}" = 'npm' ] || [ "${1}" = 'yarn' ]; then
  echo "Installing npm libraries....."
  yarn install
  echo "...done\n"
fi

cd ${BASE}
exec "$@"
