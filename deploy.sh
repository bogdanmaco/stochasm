#!/bin/bash

# STOCHASM Solution - Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="stochasm-solution"
DEPLOY_PATH="/var/www/stochasm-solution"
BACKUP_PATH="/var/backups/stochasm-solution"
LOG_PATH="/var/log/stochasm-solution"

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

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root"
        exit 1
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    sudo mkdir -p $DEPLOY_PATH
    sudo mkdir -p $BACKUP_PATH
    sudo mkdir -p $LOG_PATH
    sudo mkdir -p $DEPLOY_PATH/logs
    
    # Set permissions
    sudo chown -R $USER:$USER $DEPLOY_PATH
    sudo chown -R $USER:$USER $BACKUP_PATH
    sudo chown -R $USER:$USER $LOG_PATH
}

# Backup current version
backup_current() {
    if [ -d "$DEPLOY_PATH" ]; then
        print_status "Creating backup of current version..."
        BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
        sudo cp -r $DEPLOY_PATH $BACKUP_PATH/$BACKUP_NAME
        print_success "Backup created: $BACKUP_PATH/$BACKUP_NAME"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing system dependencies..."
    
    # Update package list
    sudo apt update
    
    # Install Node.js and npm
    if ! command -v node &> /dev/null; then
        print_status "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    # Install PM2 globally
    if ! command -v pm2 &> /dev/null; then
        print_status "Installing PM2..."
        sudo npm install -g pm2
    fi
    
    # Install Nginx
    if ! command -v nginx &> /dev/null; then
        print_status "Installing Nginx..."
        sudo apt install -y nginx
    fi
    
    # Install certbot for SSL
    if ! command -v certbot &> /dev/null; then
        print_status "Installing Certbot..."
        sudo apt install -y certbot python3-certbot-nginx
    fi
}

# Deploy application
deploy_app() {
    print_status "Deploying application..."
    
    # Copy files to deployment directory
    cp -r . $DEPLOY_PATH/
    
    # Install npm dependencies
    cd $DEPLOY_PATH
    npm install --production
    
    # Set environment
    if [ "$1" = "production" ]; then
        export NODE_ENV=production
        print_status "Deploying to production..."
    else
        export NODE_ENV=development
        print_status "Deploying to development..."
    fi
    
    # Start/restart with PM2
    if pm2 list | grep -q $APP_NAME; then
        print_status "Restarting application..."
        pm2 restart $APP_NAME
    else
        print_status "Starting application..."
        pm2 start ecosystem.config.js --env $NODE_ENV
    fi
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
}

# Configure Nginx
configure_nginx() {
    print_status "Configuring Nginx..."
    
    # Copy nginx configuration
    sudo cp nginx.conf /etc/nginx/sites-available/$APP_NAME
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    
    # Remove default site
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    sudo nginx -t
    
    # Reload nginx
    sudo systemctl reload nginx
    sudo systemctl enable nginx
}

# Setup SSL certificate
setup_ssl() {
    if [ "$1" = "production" ]; then
        print_status "Setting up SSL certificate..."
        
        # Get domain from user
        read -p "Enter your domain name: " DOMAIN
        
        # Update nginx config with domain
        sudo sed -i "s/yourdomain.com/$DOMAIN/g" /etc/nginx/sites-available/$APP_NAME
        
        # Get SSL certificate
        sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
        
        print_success "SSL certificate configured for $DOMAIN"
    fi
}

# Setup firewall
setup_firewall() {
    print_status "Configuring firewall..."
    
    sudo ufw allow ssh
    sudo ufw allow 'Nginx Full'
    sudo ufw --force enable
    
    print_success "Firewall configured"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait for app to start
    sleep 5
    
    # Check if app is running
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_success "Application is running and healthy"
    else
        print_error "Application health check failed"
        exit 1
    fi
}

# Main deployment function
main() {
    print_status "Starting STOCHASM Solution deployment..."
    
    # Check arguments
    if [ "$1" != "production" ] && [ "$1" != "staging" ]; then
        print_error "Usage: $0 [production|staging]"
        exit 1
    fi
    
    # Check if running as root
    check_root
    
    # Create directories
    create_directories
    
    # Backup current version
    backup_current
    
    # Install dependencies
    install_dependencies
    
    # Deploy application
    deploy_app $1
    
    # Configure Nginx
    configure_nginx
    
    # Setup SSL for production
    if [ "$1" = "production" ]; then
        setup_ssl $1
    fi
    
    # Setup firewall
    setup_firewall
    
    # Health check
    health_check
    
    print_success "Deployment completed successfully!"
    print_status "Your application is now running at:"
    if [ "$1" = "production" ]; then
        echo "  https://yourdomain.com"
    else
        echo "  http://localhost:3000"
    fi
    
    print_status "Useful commands:"
    echo "  pm2 status                    # Check app status"
    echo "  pm2 logs stochasm-solution    # View logs"
    echo "  pm2 restart stochasm-solution # Restart app"
    echo "  sudo nginx -t                 # Test nginx config"
    echo "  sudo systemctl reload nginx   # Reload nginx"
}

# Run main function with arguments
main "$@"
