const RojkharidoStoreModel = require('../model/RojkharidoStoreModel');
const RojkharidoStorePaymentHistoryModel = require('../model/RojkharidoStorePaymentHistoryModel');
const config = require('../config/config');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const randomString = require('randomstring');

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

const addRojkharidoStore = async (req, res) => {

    try {
        const storeImage = req.file.filename;
        const storeName = req.body.storeName;
        const storeMobile = req.body.storeMobile;
        const storeEmail = req.body.storeEmail;
        const storePassword = req.body.storePassword;
        const deliveryCharge = req.body.deliveryCharge;
        const storeTiming = req.body.storeTiming;
        const pincode = req.body.pincode;
        const estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        const otherTax = req.body.otherTax;
        const landmark = req.body.landmark;
        const streetAddress = req.body.streetAddress;
        const fullAddress = req.body.fullAddress;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;
        const addedFrom = req.body.addedFrom;
        const addedBy = req.body.addedBy;
        const storeType = req.body.storeType;
        const isMobileVerified = req.body.isMobileVerified;
        const isEmailVerified = req.body.isEmailVerified;

        const paymentPurpose = req.body.paymentPurpose;
        const planMonth = req.body.planMonth;
        const paymentStatus = req.body.paymentStatus;
        const paymentId = req.body.paymentId;
        const amount = req.body.amount;
        const tax = req.body.tax;
        const totalAmount = req.body.totalAmount;

        const store = await RojkharidoStoreModel.findOne({ "storeEmail": storeEmail });
        if (!store) {

            //create encrypted password
            const sPassword = await securePassword(storePassword);

            //create token
            const rString = randomString.generate();
            const myToken = await createToken(rString);

            const storeData = new RojkharidoStoreModel({
                storeImage: storeImage,
                storeName: storeName,
                storeMobile: storeMobile,
                storeEmail: storeEmail,
                storePassword: sPassword,
                deliveryCharge: deliveryCharge,
                storeTiming: storeTiming,
                pincode: pincode,
                estimatedDeliveryTime: estimatedDeliveryTime,
                otherTax: otherTax,
                landmark: landmark,
                streetAddress: streetAddress,
                fullAddress: fullAddress,
                location: {
                    type: "Point",
                    coordinates: [
                        parseFloat(latitude),
                        parseFloat(longitude)
                    ]
                },
                addedFrom: addedFrom,
                addedBy: addedBy,
                storeType: storeType,
                isMobileVerified: isMobileVerified,
                isEmailVerified: isEmailVerified,
                date: Date().toString()
            });

            const storeSaveData = await storeData.save();
            if (storeSaveData) {

                //payment history save start
                const storePayment = new RojkharidoStorePaymentHistoryModel({
                    storeId: storeSaveData._id,
                    type: storeSaveData.storeType,
                    paymentPurpose: paymentPurpose,
                    planMonth: planMonth,
                    paymentStatus: paymentStatus,
                    paymentId: paymentId,
                    amount: amount,
                    tax: tax,
                    totalAmount: totalAmount,
                    paymentDate: Date().toString(),
                    date: Date().toString()
                });
                await storePayment.save();
                //payment history save end


                res.status(200).send({ success: true, msg: `Welcome ${storeName}, Thank your for register your store with Rojkharido, We have sent you all details related to your store registration into your email on ${storeEmail}`, data: storeSaveData });

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
                    to: storeEmail,
                    subject: `Welcome ${storeName}`,
                    html: `<h2>Thank you for register with Rojkharido.<hr style="margin:0px; padding:0px" /> </h2>
                    <h4 style="cursor:pointer;">
                        <a href='${config.BASE_URL_WEBSITE}storeEmailVerified/${storeSaveData.id}/${storeSaveData.storeEmail}/${myToken}'>
                        <button style="background:blue; color:white; font-size:32px; border-radius:8px; cursor:pointer;">Click Here</button><br />
                        <h3>Verify your store email id</h3>
                    </h4>
                    </a>
                   
                    <br/>
                    <img src='${config.BASE_URL + "RojkharidoStroreImages/" + storeImage}' style='width:200px; height:200px;' alt='' class='img-fluid'/><br/>
                    <h3>Store Details</h3><hr/>
                    <p>Name: ${storeName}</p>
                    <p>Mobile Number: ${storeMobile}</p>
                    <p>E-mail: ${storeEmail}</p>
                    <p>Delivery Charge: ${deliveryCharge}</p>
                    <p>Store Timing: ${storeTiming}</p>
                    <p>Estimated Delivery Time To Deliver: ${estimatedDeliveryTime}</p>
                    <p>Other Tax: ${otherTax}</p>
                    <p>Address: ${landmark}${streetAddress} ${fullAddress}</p>
                    <p>Store Type: ${storeType}</p>
                    <p>Added From: ${addedFrom}</p>
                    <p>Added By: ${addedBy}</p>
                    `
                }

                transport.sendMail(mailOption, (err, success) => {
                    if (err) {
                        res.status(200).send({ success: true, msg: `Welcome ${storeName}, Please contact to rojkharido for your store verification.`, data: storeSaveData });
                    } else {
                        res.status(200).send({ success: true, msg: `Welcome ${storeName}, Thank your for register your store with Rojkharido, We have sent you all details related to your store registration into your email on ${storeEmail}`, data: storeSaveData });
                    }
                });
            } else {
                res.status(200).send({ success: false, msg: "Something went wrong, Please try again!" });
            }
        } else {
            res.status(200).send({ success: false, msg: "This mobile number / email id is already exists for anathor store, Please continue with anathor email id / mobile number." });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const updateStoreEmailOrPhoneVerified = async (req, res) => {
    try {

        if (req.body.email) {

            const email = req.body.email;
            const store_id = req.body.store_id;

            const store = await RojkharidoStoreModel.findOne({ "_id": store_id, "storeEmail": email, isEmailVerified: "0" });
            if (store) {

                const store = await RojkharidoStoreModel.findByIdAndUpdate({ "_id": store_id }, {
                    $set: {
                        "isEmailVerified": "1"
                    }
                });

                if (store) {
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
                        subject: `Welcome ${email}`,
                        html: `You have successfully verified your email id on Rojkharido`
                    }

                    transport.sendMail(mailOption, (err, success) => {
                        if (err) {
                            throw err
                        } else {
                            res.status(200).send({ success: true, msg: "Email verified", data: store })
                        }
                    });
                } else {
                    res.status(200).send({ success: false, msg: "Something went wrong, Please try again!" })
                }

            } else {
                res.status(200).send({ success: false, msg: "Store not available!" })
            }
        }
        if (req.body.mobile) {
            const mobile = req.body.mobile;
            const store_id = req.body.store_id;

            const store = await RojkharidoStoreModel.findOne({ "_id": store_id, "storeMobile": mobile, isMobileVerified: "0" });
            if (store) {

                const store = await RojkharidoStoreModel.findByIdAndUpdate({ "_id": store_id }, {
                    $set: {
                        "isMobileVerified": "1"
                    }
                });

                if (store) {
                    res.status(200).send({ success: true, msg: "Phone verified", data: store })
                } else {
                    res.status(200).send({ success: false, msg: "Something went wrong, Please try again!" })
                }

            } else {
                res.status(200).send({ success: false, msg: "Store not available!" })
            }
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const allRojkharidoStore = async (req, res) => {

    try {
        const store = await RojkharidoStoreModel.find();
        if (store) {
            const allStores = [];
            for (let index = 0; index < store.length; index++) {
                allStores.push({
                    _id: store[index]._id,
                    storeImage: config.BASE_URL + "RojkharidoStroreImages/" + store[index].storeImage,
                    storeName: store[index].storeName,
                    storeMobile: store[index].storeMobile,
                    storeEmail: store[index].storeEmail,
                    storePassword: store[index].storePassword,
                    deliveryCharge: store[index].deliveryCharge,
                    storeTiming: store[index].storeTiming,
                    pincode: store[index].pincode,
                    estimatedDeliveryTime: store[index].estimatedDeliveryTime,
                    otherTax: store[index].otherTax,
                    landmark: store[index].landmark,
                    streetAddress: store[index].streetAddress,
                    fullAddress: store[index].fullAddress,
                    latitude: store[index].latitude,
                    longitude: store[index].longitude,
                    addedFrom: store[index].addedFrom,
                    addedBy: store[index].addedBy,
                    storeType: store[index].storeType,
                    isMobileVerified: store[index].isMobileVerified,
                    isEmailVerified: store[index].isEmailVerified,
                    date: store[index].date,
                });
            }
            res.status(200).send({ success: true, msg: "All Rojkharido stores", data: allStores });
        } else {
            res.status(200).send({ success: false, msg: "No stores found!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const nearestRojkharidoStore = async (req, res) => {

    const type = req.body.type;
    const limit = req.body.limit;

    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const maxDistance = req.body.maxDistance;

    try {

        let store = await RojkharidoStoreModel.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    distanceField: "distance",
                    maxDistance: maxDistance * 1609,
                    spherical: true
                }
            }
        ]).limit(limit);

        if (store) {

            const allStores = [];
            for (let index = 0; index < store.length; index++) {
                if (store[index].storeType === type) {
                    allStores.push({
                        _id: store[index]._id,
                        storeImage: config.BASE_URL + "RojkharidoStroreImages/" + store[index].storeImage,
                        storeName: store[index].storeName,
                        storeMobile: store[index].storeMobile,
                        storeEmail: store[index].storeEmail,
                        storePassword: store[index].storePassword,
                        deliveryCharge: store[index].deliveryCharge,
                        storeTiming: store[index].storeTiming,
                        pincode: store[index].pincode,
                        estimatedDeliveryTime: store[index].estimatedDeliveryTime,
                        otherTax: store[index].otherTax,
                        landmark: store[index].landmark,
                        streetAddress: store[index].streetAddress,
                        fullAddress: store[index].fullAddress,
                        latitude: store[index].latitude,
                        longitude: store[index].longitude,
                        distance: Math.floor(store[index].distance / 1000) !== 0 ? Math.floor(store[index].distance / 1000) : 0.5,
                        addedFrom: store[index].addedFrom,
                        addedBy: store[index].addedBy,
                        storeType: store[index].storeType,
                        isMobileVerified: store[index].isMobileVerified,
                        isEmailVerified: store[index].isEmailVerified,
                        date: store[index].date,
                    });
                }
            }

            res.status(200).send({ success: true, msg: "All Rojkharido stores", data: allStores });
        } else {
            res.status(200).send({ success: false, msg: "No stores found!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const rojkharidoStoreDetails = async (req, res) => {

    const id = req.body.id;

    try {
        let store = await RojkharidoStoreModel.findById({ "_id": id });

        if (store) {

            const storeData = new RojkharidoStoreModel({
                storeImage: config.BASE_URL + "RojkharidoStroreImages/" + store.storeImage,
                storeName: store.storeName,
                storeMobile: store.storeMobile,
                storeEmail: store.storeEmail,
                deliveryCharge: store.deliveryCharge,
                storeTiming: store.storeTiming,
                pincode: store.pincode,
                estimatedDeliveryTime: store.estimatedDeliveryTime,
                otherTax: store.otherTax,
                landmark: store.landmark,
                streetAddress: store.streetAddress,
                fullAddress: store.fullAddress,
                location: store.location,
                addedFrom: store.addedFrom,
                addedBy: store.addedBy,
                storeType: store.storeType,
                isMobileVerified: store.isMobileVerified,
                isEmailVerified: store.isEmailVerified,
                date: store.date
            });

            res.status(200).send({ success: true, msg: "Store details", data: storeData });
        } else {
            res.status(200).send({ success: false, msg: "No stores found!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

module.exports = {
    addRojkharidoStore,
    allRojkharidoStore,
    updateStoreEmailOrPhoneVerified,
    nearestRojkharidoStore,
    rojkharidoStoreDetails
}