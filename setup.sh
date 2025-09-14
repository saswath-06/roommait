#!/bin/bash

# roomait Development Setup CLI
# This script sets up the entire development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}"
    echo "🏠 =============================================="
    echo "   roomait Development Setup CLI"
    echo "   AR Interior Design for Students"
    echo "=============================================="
    echo -e "${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    # Root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Backend dependencies
    print_status "Installing backend dependencies..."
    cd apps/backend
    pip install -r requirements.txt
    cd ../..
    
    # Mobile dependencies
    print_status "Installing mobile dependencies..."
    cd apps/mobile
    npm install
    cd ../..
    
    print_success "All dependencies installed!"
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    if [ -z "$DATABASE_URL" ]; then
        print_warning "DATABASE_URL not set. Please set it in your environment or .env file"
        print_status "You can get the DATABASE_URL from your Railway PostgreSQL deployment"
    else
        print_status "Database URL found. Initializing tables..."
        cd apps/backend
        python src/init_db.py
        cd ../..
        print_success "Database initialized!"
    fi
}

# Function to seed database
seed_database() {
    print_status "Seeding database with sample data..."
    
    if [ -z "$DATABASE_URL" ]; then
        print_warning "DATABASE_URL not set. Skipping database seeding."
    else
        # Check if backend is running
        if curl -s http://localhost:8000/api/v1/health > /dev/null; then
            curl -X POST http://localhost:8000/api/v1/models/seed
            print_success "Database seeded with sample furniture models!"
        else
            print_warning "Backend not running. Start backend first, then run: curl -X POST http://localhost:8000/api/v1/models/seed"
        fi
    fi
}

# Function to start development servers
start_development() {
    print_status "Starting development servers..."
    
    print_status "Available options:"
    echo "1. Start both backend and mobile"
    echo "2. Start backend only"
    echo "3. Start mobile only" 
    echo "4. Skip starting servers"
    
    read -p "Choose option (1-4): " choice
    
    case $choice in
        1)
            print_status "Starting both backend and mobile..."
            npm run dev
            ;;
        2)
            print_status "Starting backend only..."
            npm run dev:backend
            ;;
        3)
            print_status "Starting mobile only..."
            npm run dev:mobile
            ;;
        4)
            print_status "Skipping server startup."
            ;;
        *)
            print_warning "Invalid choice. Skipping server startup."
            ;;
    esac
}

# Function to setup EAS
setup_eas() {
    print_status "Setting up EAS for mobile deployment..."
    
    if ! command_exists eas; then
        print_status "Installing EAS CLI..."
        npm install -g eas-cli
    fi
    
    print_status "EAS CLI installed. To complete setup:"
    echo "1. Run: eas login"
    echo "2. Then run: cd apps/mobile && eas init --id 44c5fe12-8e22-47ba-aed3-8672e275f568"
    print_warning "You'll need valid Expo account credentials for this step."
}

# Function to check system requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js not found. Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi
    
    # Check Python
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python found: $PYTHON_VERSION"
    else
        print_error "Python3 not found. Please install Python 3.8+ from https://python.org"
        exit 1
    fi
    
    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_error "npm not found. Please install npm"
        exit 1
    fi
    
    # Check pip
    if command_exists pip; then
        PIP_VERSION=$(pip --version)
        print_success "pip found: $PIP_VERSION"
    else
        print_error "pip not found. Please install pip"
        exit 1
    fi
    
    # Check git
    if command_exists git; then
        GIT_VERSION=$(git --version)
        print_success "git found: $GIT_VERSION"
    else
        print_error "git not found. Please install git"
        exit 1
    fi
}

# Function to display helpful commands
show_helpful_commands() {
    print_header
    echo -e "${GREEN}🚀 Development Commands:${NC}"
    echo ""
    echo -e "${YELLOW}Backend:${NC}"
    echo "  npm run dev:backend     # Start FastAPI backend"
    echo "  cd apps/backend && python src/init_db.py  # Initialize database"
    echo ""
    echo -e "${YELLOW}Mobile:${NC}"
    echo "  npm run dev:mobile      # Start Expo mobile app"
    echo "  cd apps/mobile && npm run ios    # iOS simulator"
    echo "  cd apps/mobile && npm run android # Android emulator"
    echo "  cd apps/mobile && npm run web     # Web version"
    echo ""
    echo -e "${YELLOW}Both:${NC}"
    echo "  npm run dev             # Start both backend and mobile"
    echo "  npm run build           # Build both apps"
    echo ""
    echo -e "${YELLOW}Database:${NC}"
    echo "  curl -X POST http://localhost:8000/api/v1/models/seed  # Seed database"
    echo "  curl http://localhost:8000/api/v1/health              # Check backend health"
    echo ""
    echo -e "${YELLOW}EAS (Mobile Deployment):${NC}"
    echo "  eas login               # Login to Expo"
    echo "  cd apps/mobile && eas build --platform ios     # Build for iOS"
    echo "  cd apps/mobile && eas build --platform android # Build for Android"
    echo ""
    echo -e "${GREEN}🔗 Useful URLs:${NC}"
    echo "  Backend API: http://localhost:8000"
    echo "  API Docs: http://localhost:8000/docs"
    echo "  Railway Dashboard: https://railway.app"
    echo ""
}

# Main setup function
main() {
    print_header
    
    print_status "Welcome to roomait development setup!"
    print_status "This script will help you set up the entire development environment."
    echo ""
    
    # Check requirements first
    check_requirements
    echo ""
    
    print_status "Setup options:"
    echo "1. Full setup (dependencies + database + EAS)"
    echo "2. Dependencies only" 
    echo "3. Database setup only"
    echo "4. EAS setup only"
    echo "5. Show helpful commands"
    echo "6. Start development servers"
    
    read -p "Choose option (1-6): " setup_choice
    
    case $setup_choice in
        1)
            install_dependencies
            echo ""
            setup_database
            echo ""
            seed_database
            echo ""
            setup_eas
            echo ""
            show_helpful_commands
            echo ""
            start_development
            ;;
        2)
            install_dependencies
            ;;
        3)
            setup_database
            seed_database
            ;;
        4)
            setup_eas
            ;;
        5)
            show_helpful_commands
            ;;
        6)
            start_development
            ;;
        *)
            print_error "Invalid choice. Exiting."
            exit 1
            ;;
    esac
    
    echo ""
    print_success "Setup complete! 🎉"
    print_status "Run './setup.sh' again anytime you need help."
}

# Run main function
main "$@"
