
const Razorpay = require("razorpay")

const MakePayment= async(req,res)=>{
   const options={
    amount: Number(req.body.amount * 100),
    currency: "INR"
   }
    const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET,
  });
   const order = await instance.orders.create(options)
   console.log(order)
   res.status(200).json({status:true,order})
}




module.exports= {MakePayment}