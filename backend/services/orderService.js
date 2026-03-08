const Order = require("../models/Order");

class OrderService {
  static async createFromStripeSession(session) {
    const existingOrder = await Order.findOne({
      stripeSessionId: session.id,
    });
    if (existingOrder) return existingOrder;

    let items = [];
    try {
      items = JSON.parse(session.metadata?.items || "[]");
    } catch {
      items = [];
    }

    const orderItems = items.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.qty || 1,
    }));

    const order = await Order.create({
      stripeSessionId: session.id,
      items: orderItems,
      totalAmount: session.amount_total / 100,
      currency: session.currency,
      customerEmail: session.customer_details?.email || session.customer_email,
      customerName: session.customer_details?.name || "",
      paymentStatus: session.payment_status === "paid" ? "paid" : "pending",
      shippingAddress: session.shipping_details?.address || {},
      stripePaymentIntentId: session.payment_intent?.id || session.payment_intent,
    });

    return order;
  }

  static async getBySessionId(sessionId) {
    return Order.findOne({ stripeSessionId: sessionId });
  }

  static async getAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(),
    ]);
    return { orders, total, page, pages: Math.ceil(total / limit) };
  }
}

module.exports = OrderService;
