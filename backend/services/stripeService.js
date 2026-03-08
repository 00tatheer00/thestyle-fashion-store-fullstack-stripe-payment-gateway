const stripe = require("../config/stripe");

class StripeService {
  /**
   * Build line items array for Stripe Checkout from cart items.
   * Each item needs product_data with name/images and a unit_amount in cents.
   */
  static buildLineItems(items) {
    return items.map((item) => ({
      price_data: {
        currency: item.currency || "usd",
        product_data: {
          name: item.name,
          images: item.images?.length ? [item.images[0]] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));
  }

  static async createCheckoutSession(items, customerEmail = null) {
    const lineItems = this.buildLineItems(items);

    const sessionConfig = {
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "IN"],
      },
      metadata: {
        items: JSON.stringify(
          items.map((i) => ({
            id: i.productId,
            name: i.name,
            price: i.price,
            qty: i.quantity || 1,
          }))
        ),
      },
    };

    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    return stripe.checkout.sessions.create(sessionConfig);
  }

  static async retrieveSession(sessionId) {
    return stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    });
  }

  static constructWebhookEvent(payload, signature) {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  }
}

module.exports = StripeService;
