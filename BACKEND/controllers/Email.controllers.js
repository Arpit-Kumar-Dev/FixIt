
const nodemailer = require("nodemailer");

const sendMail = async (req,res) =>{
    
    const {name,to,body}=req.body
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: "kumararpit56744@gmail.com",
        pass: "ptjcqcilijmfcikv",
      },
    });
    const info = await transporter.sendMail({
        from: '"FixIt Pvt.Ltd 👻" <kumararpit56744@gmail.com>', 
        to: to, 
        subject: "sucessfull LogIn", 
        text: "",
        html: `<h1> Hi ${name}</h1><p>${body}</p>`, 
      });
      console.log("Message sent: %s", info.messageId);
      res.json(info)
}
module.exports = sendMail
//kaurv298@gmail.com