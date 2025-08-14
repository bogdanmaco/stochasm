# STOCHASM Solution - AI & Web Innovation

A modern, responsive landing page for STOCHASM Solution, showcasing AI and web development services with stunning visual effects and interactive elements.

## 🚀 Features

- **Modern Design**: Dark AI/ML themed design with gradient effects
- **Interactive Elements**: Constellation background, animated AI brain, parallax effects
- **Responsive**: Fully responsive design for all devices
- **Performance Optimized**: Fast loading with compression and optimization
- **Interactive Portfolio**: Dynamic portfolio with modal views
- **Contact Form**: Functional contact form with validation
- **AI Demo**: Interactive AI demonstration modal
- **Smooth Animations**: CSS animations and JavaScript interactions

## 🛠️ Technologies Used

- **Backend**: Node.js with Express.js
- **Template Engine**: EJS
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables and Flexbox/Grid
- **Icons**: Font Awesome 6
- **Fonts**: Inter (Google Fonts)
- **Security**: Helmet.js for security headers
- **Performance**: Compression middleware

## 📁 Project Structure

```
stochasm-nodejs/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── README.md             # Project documentation
├── public/               # Static files
│   ├── css/
│   │   └── styles.css    # Main stylesheet
│   ├── js/
│   │   └── script.js     # Main JavaScript file
│   └── images/           # Image assets
├── views/                # EJS templates
│   ├── index.ejs         # Main page template
│   └── error.ejs         # Error page template
├── ecosystem.config.js   # PM2 configuration
├── nginx.conf           # Nginx configuration
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
├── deploy.sh            # Deployment script
└── routes/              # Route handlers (future)
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stochasm-nodejs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Production

1. **Start production server**
   ```bash
   npm run prod
   ```

2. **Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=3000
   ```

## 🚀 Deployment Options

### Option 1: Traditional Server Deployment

#### Using the Deployment Script

1. **Make the script executable**
   ```bash
   chmod +x deploy.sh
   ```

2. **Run deployment**
   ```bash
   # For staging
   ./deploy.sh staging
   
   # For production
   ./deploy.sh production
   ```

#### Manual Deployment

1. **Install PM2 globally**
   ```bash
   npm install -g pm2
   ```

2. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

3. **Save PM2 configuration**
   ```bash
   pm2 save
   pm2 startup
   ```

### Option 2: Docker Deployment

#### Using Docker Compose

1. **Build and start services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f app
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

#### Using Docker directly

1. **Build image**
   ```bash
   docker build -t stochasm-solution .
   ```

2. **Run container**
   ```bash
   docker run -d -p 3000:3000 --name stochasm-solution stochasm-solution
   ```

### Option 3: Cloud Deployment

#### Heroku

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

#### DigitalOcean App Platform

1. **Connect your GitHub repository**
2. **Set environment variables**
3. **Deploy automatically**

#### Vercel

1. **Connect your GitHub repository**
2. **Configure build settings**
3. **Deploy automatically**

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Server Configuration
NODE_ENV=production
PORT=3000

# Security
SESSION_SECRET=your-super-secret-session-key-here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS Origins
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Nginx Configuration

Update `nginx.conf` with your domain:

```nginx
server_name yourdomain.com www.yourdomain.com;
```

### PM2 Configuration

Update `ecosystem.config.js` for your server:

```javascript
deploy: {
  production: {
    user: 'deploy',
    host: 'your-server.com',
    repo: 'git@github.com:yourusername/stochasm-nodejs.git',
    path: '/var/www/stochasm-solution'
  }
}
```

## 📊 Monitoring & Maintenance

### Health Checks

- **Application**: `http://localhost:3000/health`
- **Docker**: `docker exec stochasm-solution node healthcheck.js`

### Logs

```bash
# PM2 logs
pm2 logs stochasm-solution

# Docker logs
docker-compose logs -f app

# Nginx logs
sudo tail -f /var/log/nginx/access.log
```

### Performance Monitoring

- **PM2 Monitoring**: `pm2 monit`
- **Docker Stats**: `docker stats`
- **System Resources**: `htop`, `iotop`

### Backup

```bash
# Create backup
sudo cp -r /var/www/stochasm-solution /var/backups/stochasm-solution/backup-$(date +%Y%m%d-%H%M%S)

# Restore backup
sudo cp -r /var/backups/stochasm-nodejs/backup-YYYYMMDD-HHMMSS /var/www/stochasm-solution
```

## 🔒 Security

### SSL/HTTPS

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Get SSL certificate**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Firewall

```bash
# Configure UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### Security Headers

Already configured in `server.js` and `nginx.conf`:
- Helmet.js security headers
- CORS protection
- Rate limiting
- XSS protection
- Content Security Policy

## 🚀 Performance Optimization

### Caching

- **Static files**: 1 year cache
- **API responses**: Configure as needed
- **CDN**: Use Cloudflare or similar

### Compression

- **Gzip**: Enabled in Nginx
- **Brotli**: Optional for better compression

### Image Optimization

```bash
# Install image optimization tools
npm install -g imagemin-cli

# Optimize images
imagemin public/images/* --out-dir=public/images/optimized
```

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Permission denied**
   ```bash
   sudo chown -R $USER:$USER /var/www/stochasm-solution
   ```

3. **PM2 not starting**
   ```bash
   pm2 delete all
   pm2 start ecosystem.config.js
   ```

4. **Nginx configuration error**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm start

# View detailed logs
pm2 logs stochasm-solution --lines 100
```

## 📞 Support

- **Email**: hello@stochasm-solution.com
- **Website**: https://stochasm-solution.com
- **Documentation**: [GitHub Wiki](https://github.com/yourusername/stochasm-nodejs/wiki)

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Inter font family
- CSS Grid and Flexbox for layouts

---

**STOCHASM Solution** - Where AI Meets Web Innovation 🚀
