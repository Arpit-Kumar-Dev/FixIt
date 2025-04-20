const Booking = require("../models/booking.model")
const mongoose = require("mongoose")

async function CreateBooking(req,res){
    const { userId,SPId,service} = req.body
    const BookingId = await Booking.CreateBooking(userId,SPId,service)
    res.status(200).json({"Bookingid":BookingId.id,"BookingDate":BookingId.createdAt,"service":BookingId.service,"status":BookingId.status})
}

async function UserBooking(req,res){
    const {userId} = req.body
    const UserBooking = await Booking.Userbookings(userId)
    res.status(200).json(UserBooking)
}
async function get_all_service_providers_booking(req,res){
    const {SPId}=req.body
    const sp_bookings = await Booking.Get_All_service_provides_booking(SPId)
    console.log(sp_bookings)
    res.status(200).json(sp_bookings)
}



async function DeleteBooking(req,res){
    let {bookingId} = req.body
    const DeletedBooking = await Booking.Deletebooking(bookingId)
    res.status(200).json(DeletedBooking)
}

async function UpdateStatus(req,res){
    const {Id,status}=req.body
    const BookingId = new mongoose.Types.ObjectId(Id);
    const UpdatedStatus = await Booking.UpdateStatus(BookingId,status)
    res.status(200).json(UpdatedStatus)
}

async function GetAllBookings(req, res) {
    try {
        const bookings = await Booking.GetAllBookings();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {CreateBooking,UserBooking,get_all_service_providers_booking,DeleteBooking,UpdateStatus,GetAllBookings}