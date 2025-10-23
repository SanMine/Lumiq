# Node.js Version Requirements

This project requires **Node.js v22.19.0** to run properly. The frontend uses Vite v7.1.5+ which requires Node.js 20.19+.

## For Team Members - Choose Your Version Manager:

### Option 1: Using Volta (Recommended)
```bash
# Install volta if not already installed
curl https://get.volta.sh | bash

# Pin Node.js version for this project
volta pin node@22.19.0
```

### Option 2: Using nvm
```bash
# Use the version specified in .nvmrc
nvm use

# Or install and use specific version
nvm install 22.19.0
nvm use 22.19.0
```

### Option 3: Manual Installation
Download Node.js v22.19.0 from [nodejs.org](https://nodejs.org/)

## Verification
After setting up Node.js, verify your version:
```bash
node --version  # Should output v22.19.0
npm run check-node  # Project script to check version
```

## Development Commands
```bash
# Install all dependencies (root, frontend, backend)
npm run install:all

# Start frontend development server
npm run dev:frontend

# Start backend server
npm run dev:backend
```

## Troubleshooting
If you encounter version conflicts:
1. Check your current Node.js version: `node --version`
2. Use one of the version managers above to switch to v22.19.0
3. Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`