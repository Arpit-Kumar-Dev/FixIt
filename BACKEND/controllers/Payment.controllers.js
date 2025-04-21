const Razorpay = require("razorpay");

const MakePayment = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });

    const options = {
      amount: Number(req.body.amount) * 100, // 💰 Convert to paisa
      currency: "INR",
    };

    const order = await instance.orders.create(options);
    console.log("Razorpay Order =>", order);

    res.status(200).json({ status: true, order });
  } catch (error) {
    console.error("Payment Error =>", error);
    res.status(500).json({ status: false, message: "Payment initiation failed" });
  }
};

module.exports = { MakePayment };
