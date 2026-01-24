const logger = require('../utils/logger');
// Simple stub
module.exports = {
    start: () => logger.info('NodeHealthMonitor started'),
    stop: () => logger.info('NodeHealthMonitor stopped')
};
