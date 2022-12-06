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
                token: myToken,
                isBlocked: '0',
                isEmailVerified: '0',
                isPhoneVerified: '0',
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
                    html: `Thanks for register in Rojkharido. Please click the below link to verify your account.<br> 
                    <a href='${config.BASE_URL}emailVerified/${user.id}/${user.email}/${myToken}'>${config.BASE_URL}emailVerified/${user.id}/${user.email}/${myToken}</a>`
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
                    isBlocked: user.isBlocked,
                    isEmailVerified: user.isEmailVerified,
                    isPhoneVerified: user.isPhoneVerified,
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

const forgetPassword = async (req, res) => {

    try {
        const email = req.body.email;

        const userCheck = await User.findOne({ "email": email, "isEmailVerified": '1' });
        if (userCheck) {
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
                subject: `Hey ${email}, Forget your password!`,
                html: `Please click the below link to forget your password in Rojkharido.<br> 
                <a href='${config.BASE_URL}forgetPassword/${userCheck._id}/${userCheck.email}/${userCheck.token}'>
                ${config.BASE_URL}forgetPassword/${userCheck._id}/${userCheck.email}/${userCheck.token}</a>`
            }

            transport.sendMail(mailOption, (err, success) => {
                if (err) {
                    throw err
                } else {
                    console.log("Mail has been sent successfully.");
                }
            });

            const userResponse = {
                _id: userCheck.id,
                name: userCheck.name,
                email: userCheck.email,
                date: userCheck.date,
            }

            res.status(200).send({ success: true, msg: `Hey ${userCheck.name}, We have sent you an email on ${email}, Please check and follow all the steps to forget your current password!`, data: userResponse });

        } else {
            res.status(200).send({ success: false, msg: "This email id is not verified / exists!" });
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

            const isEmailVerified = user.isEmailVerified;
            if (isEmailVerified != "1") {
                res.status(200).send({ success: false, msg: "Email id is not verified!" });
            } else {
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
                        mobile: user.mobile,
                        type: user.type,
                        date: user.date,
                        token: myToken,
                    }

                    res.status(200).send({ success: true, msg: "Login successfull.", data: userResponse });

                } else {
                    res.status(200).send({ success: false, msg: "Invalid credentials!" });
                }
            }
        } else {
            res.status(200).send({ success: false, msg: "User not available!" });
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const updateEmailOrPhoneVerified = async (req, res) => {
    try {

        if (req.body.email) {

            const email = req.body.email;
            const user_id = req.body.user_id;

            const user = await User.findOne({ "_id": user_id, "email": email, isEmailVerified: "0" });
            if (user) {

                const user = await User.findByIdAndUpdate({ "_id": user_id }, {
                    $set: {
                        "isEmailVerified": "1"
                    }
                });

                if (user) {
                    res.status(200).send({ success: true, msg: "Email verified", data: user })
                } else {
                    res.status(200).send({ success: false, msg: "Something went wrong, Please try again!" })
                }

            } else {
                res.status(200).send({ success: false, msg: "User not available!" })
            }
        }
        if (req.body.mobile) {
            const mobile = req.body.mobile;
            const user_id = req.body.user_id;

            const user = await User.findOne({ "_id": user_id, "mobile": mobile, isPhoneVerified: "0" });
            if (user) {

                const user = await User.findByIdAndUpdate({ "_id": user_id }, {
                    $set: {
                        "isPhoneVerified": "1"
                    }
                });

                if (user) {
                    res.status(200).send({ success: true, msg: "Mobile Number verified", data: user })
                } else {
                    res.status(200).send({ success: false, msg: "Something went wrong, Please try again!" })
                }

            } else {
                res.status(200).send({ success: false, msg: "User not available!" })
            }
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}


const updateForgetPassword = async (req, res) => {
    try {

        const email = req.body.email;
        const user_id = req.body.user_id;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;

        const user = await User.findOne({ "_id": user_id, "email": email, isEmailVerified: "1" });
        if (user) {

            const passwordMatch = await bcryptjs.compare(oldPassword, user.password);
            if (passwordMatch) {

                //create encrypted password
                const sPassword = await securePassword(newPassword);

                const userr = await User.findByIdAndUpdate({ "_id": user._id }, {
                    $set: {
                        "password": sPassword
                    }
                });

                if (userr) {

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
                        subject: `Hey ${user.name}, Your password has been changed on <a href='rojkharido.com>Rojkharido</a>'`,
                        html: `If you didnt change this password then you can contact us as soon as possible on Rojkharido<br>
                        Email: ${config.admin_email}`
                    }

                    transport.sendMail(mailOption, (err, success) => {
                        if (err) {
                            throw err
                        } else {
                            console.log("Mail has been sent successfully.");
                        }
                    });

                    res.status(200).send({ success: true, msg: "Your password has been changed successfully!", data: user })
                } else {
                    res.status(200).send({ success: false, msg: "Something went wrong, Please try again!" })
                }

            } else {
                res.status(200).send({ success: false, msg: "Old password was incorrect!" });
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
    updateEmailOrPhoneVerified,
    forgetPassword,
    updateForgetPassword,
    logout
}