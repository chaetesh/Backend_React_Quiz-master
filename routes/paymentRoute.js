var crypto = require("crypto")
const Razorpay = require("razorpay");
var express = require("express");
var router = express.Router();

var instance = new Razorpay({
  key_id: "rzp_live_GAPOZyPwGHq5dl",
  key_secret: "ls4dR7nMG2M951v9Uw7voQ7D",
});

router.get("/getkey", (req, res) =>
res.status(200).json({ key: "rzp_live_GAPOZyPwGHq5dl" })
);

router.post("/checkout", async (req, res) => {

    await instance.orders.create({
      amount: Number(req.body.amount * 100),
      currency: "INR",
    }).then((order) => {
      console.log(order);
      res.status(200).json({
        success: true,
        order,
      });
   }).catch((error) => {
        console.log("error", error);
   });
});

router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
  req.body;

const body = razorpay_order_id + "|" + razorpay_payment_id;

const expectedSignature = crypto
  .createHmac("sha256", "ls4dR7nMG2M951v9Uw7voQ7D")
  .update(body.toString())
  .digest("hex");

const isAuthentic = expectedSignature === razorpay_signature;

if (isAuthentic) {
  // Database comes here

  // await Payment.create({
  //   razorpay_order_id,
  //   razorpay_payment_id,
  //   razorpay_signature,
  // });

  res.redirect(
    `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
  );
} else {
  res.status(400).json({
    success: false,
  });
}
});

module.exports = router;