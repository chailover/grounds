#!/bin/bash

# Create project directories
mkdir -p frontend backend

# Initialize frontend
cd frontend
npm init -y
npm install react react-dom @types/react @types/react-dom typescript @types/node
npm install -D tailwindcss postcss autoprefixer @testing-library/react @testing-library/jest-dom jest
npm install axios @headlessui/react @heroicons/react

# Initialize backend
cd ../backend
npm init -y
npm install express @types/express typescript ts-node @types/node
npm install bullmq @types/bullmq
npm install jest @types/jest ts-jest supertest @types/supertest
npm install dotenv @types/dotenv
npm install googleapis @types/googleapis

# Create TypeScript configs
cd ../frontend
npx tsc --init

cd ../backend
npx tsc --init

# Create initial directory structure
cd ../frontend
mkdir -p src/components src/pages src/tests src/utils

cd ../backend
mkdir -p src/controllers src/routes src/services src/tests src/utils

# Create .gitignore
cd ..
echo "node_modules/
.env
dist/
build/
coverage/
.DS_Store" > .gitignore

# Make the script executable
chmod +x setup.sh 