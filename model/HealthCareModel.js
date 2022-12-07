const mongoose = require("mongoose");

const HealthCare = mongoose.Schema({
    paymentId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    planTitle: {
        type: String,
        required: true
    },
    planContent: {
        type: String,
        required: true
    },
    planImage: {
        type: String,
        required: true
    },
    planPrice: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    couponAppliedDiscount: {
        type: String,
        required: true
    },
    sizes: {
        type: Array,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    duration_months: {
        type: String,
        required: true
    },
    gstAmount: {
        type: String,
        required: true
    },
    couponAmount: {
        type: String,
        required: true
    },
    totalAmount: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("HealthCare", HealthCare);