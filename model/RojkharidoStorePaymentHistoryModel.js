const mongoose = require("mongoose");

const RojkharidoStorePaymentHistoryModel = mongoose.Schema({
    paymentPurpose: {
        type: String,
        required: true
    },
    planMonth: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    storeId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    tax: {
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

module.exports = mongoose.model("StorePaymentsHistory", RojkharidoStorePaymentHistoryModel);