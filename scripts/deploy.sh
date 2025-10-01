#!/bin/bash

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

echo "Node version in use: $(node -v)"
echo "Node path: $(which node)"


echo "🚀🚀🚀 Starting Deployment..."



echo "😶‍🌫️😶‍🌫️ Installing node-module in Server 😶‍🌫️😶‍🌫️"
cd /home/ubuntu/server
# time npm install || exit 1
# time npm install --legacy-peer-deps || exit 1
npm install --verbose || exit 1

echo "😶‍🌫️😶‍🌫️ Installing node-module in CLient 😶‍🌫️😶‍🌫️"
cd /home/ubuntu/client
time npm install --verbose || exit 1

echo "🫸🫸Moving Nginx file🫷🫷"
cd
# mv nginx.conf default
# sudo chown -R ubuntu:ubuntu /etc/nginx/sites-enabled/
# mv -f default /etc/nginx/sites-enabled/default

echo " 🛠️🛠️Changing Client Permission for execution🛠️🛠️"
sudo chmod +x /home/ubuntu/client
sudo chmod +x /home/ubuntu/client/dist

echo "🔃🔃Restarting Nginx🔃🔃"
sudo nginx -t
sudo systemctl reload nginx

# echo "Starting PM2 🚅🚅🚅"
# cd /home/ubuntu/server
# chmod +x pm2.config.js
# pm2 restart pm2.config.js
# pm2 save




echo "✅ Deployment Completed!"

