#!/usr/bin/with-contenv sh

cd "$NODE_APP_DIR"

echo "==> Installing npm dependencies"
npm install --no-bin-links
npm install -g @angular/cli

echo "==> Starting the server"
## To start with debugger, replace with:
# exec npm run-script start-debug
## To use the "production" approach to running the service, replace with:
# exec npm install
npm run-script start
