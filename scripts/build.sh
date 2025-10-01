#!/bin/bash

set -e

echo "🚀🚀🚀 Starting Build Process..."

echo "🔨🔨🔨🔨Building Client🔨🔨🔨🔨 "
cd client
pwd
# rm -rf build
npm install typescript@5.7.3 --save-dev
npm run build
ls
cd ..
echo "Client Build Successfully😉😉😉 "

echo "🔨🔨🔨🔨Building Server🔨🔨🔨🔨"
cd server
pwd
# rm -rf dist
npm install
npm run build
ls
cd ..  
echo "Server Build Successfully😉😉😉 "

echo "✅✅🐳🐳😏😏Build Completed Successfully!"
