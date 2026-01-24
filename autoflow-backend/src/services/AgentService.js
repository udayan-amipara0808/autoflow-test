const { ethers } = require('ethers');
const crypto = require('crypto');
const Agent = require('../models/Agent');
const logger = require('../utils/logger');

class AgentService {
  async createAgent(data) {
    try {
      const wallet = ethers.Wallet.createRandom();
      const apiKey = this.generateApiKey();
      const encryptedPrivateKey = this.encryptPrivateKey(wallet.privateKey);

      const agent = await Agent.create({
        name: data.name || `Agent-${wallet.address.slice(0, 8)}`,
        type: data.type || 'autonomous_ai',
        walletAddress: wallet.address,
        privateKeyEncrypted: encryptedPrivateKey,
        apiKey,
        settings: data.settings || {},
      });

      logger.info(`Agent created: ${agent.id} - ${wallet.address}`);
      return {
        id: agent.id,
        name: agent.name,
        type: agent.type,
        walletAddress: wallet.address,
        apiKey,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase,
      };
    } catch (error) {
      logger.error(`Failed to create agent: ${error.message}`);
      throw error;
    }
  }

  async authenticateByApiKey(apiKey) {
    try {
      const agent = await Agent.findByApiKey(apiKey);
      if (!agent) {
        throw new Error('Invalid API key');
      }
      if (!agent.isActive) {
        throw new Error('Agent is inactive');
      }
      await Agent.update(agent.id, { lastActiveAt: new Date() });
      return {
        id: agent.id,
        name: agent.name,
        type: agent.type,
        walletAddress: agent.walletAddress,
        balance: agent.balance,
        reputationScore: agent.reputationScore,
      };
    } catch (error) {
      logger.error(`Authentication failed: ${error.message}`);
      throw error;
    }
  }

  async getAgentWallet(agentId) {
    const agent = await Agent.findById(agentId);
    if (!agent) throw new Error('Agent not found');
    const privateKey = this.decryptPrivateKey(agent.privateKeyEncrypted);
    return new ethers.Wallet(privateKey);
  }

  generateApiKey() {
    return 'ak_' + crypto.randomBytes(32).toString('hex');
  }

  encryptPrivateKey(privateKey) {
    const algorithm = 'aes-256-gcm';
    const keyStr = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const key = Buffer.from(keyStr, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return JSON.stringify({
      iv: iv.toString('hex'),
      encrypted,
      authTag: authTag.toString('hex'),
    });
  }

  decryptPrivateKey(encryptedData) {
    const algorithm = 'aes-256-gcm';
    const keyStr = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const key = Buffer.from(keyStr, 'hex');

    // Parse if string, otherwise assume object
    const data = typeof encryptedData === 'string' ? JSON.parse(encryptedData) : encryptedData;

    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(data.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(data.authTag, 'hex'));
    let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = new AgentService();
