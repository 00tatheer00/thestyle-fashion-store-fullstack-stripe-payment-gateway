const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  getSession,
} = require("../controllers/paymentController");

router.post("/create-session", createCheckoutSession);
router.get("/session/:id", getSession);

module.exports = router;
