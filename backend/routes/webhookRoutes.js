const express = require("express");
const router = express.Router();
const { handleStripeWebhook } = require("../controllers/webhookController");

// Stripe requires the raw body for signature verification,
// so this route must NOT use express.json() middleware.
router.post("/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);

module.exports = router;
