const mongoose = require("mongoose");

const AddStore = mongoose.Schema({
    storeImage: {
        type: String,
        required: true
    },
    storeName: {
        type: String,
        required: true
    },
    storeMobile: {
        type: String,
        required: true
    },
    storeEmail: {
        type: String,
        required: true
    },
    storePassword: {
        type: String,
        required: true
    },
    deliveryCharge: {
        type: String,
        required: true
    },
    storeTiming: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    estimatedDeliveryTime: {
        type: String,
        required: true
    },
    otherTax: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    streetAddress: {
        type: String,
        required: true
    },
    fullAddress: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    addedFrom: {
        type: String,
        required: true
    },
    addedBy: {
        type: String,
        required: true
    },
    storeType: {
        type: String,
        required: true
    },
    isMobileVerified: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
    planMonth: {
        type: String,
        required: true
    },
    paymentPurpose: {
        type: String,
        required: true
    },
    paymentDate: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("Store", AddStore);