module.exports = {
  apps: [{
    name: 'stochasm-solution',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Performance settings
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Restart settings
    watch: false,
    ignore_watch: ['node_modules', 'logs', '*.log'],
    max_restarts: 10,
    min_uptime: '10s',
    
    // Health check
    health_check_grace_period: 3000,
    
    // Environment variables
    env_file: '.env',
    
    // Advanced settings
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Monitoring
    pmx: true,
    
    // Auto restart on file changes (development only)
    watch: process.env.NODE_ENV === 'development' ? ['server.js', 'views', 'public'] : false,
    
    // Environment specific settings
    ...(process.env.NODE_ENV === 'production' && {
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '2G',
      node_args: '--max-old-space-size=2048'
    })
  }],
  
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/stochasm-nodejs.git',
      path: '/var/www/stochasm-solution',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
