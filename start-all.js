/**
 * Start All Services Script
 * 
 * This script helps to start all the necessary services for the cinema reservation system:
 * 1. Auth Service (MongoDB + Node)
 * 2. Films & Seances Service (Laravel)
 * 3. React Frontend
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const services = [
  {
    name: 'Auth Service',
    command: 'npm',
    args: ['start'],
    cwd: path.join(__dirname, 'auth-service'),
    url: 'http://localhost:5000/health',
    readyMessage: 'Auth Service running on port 5000'
  },
  {
    name: 'React Frontend',
    command: 'npm',
    args: ['start'],
    cwd: path.join(__dirname, 'react'),
    url: 'http://localhost:3000',
    readyMessage: 'Starting the development server'
  }
];

// Color codes for console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper to print colored service messages
function logService(serviceName, message, isError = false) {
  const color = isError ? colors.red : colors.green;
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors.yellow}[${timestamp}]${colors.reset} ${color}[${serviceName}]${colors.reset} ${message}`);
}

// Start all services
function startAllServices() {
  console.log(`${colors.cyan}=== Starting Cinema Reservation System Services ===${colors.reset}\n`);
  
  // Check if package.json exists in required directories
  services.forEach(service => {
    const packageJsonPath = path.join(service.cwd, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.error(`${colors.red}Error: ${service.name} - package.json not found at ${packageJsonPath}${colors.reset}`);
      process.exit(1);
    }
  });

  // Start each service
  services.forEach(service => {
    logService(service.name, `Starting...`);
    
    const proc = spawn(service.command, service.args, {
      cwd: service.cwd,
      shell: true,
      stdio: 'pipe',
    });
    
    proc.stdout.on('data', (data) => {
      const output = data.toString().trim();
      const lines = output.split('\n');
      
      lines.forEach(line => {
        if (line.trim()) {
          logService(service.name, line);
        }
      });
      
      // Check for ready message
      if (output.includes(service.readyMessage)) {
        logService(service.name, `${colors.cyan}Service is ready!${colors.reset}`);
      }
    });
    
    proc.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        logService(service.name, output, true);
      }
    });
    
    proc.on('error', (error) => {
      logService(service.name, `Failed to start: ${error.message}`, true);
    });
    
    proc.on('close', (code) => {
      if (code !== 0) {
        logService(service.name, `Process exited with code ${code}`, true);
      } else {
        logService(service.name, 'Process completed successfully');
      }
    });
  });
  
  console.log(`\n${colors.cyan}=== Services Starting... ===${colors.reset}`);
  console.log(`${colors.cyan}Auth Service:${colors.reset} http://localhost:5000`);
  console.log(`${colors.cyan}Films API:${colors.reset} http://localhost:8000/api`);
  console.log(`${colors.cyan}React Frontend:${colors.reset} http://localhost:3000`);
}

// Run the services
startAllServices(); 