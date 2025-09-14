#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.blue) {
  console.log(`${color}[roomait]${colors.reset} ${message}`);
}

function success(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function error(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function warning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function header() {
  console.log(`${colors.purple}
🏠 ===============================================
   roomait Development CLI
   AR Interior Design for Students  
===============================================${colors.reset}`);
}

function showHelp() {
  header();
  console.log(`
${colors.cyan}Available commands:${colors.reset}

${colors.yellow}Development:${colors.reset}
  npm run setup              # Interactive setup
  npm run dev                # Start both backend and mobile
  npm run dev:backend        # Start backend only  
  npm run dev:mobile         # Start mobile only
  npm run dev:full           # Full setup + start servers

${colors.yellow}Database:${colors.reset}
  npm run db:init            # Initialize database tables
  npm run db:seed            # Seed with sample data
  npm run db:reset           # Reset and reseed database

${colors.yellow}Mobile (EAS):${colors.reset}
  npm run mobile:build:ios   # Build for iOS
  npm run mobile:build:android # Build for Android
  npm run mobile:submit      # Submit to stores

${colors.yellow}Utilities:${colors.reset}
  npm run clean              # Clean all node_modules
  npm run health             # Check all services
  npm run logs               # Show recent logs

${colors.green}🔗 Useful URLs:${colors.reset}
  Backend API: http://localhost:8000
  API Docs: http://localhost:8000/docs
  Railway: https://railway.app
`);
}

function checkRequirements() {
  log('Checking system requirements...');
  
  const requirements = [
    { cmd: 'node --version', name: 'Node.js' },
    { cmd: 'npm --version', name: 'npm' },
    { cmd: 'python3 --version', name: 'Python3' },
    { cmd: 'pip --version', name: 'pip' }
  ];
  
  for (const req of requirements) {
    try {
      const version = execSync(req.cmd, { encoding: 'utf8' }).trim();
      success(`${req.name}: ${version}`);
    } catch (e) {
      error(`${req.name} not found`);
      return false;
    }
  }
  
  return true;
}

function installDependencies() {
  log('Installing dependencies...');
  
  try {
    // Root dependencies
    log('Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Backend dependencies  
    log('Installing backend dependencies...');
    execSync('cd apps/backend && pip install -r requirements.txt', { stdio: 'inherit', shell: true });
    
    // Mobile dependencies
    log('Installing mobile dependencies...');
    execSync('cd apps/mobile && npm install', { stdio: 'inherit', shell: true });
    
    success('All dependencies installed!');
    return true;
  } catch (e) {
    error('Failed to install dependencies');
    return false;
  }
}

function initDatabase() {
  log('Initializing database...');
  
  if (!process.env.DATABASE_URL) {
    warning('DATABASE_URL not set. Please set it in your environment.');
    return false;
  }
  
  try {
    execSync('cd apps/backend && python src/init_db.py', { stdio: 'inherit', shell: true });
    success('Database initialized!');
    return true;
  } catch (e) {
    error('Failed to initialize database');
    return false;
  }
}

function seedDatabase() {
  log('Seeding database...');
  
  try {
    // Check if backend is running
    const response = execSync('curl -s http://localhost:8000/api/v1/health || echo "FAILED"', { encoding: 'utf8', shell: true });
    
    if (response.includes('FAILED')) {
      warning('Backend not running. Please start backend first.');
      return false;
    }
    
    execSync('curl -X POST http://localhost:8000/api/v1/models/seed', { stdio: 'inherit', shell: true });
    success('Database seeded!');
    return true;
  } catch (e) {
    error('Failed to seed database');
    return false;
  }
}

function startServers(mode = 'both') {
  log(`Starting ${mode} server(s)...`);
  
  switch (mode) {
    case 'backend':
      spawn('npm', ['run', 'dev:backend'], { stdio: 'inherit', shell: true });
      break;
    case 'mobile':
      spawn('npm', ['run', 'dev:mobile'], { stdio: 'inherit', shell: true });
      break;
    case 'both':
    default:
      spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });
      break;
  }
}

function checkHealth() {
  log('Checking service health...');
  
  // Check backend
  try {
    const backendHealth = execSync('curl -s http://localhost:8000/api/v1/health', { encoding: 'utf8' });
    success('Backend is healthy');
  } catch (e) {
    warning('Backend is not responding');
  }
  
  // Check if mobile is running (check for expo process)
  try {
    execSync('pgrep -f "expo start" > /dev/null', { shell: true });
    success('Mobile development server is running');
  } catch (e) {
    warning('Mobile development server is not running');
  }
}

// Main CLI logic
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
      
    case 'check':
      checkRequirements();
      break;
      
    case 'install':
      if (checkRequirements()) {
        installDependencies();
      }
      break;
      
    case 'db:init':
      initDatabase();
      break;
      
    case 'db:seed':
      seedDatabase();
      break;
      
    case 'db:reset':
      initDatabase() && seedDatabase();
      break;
      
    case 'start:backend':
      startServers('backend');
      break;
      
    case 'start:mobile':
      startServers('mobile');
      break;
      
    case 'start':
      startServers('both');
      break;
      
    case 'health':
      checkHealth();
      break;
      
    case 'setup':
      header();
      log('Starting full setup...');
      if (checkRequirements() && installDependencies()) {
        initDatabase();
        success('Setup complete! Run "npm run dev" to start development.');
      }
      break;
      
    default:
      header();
      log('Welcome to roomait development CLI!');
      console.log('Run "node scripts/dev.js help" for available commands.');
      break;
  }
}

main();
