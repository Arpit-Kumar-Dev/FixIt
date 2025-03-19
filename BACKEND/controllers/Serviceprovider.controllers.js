const ServiceProvider = require("../models/serviceprovider.model");
const jwt = require("jsonwebtoken");
async function signupUser(req, res) {
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files); // Debugging file upload

    const { name, email, password, phoneNumber, address, Servicetype, Occupation, service_description } = req.body;
    
    console.log(req.files)
    const file = req.files?.file;

    if (!file) {
        return res.status(400).json({ status: "error", message: "Profile image is required." });
    }

    try {
        // Assuming `ServiceProvider.signup` handles saving user info and file storage
        const SP = await ServiceProvider.signup(name, email, password, phoneNumber, address, Servicetype, Occupation, service_description, file);

        // Token generation
        const token = await createToken(SP._id, name, email);

        res.status(200).json({ email: SP.email, token });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(400).json({ error: error.message });
    }
}



async function createToken(id, name, email) {
    return jwt.sign({ _id: id, name, email }, process.env.SECRET, { expiresIn: "1h" });
}

async function loginSP(req, res) {
    const { email, password } = req.body;

    try {
        const Sp = await ServiceProvider.login(email, password);
        const token = await createToken(Sp._id, Sp.name, Sp.email,Sp.profileImageUrl);
        res.status(201).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function get_all_service_providers(req, res) {
    try {
        const all_service_providers = await ServiceProvider.getAllServiceProviders();
        console.log(all_service_providers)
        res.json(all_service_providers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch service providers" });
    }
}

module.exports = { signupUser, loginSP, get_all_service_providers };
