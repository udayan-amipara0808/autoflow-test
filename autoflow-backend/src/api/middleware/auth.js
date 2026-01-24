// MOCK AUTH MIDDLEWARE
// In production, verify JWT or API Key
const Agent = require('../../models/Agent');

exports.authenticateApiKey = async (req, res, next) => {
    // Checks header x-api-key
    /*
    const apiKey = req.headers['x-api-key'];
    if(!apiKey) return res.status(401).json({error: 'Missing API key'});
    */

    // For demo: Inject a mock agent
    req.agent = { id: 'agent-1', name: 'Demo Agent', walletAddress: '0xabc...' };
    next();
};

exports.isAdmin = (req, res, next) => {
    next(); // Allow all in demo
};
