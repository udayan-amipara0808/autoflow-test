// MOCKED ESCROW MODEL
const escrows = [];

class Escrow {
    static async create(data) {
        const escrow = { id: crypto.randomUUID(), ...data, status: 'locked' };
        escrows.push(escrow);
        return escrow;
    }

    static async findByTaskId(taskId) {
        return escrows.find(e => e.taskId === taskId);
    }

    static async update(id, updates) {
        const escrow = escrows.find(e => e.id === id);
        if (escrow) Object.assign(escrow, updates);
    }

    static async checkTimeouts() {
        return [];
    }
}

const crypto = require('crypto');
module.exports = Escrow;
