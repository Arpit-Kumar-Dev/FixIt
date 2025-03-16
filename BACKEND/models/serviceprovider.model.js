const mongoose = require('mongoose');
const validator = require("validator")
const bcrypt = require("bcrypt")
const { v4 } = require("uuid");
const { PutObjectCommand } = require("../util/putObject");
const serviceProviderSchema = new mongoose.Schema({
    Profile_imageUrl:{
        type:String,
        required:false,
    },
    key:{
        type:String,
        required:true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        trim: true
    },
    address:{

            pincode:Number,
            city:String,
            state:String,
            area:String,  
       },
    Servicetype:{ type: String, enum: ['Skilled Trades and Local Service Occupations', 'Home and Personal Services', 'Construction and Building Maintenance','Other Local Services'], default: 'Other Local Services' },

    Occupation:{ type: String, enum: ['Plumber', 'Electrician', 'Carpenter','Welder','Painter','Mason','HVAC Technician (Heating, Ventilation, and Air Conditioning)','Roofer','Mechanic','Blacksmith',
        'House Cleaner','Pest Control Technician','Gardener','Landscaper','Handyman','Locksmith','Appliance Repair Technician','Window Cleaner','Pool Technician','Sewer and Drain Specialist',
        'Barber','Hairdresser','Makeup','Tailor','Cobbler (Shoe Repair)','Laundry Worker/Dry Cleaner','Upholsterer','Mover','Courier/Delivery Person',
        'Tile Setter','Flooring Specialist','Scaffolder','Construction Laborer','Heavy Equipment Operator','Bricklayer','Fence Installer','Deck Builder','Excavator Operator','Steel Fabricator','Crane Operator'
    ], default: 'Not mensioned' },
    service_description: {
        type: String,
        required: true
    }
},{
    timestamps:true,
});

serviceProviderSchema.statics.signup = async function (name, email, password, phoneNumber, address,Servicetype, Occupation, service_description,file) {
    if (!name || !email || !password || !phoneNumber ||!Occupation||!Servicetype|| !service_description||!file) {
        throw new Error("All fields are required, including Profile Image.");
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
    
    // Upload to S3
    const fileName = "images/" + v4();
    const { url, key } = await PutObjectCommand(file.data, fileName); // Use `file.buffer` for memory storage
    
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

    const serviceProvider = await this.create({
        name,
        email,
        password: hashedPassword,
        Profile_imageUrl: url,
        key,
        phoneNumber,
        address,
        Servicetype,
        Occupation,
        service_description

    });

    return {
        _id: serviceProvider._id,
        name: serviceProvider.name,
        email: serviceProvider.email,
        profileImageUrl: serviceProvider.Profile_imageUrl, 
        phoneNumber: serviceProvider.phoneNumber,
    };
};

serviceProviderSchema.statics.login = async function (email, password) {
    if (!email|| !password) {
        throw Error("All fildes are required.")

    }
    if (!validator.isEmail(email)) {
        throw Error("Not a proper Email");
    }
    const user = await this.findOne({ email })
    if (!user) {
        throw Error("account not found")
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error("incorect Password")
    }
    return user
}

serviceProviderSchema.statics.getAllServiceProviders= async ()=>{  
   const all_providers = await ServiceProvider.find({})
   return all_providers
}
const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
module.exports = ServiceProvider;