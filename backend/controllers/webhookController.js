const StripeService = require("../services/stripeService");
const OrderService = require("../services/orderService");

exports.handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = StripeService.constructWebhookEvent(req.body, signature);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log(`Payment successful for session: ${session.id}`);

        const order = await OrderService.createFromStripeSession(session);
        console.log(`Order created: ${order._id}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.error(
          `Payment failed for intent: ${paymentIntent.id}`,
          paymentIntent.last_payment_error?.message
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};
