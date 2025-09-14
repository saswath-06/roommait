#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const readline = require('readline');

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
  console.log(`${color}[EAS Setup]${colors.reset} ${message}`);
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
🚀 ===============================================
   roomait EAS Setup Assistant
   Get your Expo project ready for deployment!
===============================================${colors.reset}`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function executeCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    log(`Running: ${command}`);
    
    const child = spawn(command, [], {
      shell: true,
      stdio: options.silent ? 'pipe' : 'inherit',
      cwd: options.cwd || process.cwd()
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

function checkEASInstalled() {
  try {
    execSync('eas --version', { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

async function installEAS() {
  log('Installing EAS CLI...');
  try {
    await executeCommand('npm install -g @expo/eas-cli@latest');
    success('EAS CLI installed successfully!');
    return true;
  } catch (e) {
    error('Failed to install EAS CLI');
    return false;
  }
}

async function loginToEAS() {
  header();
  log('Setting up EAS authentication...');
  console.log('');
  
  warning('Important: Make sure you have an Expo account created at https://expo.dev');
  console.log('');
  
  const hasAccount = await askQuestion('Do you have an Expo account? (y/n): ');
  
  if (hasAccount.toLowerCase() !== 'y') {
    log('Please create an account at https://expo.dev first, then run this script again.');
    return false;
  }
  
  console.log('');
  log('Choose your preferred login method:');
  console.log('1. Username/Email + Password');
  console.log('2. GitHub OAuth (opens browser)');
  console.log('3. Google OAuth (opens browser)');
  
  const loginMethod = await askQuestion('Choose method (1-3): ');
  
  try {
    switch (loginMethod) {
      case '1':
        log('Logging in with username/password...');
        await executeCommand('eas login');
        break;
      case '2':
        log('Logging in with GitHub...');
        await executeCommand('eas login --github');
        break;
      case '3':
        log('Logging in with Google...');
        await executeCommand('eas login --google');
        break;
      default:
        warning('Invalid choice, using default login...');
        await executeCommand('eas login');
        break;
    }
    
    success('Successfully logged in to EAS!');
    return true;
  } catch (e) {
    error('Failed to login to EAS');
    console.log('');
    warning('Common solutions:');
    console.log('• Check your internet connection');
    console.log('• Verify your Expo account credentials');
    console.log('• Try a different login method');
    console.log('• Make sure you have verified your email address');
    return false;
  }
}

async function checkExistingProject() {
  try {
    // Check if we're already linked to a project
    const result = execSync('eas project:info', { 
      encoding: 'utf8', 
      cwd: 'apps/mobile',
      stdio: 'pipe' 
    });
    
    if (result.includes('44c5fe12-8e22-47ba-aed3-8672e275f568')) {
      success('Project already linked to roomait EAS project!');
      return true;
    }
  } catch (e) {
    // Project not linked yet
  }
  return false;
}

async function linkProject() {
  log('Linking to existing roomait EAS project...');
  
  try {
    await executeCommand('eas init --id 44c5fe12-8e22-47ba-aed3-8672e275f568', { 
      cwd: 'apps/mobile' 
    });
    success('Successfully linked to roomait EAS project!');
    return true;
  } catch (e) {
    error('Failed to link project');
    console.log('');
    warning('This might happen if:');
    console.log('• You don\'t have access to the existing project');
    console.log('• The project ID is incorrect');
    console.log('• Network issues');
    
    const createNew = await askQuestion('Would you like to create a new EAS project instead? (y/n): ');
    
    if (createNew.toLowerCase() === 'y') {
      try {
        log('Creating new EAS project...');
        await executeCommand('eas init', { cwd: 'apps/mobile' });
        success('New EAS project created!');
        return true;
      } catch (e) {
        error('Failed to create new project');
        return false;
      }
    }
    
    return false;
  }
}

async function configureBuilds() {
  log('Configuring build profiles...');
  
  // Check if eas.json exists and is properly configured
  try {
    const fs = require('fs');
    const easConfigPath = 'apps/mobile/eas.json';
    
    if (fs.existsSync(easConfigPath)) {
      success('EAS build configuration already exists!');
    } else {
      warning('EAS configuration missing, but it should be created automatically.');
    }
    
    log('Build profiles available:');
    console.log('• development - For internal testing');
    console.log('• preview - For external testing');
    console.log('• production - For app stores');
    
    return true;
  } catch (e) {
    error('Failed to configure builds');
    return false;
  }
}

async function showBuildCommands() {
  success('EAS setup complete! 🎉');
  console.log('');
  log('Available build commands:');
  console.log('');
  console.log(`${colors.cyan}Development builds:${colors.reset}`);
  console.log('  cd apps/mobile && eas build --profile development --platform ios');
  console.log('  cd apps/mobile && eas build --profile development --platform android');
  console.log('');
  console.log(`${colors.cyan}Production builds:${colors.reset}`);
  console.log('  npm run mobile:build:ios     # Build for App Store');
  console.log('  npm run mobile:build:android # Build for Google Play');
  console.log('  npm run mobile:build:all     # Build for both platforms');
  console.log('');
  console.log(`${colors.cyan}Submission:${colors.reset}`);
  console.log('  npm run mobile:submit:ios    # Submit to App Store');
  console.log('  npm run mobile:submit:android # Submit to Google Play');
  console.log('');
  console.log(`${colors.green}🔗 Useful links:${colors.reset}`);
  console.log('  EAS Dashboard: https://expo.dev/');
  console.log('  Build docs: https://docs.expo.dev/build/introduction/');
  console.log('  Submit docs: https://docs.expo.dev/submit/introduction/');
}

async function testBuild() {
  const shouldTest = await askQuestion('Would you like to test with a development build? (y/n): ');
  
  if (shouldTest.toLowerCase() === 'y') {
    log('Starting development build for iOS...');
    console.log('');
    warning('This will take several minutes. You can monitor progress at https://expo.dev/');
    
    try {
      await executeCommand('eas build --profile development --platform ios', { 
        cwd: 'apps/mobile' 
      });
      success('Development build completed!');
    } catch (e) {
      warning('Build failed or was cancelled. You can try again later with:');
      console.log('cd apps/mobile && eas build --profile development --platform ios');
    }
  }
}

async function main() {
  header();
  
  try {
    // Check if EAS is installed
    if (!checkEASInstalled()) {
      log('EAS CLI not found. Installing...');
      const installed = await installEAS();
      if (!installed) {
        error('Failed to install EAS CLI. Please install manually with: npm install -g @expo/eas-cli');
        process.exit(1);
      }
    } else {
      success('EAS CLI is already installed!');
    }
    
    // Check if already logged in
    try {
      execSync('eas whoami', { stdio: 'pipe' });
      success('Already logged in to EAS!');
    } catch (e) {
      log('Not logged in to EAS. Starting login process...');
      const loggedIn = await loginToEAS();
      if (!loggedIn) {
        error('Failed to login. Please try again later.');
        process.exit(1);
      }
    }
    
    // Check if project is already linked
    const alreadyLinked = await checkExistingProject();
    if (!alreadyLinked) {
      const linked = await linkProject();
      if (!linked) {
        error('Failed to link project. Setup incomplete.');
        process.exit(1);
      }
    }
    
    // Configure builds
    await configureBuilds();
    
    // Show available commands
    await showBuildCommands();
    
    // Optionally test a build
    await testBuild();
    
  } catch (e) {
    error(`Setup failed: ${e.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
