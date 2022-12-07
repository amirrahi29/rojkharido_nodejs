const HealthCare = require('../model/HealthCareModel');
const config = require('../config/config');
const nodemailer = require('nodemailer');

const newHealthPlan = async (req, res) => {
    try {

        const paymentId = req.body.paymentId;
        const name = req.body.name;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const amount = req.body.amount;
        const planDetail = req.body.planDetail;
        const currency = req.body.currency;
        const couponAppliedDiscount = req.body.couponAppliedDiscount;
        const duration_months = req.body.duration_months;
        const gstAmount = req.body.gstAmount;
        const couponAmount = req.body.couponAmount;
        const totalAmount = req.body.totalAmount;

        if (paymentId && name && email && mobile && amount && planDetail) {
            const healthcare = new HealthCare({
                paymentId: paymentId,
                name: name,
                email: email,
                mobile: mobile,
                amount: amount,
                planTitle: planDetail.title,
                planContent: planDetail.content,
                planImage: config.BASE_URL + planDetail.image,
                planPrice: planDetail.price,
                currency: currency,
                couponAppliedDiscount: couponAppliedDiscount,
                sizes: planDetail.sizes,
                duration_months: duration_months,
                gstAmount: gstAmount,
                couponAmount: couponAmount,
                totalAmount: totalAmount,
                date: Date().toString(),
            });

            console.log(planDetail.sizes);

            const healthcareData = await healthcare.save();
            if (healthcareData) {

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
                    subject: `${config.APP_TITLE} Health Plan ( ${planDetail.title} )`,
                    html: `
                    <h2>Hey ${name}, Thank you for purchasing ${config.APP_TITLE} Health Plan ( ${planDetail.title} ) for ${duration_months} Months.</h2>
                    <p>${planDetail.content}</p>
                    <hr/>
                    <h3>Your Plan Details</h3>
                    <hr/>
                    ${`<html><ul>` + planDetail.sizes.map(function(a) { return `<li>${a}</li>` }).join('') + `</ul></html>`}
                    <hr/>
                    <h3>Invoice Details</h3>
                    <hr/>
                    <p>Amount: ₹ ${amount}.00 X ${duration_months} Months = ${amount * duration_months}.00</p>
                    <p>Gst Amount (18%): ₹ ${gstAmount}.00</p>
                    <p>Coupon Discounted Amount (${couponAppliedDiscount}): ₹ ${couponAmount}.00</p>
                    <hr/>
                    <h3>Total Amount: ₹ ${totalAmount}.00</h3>
                    <br/> <br/> <br/> <br/>
                        <img src='${config.BASE_URL}static/media/logo.5526e878bafd14cb7ba5.png' style='width:100px; height:100px;' alt='' class='img-fluid'/><br/>
                        Email: ${config.admin_email}<br/>
                        Website: ${config.BASE_URL}
                    `
                }

                transport.sendMail(mailOption, (err, success) => {
                    if (err) {
                        res.status(200).send({ success: false, msg: err.message });
                    } else {
                        res.status(200).send({ success: true, msg: "Health plan details", data: healthcareData });
                    }
                });
            }else{
                res.status(200).send({ success: false, msg: "Plan addition failed" });
            }
        }
        else {
            res.status(200).send({ success: false, msg: "Some details are missing!" });
        }


    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

module.exports = {
    newHealthPlan
}