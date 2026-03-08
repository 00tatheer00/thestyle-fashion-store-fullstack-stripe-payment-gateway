const StripeService = require("../services/stripeService");

exports.createCheckoutSession = async (req, res) => {
  try {
    const { items, customerEmail } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    for (const item of items) {
      if (!item.name || !item.price || item.price <= 0) {
        return res.status(400).json({
          error: "Each item must have a valid name and price",
        });
      }
    }

    const session = await StripeService.createCheckoutSession(
      items,
      customerEmail
    );

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Checkout session error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

exports.getSession = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const session = await StripeService.retrieveSession(id);

    const lineItems = session.line_items?.data?.map((item) => ({
      name: item.description,
      amount: item.amount_total / 100,
      currency: item.currency,
      quantity: item.quantity,
    })) || [];

    res.json({
      sessionId: session.id,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      totalAmount: session.amount_total / 100,
      currency: session.currency,
      lineItems,
    });
  } catch (error) {
    console.error("Get session error:", error.message);
    res.status(500).json({ error: "Failed to retrieve session" });
  }
};
