const { generateToken } = require("../helpers/auth");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

class UserController {
    static async Register(req, res, next) {
        const params = req.body;
        const email = params.email.toLowerCase();
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(409).json({ error: 'Email already exists' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(params.password, salt);
        const userCheck = userModel.create({
            email,
            firstName: params.firstName,
            lastName: params.lastName,
            password: hashedPassword
        });
        if (!userCheck) return res.status(500).json({ error: 'Cannot make user' });
        const token = generateToken(userCheck._id);
        return token;
    }
}
module.exports = UserController