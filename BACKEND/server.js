const express = require("express")
const app = express()
const cors = require("cors")
const { connectDB } = require("./DB/connect")
require("dotenv").config();
const port = process.env.PORT || 8000

const userRouter = require("./routes/users.routs")
const BookingRouter =require("./routes/booking.routs") 
const SpRouter =require("./routes/SP.routs")
const EmailRouter =require("./routes/Email.routs")
const payment =require("./routes/Payment.routs")
app.use(express.json())
app.use(cors()); 
app.use("/api/v1/user", userRouter)
app.use("/api/v1/booking", BookingRouter)
app.use("/api/v1/ServiceProvider", SpRouter)
app.use("/api/v1/Mail", EmailRouter)
app.use("/api/v1/Payment", payment)
 

async function start() {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log("App is running on port 8000")
        })
    } catch (error) {
        console.log(error)
    } 
}
start() 

