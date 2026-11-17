// Vercel Serverless Function entry point
const app = require('../backend/server.js');

module.exports = (req, res) => {
  // Ensure the route matches express /api prefix regardless of Vercel path rewriting
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
};
