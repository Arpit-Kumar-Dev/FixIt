
const mongoose = require("mongoose")
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioPhone = process.env.TWILIO_PHONE;




const BookingSchema = new mongoose.Schema({
  user_id:{type:String},
  Sp_id:{type:String},
  service: String,
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed","Paid"], 
    default: "Pending"
  },
  otp: String,
  otpExpiresAt: Date,
  customer: {
    name: String,
    email: String,
    phone: Number,
    address:[],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Optional
  },
 
}, { timestamps: true })

BookingSchema.statics.CreateBooking = async (userId, SPId, service) => {
  try {
    // Validate inputs
    if (!userId || !SPId || !service) {
      throw new Error("All fields (userId, SPId, service) are required.");
    }

    // Fetch customer details
    const User = require("./user.model"); // adjust path if needed
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    // Construct booking with embedded customer info
    const newBooking = await BookingModel.create({
      user_id:userId,
      Sp_id:SPId,
      service,
      customer: {
        name: user.name,
        email: user.email,
        phone: user.phoneNumber,
        address: user.address,
        userId: user._id,
      },
      status: "Pending", // Optional default
    });

    return newBooking;
  } catch (error) {
    console.error("Error creating booking:", error.message);
    throw error;
  }
};

BookingSchema.statics.Userbookings= async (userId) =>{
  try {
    // Validate the inputs
    if (!userId){
      throw new Error("All fields (userId) are required.")
    }

    // Create the booking
    const UserBookings = await BookingModel.find({user_id:userId});
    return UserBookings
  }catch (error) {
    console.error(`Error in finding booking of user ${userId}: `, error.message)
    throw error
  }
} 
BookingSchema.statics.Get_All_service_provides_booking = async function (SPId) {
  try {
     // cast it right!
    const bookings = await BookingModel.find({ Sp_id: SPId });
    return bookings;
  } catch (error) {
    console.error("Error fetching bookings for service provider:", error);
    throw new Error("Failed to fetch bookings");
  }
};


BookingSchema.statics.Deletebooking = async (BookingId) =>{
  if (!BookingId) {
      throw new Error("BookingId is required");
  }
  try {
      const deletedBooking = await BookingModel.deleteOne( { _id: BookingId } );
      if (deletedBooking.deletedCount === 0) {
          throw new Error("No booking found with the given BookingId");
      } 
      return deletedBooking ;
  } catch (error) {
      console.error("Error deleting booking:", error.message);
      throw new Error("Failed to delete booking");
  }
};
BookingSchema.statics.GetAllBookings = async () => {
  try {
      const bookings = await BookingModel.find({});
      if (!bookings || bookings.length === 0) {
          throw new Error("No bookings found");
      }
      return bookings;
  } catch (error) {
      console.error("Error fetching bookings:", error.message);
      throw new Error("Failed to retrieve bookings");
  }
};

BookingSchema.statics.UpdateStatus = async (id, status) => {
  if (!id) {
    throw new Error("Booking ID is required");
  }

  if (!status) {
    throw new Error("Status is required");
  }

  try {
    const statusUpdated = await BookingModel.updateOne(
      { _id: id }, 
      { $set: { status: status } } 
    );

    if (statusUpdated.modifiedCount === 0) {
      throw new Error("No booking found with the provided ID or status is already updated");
    }

    return statusUpdated;
  } catch (error) {
    console.error("Error in updating status:", error.message);
    throw new Error("Failed to update booking status");
  }
};
BookingSchema.statics.sendOTP=async(bookingId)=>{
  
  try {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    booking.otp = otp;
    booking.otpExpiresAt = otpExpiresAt;
    await booking.save();

    const messageBody = `Hello ${booking.customer.name}, your FixIt.com OTP is ${otp}. It expires in 5 minutes.`;

    const phoneNumber = booking.customer.phone;
    if (!phoneNumber) return json({ message: "Customer phone number not found" });

    await twilioClient.messages.create({
      body: messageBody,
      from: twilioPhone,
      to: `+91${phoneNumber}`
    });

   
  } catch (error) {
    console.error("Send OTP Error:", error);
    return json({ message: "Something went sideways" });
  }

}
BookingSchema.statics.verifyOTP= async (bookingId,otp) => {

  try {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (!booking.otp || !booking.otpExpiresAt) {
      return { message: "No OTP has been generated for this booking." };
    }

    const isOTPExpired = booking.otpExpiresAt < new Date();
    const isOTPMatch = booking.otp === otp;

    if (isOTPExpired) {
      return { message: "OTP has expired. Please request a new one." };
    }

    if (!isOTPMatch) {
      return { message: "Invalid OTP. Try again like your life depends on it." };
    }

    // Optional: Clear the OTP after successful verification
    booking.otp = undefined;
    booking.otpExpiresAt = undefined;
    booking.status = "Completed";
    await booking.save();

    return { message: "OTP verified successfully. Booking marked as completed." };
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return { message: "Server broke. Probably had too much chai." };
  }
};
BookingSchema.statics.get_all_service_providers_booking_completed=async(sp_id)=>{
  try {
    const completedBookings = await BookingModel.find({
      $or: [{ SPId: sp_id }, { Sp_id: sp_id }, { sp_id: sp_id }],
      status: "Completed"
    });

    return completedBookings;
  } catch (error) {
    console.error("Error fetching completed bookings:", error);
    throw error;
  }
}
const BookingModel = mongoose.model('Booking', BookingSchema)
module.exports = BookingModel    
   
