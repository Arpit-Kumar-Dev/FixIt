
const mongoose = require("mongoose")
const BookingSchema = new mongoose.Schema({
  user_id:{type:String},
  Sp_id:{type:String},
  service: String,
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed"],
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
    const UserBookings = await BookingModel.find({userId});
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

const BookingModel = mongoose.model('Booking', BookingSchema)
module.exports = BookingModel    
   
