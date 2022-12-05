const Contact = require('../model/ContactModel');
const nodemailer = require('nodemailer');
const config = require('../config/config');

const contact = async (req, res) => {

    try {
        const name = req.body.name;
        const email = req.body.email;
        const message = req.body.message;

        const contactData = new Contact({
            name: name,
            email: email,
            message: message,
            date: Date().toString(),
        });

        const contactSaveData = contactData.save();
        if (contactSaveData) {

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
                from: email,
                to: config.admin_email,
                subject: `One query raised by ${name}`,
                html: `Hey rojkharido, Please revert him as soon as possible <br><p>Name: ${name}</p><p>Name: ${email}</p><p>Message: ${message}</p>`
            }

            transport.sendMail(mailOption, (err, success) => {
                if (err) {
                    throw err
                } else {
                    console.log("Mail has been sent successfully.");
                }
            });

            const contactResponse = {
                name:name,
                email:email,
                message:message,
                date:Date().toString()
            }

            res.status(200).send({ success: true, msg: "Contact details", data: contactResponse });
        } else {
            res.status(200).send({ success: false, msg: "Something went wrong, Please try again!" });
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }

}

module.exports = {
    contact,
}