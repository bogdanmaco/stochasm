const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: isProduction ? [] : null,
    },
  },
  hsts: isProduction ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false,
  noSniff: true,
  xssFilter: true,
  frameguard: { action: 'deny' }
}));

// Compression middleware with better settings
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Logging middleware
if (isProduction) {
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
    stream: {
      write: (message) => {
        console.log(message.trim());
      }
    }
  }));
} else {
  app.use(morgan('dev'));
}

// CORS configuration
app.use(cors({
  origin: isProduction ? ['https://yourdomain.com'] : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files with caching
const staticOptions = {
  maxAge: isProduction ? '1y' : '0',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Cache-Control', isProduction ? 'public, max-age=31536000' : 'no-cache');
    } else if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', isProduction ? 'public, max-age=31536000' : 'no-cache');
    } else if (path.match(/\.(jpg|jpeg|png|gif|ico|svg)$/)) {
      res.setHeader('Cache-Control', isProduction ? 'public, max-age=31536000' : 'no-cache');
    }
  }
};

// Serve static files from both public directory and root directory
app.use(express.static(path.join(__dirname, 'public'), staticOptions));
app.use(express.static(__dirname, staticOptions));
app.use('/css', express.static(path.join(__dirname, 'public/css'), staticOptions));
app.use('/js', express.static(path.join(__dirname, 'public/js'), staticOptions));
app.use('/images', express.static(path.join(__dirname, 'public/images'), staticOptions));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', isProduction);

// Rate limiting for production
if (isProduction) {
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);
}

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'STOCHASM Solution - AI & Web Innovation',
    description: 'Leading AI, Machine Learning and Web Development company specializing in cutting-edge solutions and digital transformation',
    isProduction: isProduction
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Also serve the original HTML file directly
app.get('/original', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes
app.get('/api/contact', (req, res) => {
  res.json({ 
    message: 'Contact form endpoint ready',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }
    
    // Here you would typically send the email or save to database
    console.log('Contact form submission:', { name, email, subject, message });
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

app.get('/api/portfolio', (req, res) => {
  const portfolioData = [
    {
      id: 1,
      title: 'AI-Powered Analytics Platform',
      category: 'AI/ML',
      image: '/images/ai-analytics.jpg',
      description: 'Advanced analytics platform with machine learning capabilities',
      technologies: ['Python', 'TensorFlow', 'React', 'Node.js']
    },
    {
      id: 2,
      title: 'E-commerce AI Assistant',
      category: 'AI/ML',
      image: '/images/ai-ecommerce.jpg',
      description: 'Intelligent shopping assistant with personalized recommendations',
      technologies: ['Python', 'Scikit-learn', 'Vue.js', 'Express.js']
    },
    {
      id: 3,
      title: 'Neural Network Dashboard',
      category: 'AI/ML',
      image: '/images/neural-dashboard.jpg',
      description: 'Real-time neural network monitoring and visualization',
      technologies: ['Python', 'PyTorch', 'D3.js', 'Socket.io']
    }
  ];
  res.json(portfolioData);
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { 
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    isProduction: isProduction
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't leak error details in production
  const errorMessage = isProduction ? 'Something went wrong!' : err.message;
  const errorStack = isProduction ? null : err.stack;
  
  res.status(err.status || 500).render('error', { 
    title: 'Error',
    message: errorMessage,
    stack: errorStack,
    isProduction: isProduction
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 STOCHASM Solution server running on port ${PORT}`);
  console.log(`📱 Visit: http://localhost:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📄 Original HTML: http://localhost:${PORT}/original`);
  console.log(`❤️ Health Check: http://localhost:${PORT}/health`);
  
  if (isProduction) {
    console.log(`🔒 Production mode enabled`);
    console.log(`⚡ Compression enabled`);
    console.log(`🛡️ Security headers enabled`);
  }
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});
