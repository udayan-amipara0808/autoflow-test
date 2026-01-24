class PaymentController {
    async listPayments(req, res) { res.json({ success: true, data: [] }); }
    async getPayment(req, res) { res.json({ success: true, data: {} }); }
    async getActiveEscrows(req, res) { res.json({ success: true, data: [] }); }
    async getEscrow(req, res) { res.json({ success: true, data: {} }); }
}
module.exports = new PaymentController();
