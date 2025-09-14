#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MOBILE_DIR = path.join(__dirname, '../apps/mobile');
const COLOR = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = COLOR.cyan) {
  console.log(`${color}${message}${COLOR.reset}`);
}

function runCommand(command, options = {}) {
  log(`📱 Running: ${command}`, COLOR.blue);
  try {
    const result = execSync(command, {
      cwd: MOBILE_DIR,
      stdio: 'inherit',
      ...options
    });
    return result;
  } catch (error) {
    log(`❌ Command failed: ${command}`, COLOR.red);
    throw error;
  }
}

function checkEASLogin() {
  try {
    execSync('eas whoami', { cwd: MOBILE_DIR, stdio: 'pipe' });
    log('✅ Already logged in to EAS', COLOR.green);
  } catch (error) {
    log('🔐 Please log in to EAS...', COLOR.yellow);
    runCommand('eas login');
  }
}

function selectDeploymentType() {
  const args = process.argv.slice(2);
  
  if (args.includes('--development') || args.includes('-d')) {
    return 'development';
  } else if (args.includes('--preview') || args.includes('-p')) {
    return 'preview';
  } else if (args.includes('--production') || args.includes('--prod')) {
    return 'production';
  }
  
  // Interactive selection
  log('🚀 Select deployment type:', COLOR.bright);
  log('  1. Development (internal testing)', COLOR.cyan);
  log('  2. Preview (shareable build)', COLOR.cyan);
  log('  3. Production (app store)', COLOR.cyan);
  log('  4. Update only (OTA update)', COLOR.cyan);
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('Choose option (1-4): ', (answer) => {
      rl.close();
      switch (answer.trim()) {
        case '1': resolve('development'); break;
        case '2': resolve('preview'); break;
        case '3': resolve('production'); break;
        case '4': resolve('update'); break;
        default: 
          log('Invalid selection. Using development.', COLOR.yellow);
          resolve('development');
      }
    });
  });
}

async function main() {
  try {
    log('🏠 roomait Mobile Deployment', COLOR.bright);
    log('===============================', COLOR.bright);
    
    // Check if we're in the right directory
    if (!fs.existsSync(path.join(MOBILE_DIR, 'app.json'))) {
      throw new Error('app.json not found. Make sure you\'re in the project root.');
    }
    
    // Check EAS login
    checkEASLogin();
    
    // Get deployment type
    const deploymentType = await selectDeploymentType();
    
    log(`📦 Deploying ${deploymentType} build...`, COLOR.bright);
    
    if (deploymentType === 'update') {
      // OTA Update only
      log('🔄 Publishing update...', COLOR.cyan);
      runCommand('eas update --auto');
      log('✅ Update published! Users will receive it automatically.', COLOR.green);
    } else {
      // Full build
      log(`🏗️  Building ${deploymentType} version...`, COLOR.cyan);
      runCommand(`eas build --platform all --profile ${deploymentType}`);
      
      if (deploymentType === 'preview') {
        log('📱 Preview build created!', COLOR.green);
        log('📱 Check your Expo dashboard for QR code to share', COLOR.green);
      } else if (deploymentType === 'production') {
        log('🎉 Production build ready!', COLOR.green);
        log('📤 Submit to app stores with: eas submit --platform all', COLOR.cyan);
      }
    }
    
    log('🚀 Deployment completed successfully!', COLOR.green);
    
  } catch (error) {
    log(`❌ Deployment failed: ${error.message}`, COLOR.red);
    process.exit(1);
  }
}

// Handle different ways this script might be called
if (require.main === module) {
  main();
}

module.exports = { main };
