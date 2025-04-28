const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function createToken(user) {
    console.log(user)
    return jwt.sign(
        { _id: user._id, name: user.name, email: user.email,pincode:user.pincode ,imageURL: user.profileImageUrl}, 
        process.env.SECRET, 
        { expiresIn: "1h" }
    );
   
}

async function signupUser(req, res) {
    const { name, email, password, phoneNumber, address } = req.body;
    const file = req.files?.file;

    if (!file) {
        return res.status(400).json({ status: "error", message: "Profile image is required." });
    }

    try {
        const user = await User.signup(name, email, password, phoneNumber, address, file);
        const token = await createToken(user);
        res.status(200).json({ name: user.name, email: user.email, phoneNumber: user.phoneNumber, address: user.address, token });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    
    try {
        const user = await User.login(email, password);
        const token = await createToken(user);
        res.status(200).json({ name: user.name, email: user.email,token });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

// async function updateProfileImage(req, res) {
//     const userId = req.user._id;
//     const file = req.files?.file;

//     if (!file) {
//         return res.status(400).json({ status: "error", message: "New profile image is required." });
//     }

//     try {
//         const updatedUser = await User.updateProfileImage(userId, file);
//         res.status(200).json({ status: "success", profileImageUrl: updatedUser.profileImageUrl });
//     } catch (error) {
//         res.status(400).json({ status: "error", message: error.message });
//     }
// }

async function getAllUsers(req, res) {
    try {
        const users = await User.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch users." });
    }
}
async function getUsers(req, res) {
    try {
        const {userId}=req.body
        const user = await User.getUserById(userId);
        res.status(200).json(user);
    }catch (error) {
        res.status(500).json({ status: error, message: "Failed to fetch users." });
    }
}

module.exports = { signupUser, loginUser, getAllUsers,getUsers};
