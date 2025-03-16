const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { v4 } = require("uuid");
const { PutObjectCommand } = require("../util/putObject");

const UserSchema = new mongoose.Schema(
    {
        name:{type:String,required:true},
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validator.isEmail, "Invalid email format"],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        profileImageUrl: {
            type: String,
            required: false,
        },
        key: {
            type: String,
            required: true,
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
        },
        phoneNumber: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return validator.isMobilePhone(value, "any", { strictMode: false });
                },
                message: "Invalid phone number",
            },
        },
        address: {

             pincode:Number,
             city:String,
             state:String,
             area:String,
            
        }
    },
    { timestamps: true }
);
UserSchema.statics.signup = async function (name, email, password, phoneNumber, address, file) {
    if (!name || !email || !password || !phoneNumber || !file) {
        throw new Error("Name, Email, password, phone number, address, and profile image are required.");
    }
    if (!validator.isEmail(email)) {
        throw new Error("Invalid email format.");
    }
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
    }
    if (!validator.isMobilePhone(phoneNumber, "any", { strictMode: false })) {
        throw new Error("Invalid phone number.");
    }
    const existingUser = await this.findOne({ email });
    if (existingUser) {
        throw new Error("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const fileName = "images/" + v4();
    const { url, key } = await PutObjectCommand(file.data, fileName);
    if (!url || !key) {
        throw new Error("Image upload failed.");
    }

    if (typeof address === "string") {
        try {
            address = JSON.parse(address); 
        } catch (error) {
            throw new Error("Invalid address format. Address must be a valid JSON object.");
        }
    }

    const user = await this.create({
        name,
        email,
        password: hashedPassword,
        profileImageUrl: url,
        key,
        phoneNumber,
        address,
    });

    return { 
        _id: user._id,  
        name: user.name, 
        email: user.email, 
        profileImageUrl: user.profileImageUrl, 
        phoneNumber: user.phoneNumber 
    };
};

UserSchema.statics.updateProfileImage = async function (userId, file) {
    try {
        const user = await this.findById(userId);
        if (!user) {
            throw new Error("User not found.");
        }

        // Upload new file to S3
        const { url, key } = await PutObjectCommand(file.data, "images/" + v4());

        // Update user's profile image
        user.profileImageUrl = url;
        user.key = key;
        await user.save();

        return user;
    } catch (err) {
        throw new Error("Error updating profile image: " + err.message);
    }
};

UserSchema.statics.getAllUsers = async function () {
    return await this.find({});
};

UserSchema.statics.getUserById = async function (userId) {
    if (!userId) {
        throw new Error("User ID is required");
    }
    const user = await this.findById(userId); 

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

UserSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Invalid email format.");
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw new Error("Account not found.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Incorrect password.");
    }

    return user;
};

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
