const cors = require('cors');
const allowedOrigins = (process.env.CLIENT_URLS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);
const fallbackOrigins = [
  'http://localhost:3000',
  'http://172.29.198.78:8080',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'https://advoca.lovable.app'
];

const corsOptions = {

  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || fallbackOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};

module.exports = cors(corsOptions);
