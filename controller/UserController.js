const User = require('../model/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const randomString = require('randomstring');
const nodemailer = require('nodemailer');

const securePassword = async (password) => {
    try {

        const hPassword = await bcryptjs.hash(password, 10);
        return hPassword;

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const createToken = async (id) => {
    try {

        const token = await jwt.sign({ _id: id }, config.SECURE_JWT_TOKEN);
        return token;

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const register = async (req, res) => {

    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const mobile = req.body.mobile;
        const type = req.body.type;


        const userCheck = await User.findOne({ "email": email });
        if (userCheck) {

            res.status(200).send({ success: false, msg: "This email id is already exists!" })

        } else {
            //create encrypted password
            const sPassword = await securePassword(password);
            //create token
            const rString = randomString.generate();
            const myToken = await createToken(rString);

            const user = new User({
                name: name,
                email: email,
                password: sPassword,
                mobile: mobile,
                type: type,
                date: Date().toString(),
                token: myToken
            });

            const userData = user.save();
            if (userData) {

                //send email
                const transport = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: config.admin_email,
                        pass: config.admin_password
                    }
                });

                const mailOption = {
                    from: config.admin_email,
                    to: email,
                    subject: `Hey ${name}, welcome to be the member of Rojkharido`,
                    html: "Thanks for registering with us. We hope that you will get all awesome discounts time to time."
                }

                transport.sendMail(mailOption, (err, success) => {
                    if (err) {
                        throw err
                    } else {
                        console.log("Mail has been sent successfully.");
                    }
                });

                const userResponse = {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    type: user.type,
                    date: user.date,
                    token: user.token,
                }

                res.status(200).send({ success: true, msg: "User details", data: userResponse });
            } else {
                res.status(200).send({ success: false, msg: "Something went wrong, Please try again!" });
            }
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }

}

const login = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ "email": email });
        if (user) {

            const user_id = user._id;

            const passwordMatch = await bcryptjs.compare(password, user.password);
            if (passwordMatch) {

                //create token
                const myToken = await createToken(user_id);

                const user_data = await User.findByIdAndUpdate({ "_id": user_id }, {
                    $set: {
                        "token": myToken
                    }
                });

                const userResponse = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    date: user.date,
                    token: myToken,
                }

                res.status(200).send({ success: true, msg: "Login successfull.", data: userResponse });

            } else {
                res.status(200).send({ success: false, msg: "Invalid credentials!" });
            }

        } else {
            res.status(200).send({ success: false, msg: "User not available!" });
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const logout = async (req, res) => {
    try {

        const user_id = req.body.user_id;

        const user = await User.findOne({ "_id": user_id });
        if (user) {

            const user = await User.findByIdAndUpdate({ "_id": user_id }, {
                $set: {
                    "token": ""
                }
            });

            if (user) {
                res.status(200).send({ success: true, msg: "User logout successfully", data: user })
            } else {
                res.status(200).send({ success: false, msg: "Something went wrong, Please try again!" })
            }

        } else {
            res.status(200).send({ success: false, msg: "User not available!" })
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

module.exports = {
    register,
    login,
    logout
}