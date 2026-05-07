#!/bin/bash

# PulseTalk Automated Setup Script for Unix/Linux/Mac
# This script sets up the complete development environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  ${1}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup function
main() {
    print_header "🎯 PulseTalk Development Environment Setup"
    
    print_info "This script will set up your development environment for PulseTalk"
    print_info "It will install dependencies and configure all three services:"
    print_info "  • Frontend (React + Vite)"
    print_info "  • Backend (Node.js + Express)"
    print_info "  • ML Engine (Python + FastAPI)"
    echo ""
    
    read -p "Continue with setup? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Setup cancelled"
        exit 0
    fi
    
    # Step 1: Check prerequisites
    print_header "Step 1: Checking Prerequisites"
    check_prerequisites
    
    # Step 2: Install backend dependencies
    print_header "Step 2: Installing Backend Dependencies"
    setup_backend
    
    # Step 3: Install frontend dependencies
    print_header "Step 3: Installing Frontend Dependencies"
    setup_frontend
    
    # Step 4: Install ML engine dependencies
    print_header "Step 4: Installing ML Engine Dependencies"
    setup_ml_engine
    
    # Step 5: Create environment files
    print_header "Step 5: Creating Environment Files"
    create_env_files
    
    # Step 6: Final instructions
    print_header "🎉 Setup Complete!"
    print_final_instructions
}

# Check prerequisites
check_prerequisites() {
    local all_good=true
    
    # Check Node.js
    if command_exists node; then
        local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" -ge 18 ]; then
            print_success "Node.js $(node -v) installed"
        else
            print_error "Node.js version must be >= 18.x (current: $(node -v))"
            all_good=false
        fi
    else
        print_error "Node.js is not installed"
        print_info "Install from: https://nodejs.org/"
        all_good=false
    fi
    
    # Check npm
    if command_exists npm; then
        print_success "npm $(npm -v) installed"
    else
        print_error "npm is not installed"
        all_good=false
    fi
    
    # Check Python
    if command_exists python3; then
        local python_version=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
        print_success "Python $(python3 --version | cut -d' ' -f2) installed"
    else
        print_error "Python 3 is not installed"
        print_info "Install from: https://www.python.org/"
        all_good=false
    fi
    
    # Check pip
    if command_exists pip3; then
        print_success "pip $(pip3 --version | cut -d' ' -f2) installed"
    else
        print_error "pip3 is not installed"
        all_good=false
    fi
    
    # Check Git
    if command_exists git; then
        print_success "Git $(git --version | cut -d' ' -f3) installed"
    else
        print_warning "Git is not installed (optional but recommended)"
    fi
    
    if [ "$all_good" = false ]; then
        print_error "Please install missing prerequisites and run this script again"
        exit 1
    fi
    
    echo ""
}

# Setup backend
setup_backend() {
    print_info "Installing backend dependencies..."
    
    cd backend
    
    if [ -f "package.json" ]; then
        npm install --legacy-peer-deps
        print_success "Backend dependencies installed"
    else
        print_error "package.json not found in backend directory"
        exit 1
    fi
    
    cd ..
    echo ""
}

# Setup frontend
setup_frontend() {
    print_info "Installing frontend dependencies..."
    
    cd frontend
    
    if [ -f "package.json" ]; then
        npm install --legacy-peer-deps
        print_success "Frontend dependencies installed"
    else
        print_error "package.json not found in frontend directory"
        exit 1
    fi
    
    cd ..
    echo ""
}

# Setup ML engine
setup_ml_engine() {
    print_info "Installing ML engine dependencies..."
    print_warning "This may take 5-10 minutes (downloading ML models)..."
    
    cd ml-engine
    
    if [ -f "requirements.txt" ]; then
        # Create virtual environment (optional but recommended)
        if command_exists python3; then
            print_info "Creating Python virtual environment..."
            python3 -m venv venv
            
            # Activate virtual environment
            if [ -f "venv/bin/activate" ]; then
                source venv/bin/activate
                print_success "Virtual environment created and activated"
            fi
        fi
        
        # Install dependencies
        pip3 install -r requirements.txt
        print_success "ML engine dependencies installed"
        
        # Deactivate virtual environment
        if [ -n "$VIRTUAL_ENV" ]; then
            deactivate
        fi
    else
        print_error "requirements.txt not found in ml-engine directory"
        exit 1
    fi
    
    cd ..
    echo ""
}

# Create environment files
create_env_files() {
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        print_info "Creating backend/.env file..."
        cat > backend/.env << 'EOF'
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/pulsetalk
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulsetalk

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# ML Engine
ML_ENGINE_URL=http://localhost:8000

# CORS
FRONTEND_URL=http://localhost:5173
EOF
        print_success "Created backend/.env"
    else
        print_warning "backend/.env already exists, skipping"
    fi
    
    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        print_info "Creating frontend/.env file..."
        cat > frontend/.env << 'EOF'
# API Configuration
VITE_API_URL=http://localhost:5000/api
EOF
        print_success "Created frontend/.env"
    else
        print_warning "frontend/.env already exists, skipping"
    fi
    
    # ML Engine .env
    if [ ! -f "ml-engine/.env" ]; then
        print_info "Creating ml-engine/.env file..."
        cat > ml-engine/.env << 'EOF'
# Server Configuration
PORT=8000
ENVIRONMENT=development

# Model Configuration
MODEL_NAME=cardiffnlp/twitter-roberta-base-sentiment-latest
MAX_LENGTH=512
BATCH_SIZE=8
EOF
        print_success "Created ml-engine/.env"
    else
        print_warning "ml-engine/.env already exists, skipping"
    fi
    
    echo ""
}

# Print final instructions
print_final_instructions() {
    echo ""
    print_success "All dependencies installed successfully!"
    echo ""
    print_info "Next steps:"
    echo ""
    echo "  1. Configure your environment variables:"
    echo "     • backend/.env  - Update MONGODB_URI with your database"
    echo "     • frontend/.env - Already configured for local development"
    echo "     • ml-engine/.env - Already configured for local development"
    echo ""
    echo "  2. Start the development servers (in 3 separate terminals):"
    echo ""
    echo "     Terminal 1 - ML Engine:"
    echo "     ${GREEN}cd ml-engine${NC}"
    echo "     ${GREEN}source venv/bin/activate  # If using virtual environment${NC}"
    echo "     ${GREEN}uvicorn app.main:app --reload --port 8000${NC}"
    echo ""
    echo "     Terminal 2 - Backend:"
    echo "     ${GREEN}cd backend${NC}"
    echo "     ${GREEN}npm run dev${NC}"
    echo ""
    echo "     Terminal 3 - Frontend:"
    echo "     ${GREEN}cd frontend${NC}"
    echo "     ${GREEN}npm run dev${NC}"
    echo ""
    echo "  3. Access the application:"
    echo "     • Frontend:  ${BLUE}http://localhost:5173${NC}"
    echo "     • Backend:   ${BLUE}http://localhost:5000${NC}"
    echo "     • ML Engine: ${BLUE}http://localhost:8000${NC}"
    echo "     • ML Docs:   ${BLUE}http://localhost:8000/docs${NC}"
    echo ""
    print_info "For more information, see README.md and SETUP.md"
    echo ""
}

# Run main function
main
