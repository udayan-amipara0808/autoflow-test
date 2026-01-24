// MOCKED PAYMENT MODEL
const payments = [];

class Payment {
    static async create(data) {
        const payment = { id: crypto.randomUUID(), ...data, created_at: new Date() };
        payments.push(payment);
        return payment;
    }

    static async findByTask(taskId) {
        return payments.filter(p => p.taskId === taskId);
    }
}

const crypto = require('crypto');
module.exports = Payment;
