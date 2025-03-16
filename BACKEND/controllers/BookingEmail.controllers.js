
const nodemailer = require("nodemailer");

const sendBookingMail = async (req,res) =>{
    
    const {name,to,body,sp_name}=req.body
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: "kumararpit56744@gmail.com",
        pass: "ptjcqcilijmfcikv",
      },
    });
    const info = await transporter.sendMail({
        from: '"FixIt Pvt.Ltd 👻" <kumararpit56744@gmail.com>', 
        to: to, 
        subject: `Booking sucessfull with ${sp_name}`, 
        text: "",
        html: `<h1>Hi ${name}</h1><p>${body}</p>`, 
      });
      console.log("Message sent: %s", info.messageId);
      res.json(info)
}
module.exports = sendBookingMail
//kaurv298@gmail.com